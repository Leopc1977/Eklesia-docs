---
title: Custom Agent
---

# Custom Agent

The base [Agent](/core-concepts/agent) class handles prompt construction and provider interaction. You can extend it to add custom behavior, memory, or processing logic.

## Extending the Base Agent

```typescript
import { Agent, Provider } from "eklesia";
import type { Message } from "eklesia";

class MemoryAgent extends Agent {
  private longTermMemory: string[] = [];

  constructor(agentName: string, roleDesc: string, provider: Provider) {
    super(agentName, roleDesc, provider);
  }

  async act(
    observation: Array<Message>,
    environmentDescription: string,
  ): Promise<string> {
    // Prepend long-term memory to the environment description
    const memoryContext = this.longTermMemory.length > 0
      ? `\n\nYour memories from previous sessions:\n${this.longTermMemory.join("\n")}`
      : "";

    const response = await super.act(
      observation,
      environmentDescription + memoryContext,
    );

    // Store key information in long-term memory
    if (response.includes("important:")) {
      this.longTermMemory.push(response);
    }

    return response;
  }

  addMemory(memory: string) {
    this.longTermMemory.push(memory);
  }
}
```

## Example: Filtered Agent

An agent that post-processes its responses:

```typescript
class FilteredAgent extends Agent {
  private forbiddenWords: string[];

  constructor(
    agentName: string,
    roleDesc: string,
    provider: Provider,
    forbiddenWords: string[],
  ) {
    super(agentName, roleDesc, provider);
    this.forbiddenWords = forbiddenWords;
  }

  async act(
    observation: Array<Message>,
    environmentDescription: string,
  ): Promise<string> {
    let response = await super.act(observation, environmentDescription);

    // Filter out forbidden words
    for (const word of this.forbiddenWords) {
      response = response.replaceAll(word, "[redacted]");
    }

    return response;
  }
}
```

## Example: Logging Agent

An agent that logs all interactions:

```typescript
class LoggingAgent extends Agent {
  private log: Array<{ timestamp: Date; input: number; output: string }> = [];

  async act(
    observation: Array<Message>,
    environmentDescription: string,
  ): Promise<string> {
    const response = await super.act(observation, environmentDescription);

    this.log.push({
      timestamp: new Date(),
      input: observation.length,
      output: response,
    });

    return response;
  }

  getLog() {
    return this.log;
  }
}
```

## Usage

```typescript
import { Arena, Orchestrator, ConversationEnvironment, OpenAIGenericProvider } from "eklesia";

const provider = new OpenAIGenericProvider(
  "gpt-4",
  "https://api.openai.com/v1/chat/completions",
  process.env.API_KEY!,
);

const agent = new MemoryAgent(
  "Historian",
  "You remember facts from all conversations.",
  provider,
);

agent.addMemory("The team decided to use TypeScript for the project.");

const environment = new ConversationEnvironment("A project planning meeting.");
const orchestrator = new Orchestrator(environment);

const arena = new Arena([agent], orchestrator, environment);
await arena.run(10);
```

## Key Points

- Override `act()` to customize agent behavior
- Call `super.act()` to use the built-in prompt construction and provider query
- The `mergeOtherAgentAsUser` constructor option controls how other agents' messages are formatted
- The `requestMsg` option lets you customize the final prompt sent to the agent
- Error handling is built in, if the provider fails, `act()` returns a termination signal
