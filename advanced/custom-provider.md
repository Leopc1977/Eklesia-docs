---
title: Custom Provider
---

# Custom Provider

Eklesia's [Provider](/core-concepts/provider) abstraction lets you connect agents to any AI backend. Create a custom provider to integrate models that don't follow the OpenAI API format.

## Extending the Base Provider

```typescript
import { Provider } from "eklesia";
import type { Message, ChatCompletionResponse } from "eklesia";

class AnthropicProvider extends Provider {
  private apiKey: string;
  private model: string;

  constructor(
    model: string,
    apiKey: string,
    temperature?: number,
    max_tokens?: number,
  ) {
    super(temperature, max_tokens);
    this.model = model;
    this.apiKey = apiKey;
  }

  async query(messages: Array<Message>): Promise<ChatCompletionResponse> {
    // Convert messages to Anthropic format
    const systemMessage = messages.find((m) => m.role === "system");
    const nonSystemMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.max_tokens,
        system: systemMessage?.content ?? "",
        messages: nonSystemMessages,
      }),
    });

    const data = await res.json();

    // Convert Anthropic response to OpenAI format
    return {
      id: data.id,
      object: "chat.completion",
      created: Date.now(),
      model: this.model,
      choices: [
        {
          index: 0,
          finish_reason: data.stop_reason ?? "stop",
          message: {
            role: "assistant",
            content: data.content?.[0]?.text ?? "",
          },
        },
      ],
    };
  }
}
```

## The ChatCompletionResponse Interface

Your provider's `query()` method must return data matching this interface:

```typescript
interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string | null;
    message: {
      role: "system" | "user" | "assistant" | "tool";
      content: string | null;
    };
  }>;
}
```

The agent reads the response from `choices[0].message.content`.

## Example: Static Provider (for Testing)

A provider that returns predefined responses, useful for testing:

```typescript
class StaticProvider extends Provider {
  private responses: string[];
  private index = 0;

  constructor(responses: string[]) {
    super();
    this.responses = responses;
  }

  async query(_messages: Array<Message>): Promise<ChatCompletionResponse> {
    const content = this.responses[this.index % this.responses.length];
    this.index++;

    return {
      id: `static-${this.index}`,
      object: "chat.completion",
      created: Date.now(),
      model: "static",
      choices: [
        {
          index: 0,
          finish_reason: "stop",
          message: { role: "assistant", content },
        },
      ],
    };
  }
}
```

## Usage

```typescript
import { Agent, Arena, Orchestrator, ConversationEnvironment } from "eklesia";

const provider = new AnthropicProvider(
  "claude-sonnet-4-20250514",
  process.env.ANTHROPIC_API_KEY!,
);

const agent = new Agent(
  "Claude",
  "You are a thoughtful conversationalist.",
  provider,
);

const environment = new ConversationEnvironment("A philosophical discussion.");
const orchestrator = new Orchestrator(environment);
const arena = new Arena([agent], orchestrator, environment);

await arena.run(10);
```

## Key Points

- Override `query()` to implement your AI backend integration
- Always return a `ChatCompletionResponse` — the agent expects `choices[0].message.content`
- Use `this.temperature` and `this.max_tokens` from the base class
- The `messages` parameter uses the standard `{ role, content }` format
