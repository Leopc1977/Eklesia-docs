---
title: Provider
---

# Provider

A **Provider** is the AI backend abstraction in Eklesia. It defines how agents communicate with language models to generate responses.

## Overview

Eklesia ships with three provider types:

- **`Provider`** : The abstract base class
- **`OpenAIGenericProvider`** : Works with any OpenAI-compatible API (OpenAI, local models, etc.)
- **`TerminalInputProvider`** : Reads input from the terminal (for human participation)

## Provider (Base Class)

The base `Provider` class defines the interface that all providers must implement.

### Constructor

```typescript
new Provider(
  temperature?: number,
  max_tokens?: number,
)
```

| Parameter     | Type     | Default | Description                               |
| ------------- | -------- | ------- | ----------------------------------------- |
| `temperature` | `number` | `0.7`   | Controls randomness in the model's output |
| `max_tokens`  | `number` | `300`   | Maximum number of tokens in the response  |

### Methods

#### `query(messages, temperature?)`

Sends messages to the AI backend and returns a completion response. This method must be implemented by subclasses.

```typescript
async query(
  messages: Array<Message>,
  temperature?: number,
): Promise<ChatCompletionResponse>
```

## OpenAIGenericProvider

The `OpenAIGenericProvider` works with any API that follows the OpenAI chat completions format. This includes OpenAI itself, local model servers (LM Studio, Ollama, llama.cpp), and other compatible endpoints.

### Constructor

```typescript
import { OpenAIGenericProvider } from "eklesia";

// OpenAI
const openai = new OpenAIGenericProvider(
  "gpt-4",
  "https://api.openai.com/v1/chat/completions",
  process.env.OPENAI_API_KEY!,
);

// Local model (e.g., LM Studio, Ollama)
const local = new OpenAIGenericProvider(
  "deepseek-llm-7b-chat",
  "http://127.0.0.1:8081/v1/chat/completions",
  "not-needed",
);
```

```typescript
new OpenAIGenericProvider(
  model: string,
  endpointUrl: string,
  apiKey: string,
  temperature?: number,
  max_tokens?: number,
)
```

| Parameter     | Type     | Default | Description                             |
| ------------- | -------- | ------- | --------------------------------------- |
| `model`       | `string` | —       | The model identifier (e.g., `"gpt-4"`) |
| `endpointUrl` | `string` | —       | The API endpoint URL                    |
| `apiKey`      | `string` | —       | The API key for authentication          |
| `temperature` | `number` | `0.7`   | Controls randomness in output           |
| `max_tokens`  | `number` | `300`   | Maximum tokens in response              |

### How It Works

The provider sends a POST request to the endpoint with:

```json
{
  "model": "gpt-4",
  "temperature": 0.7,
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

The response follows the OpenAI `ChatCompletionResponse` format:

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

## TerminalInputProvider

The `TerminalInputProvider` reads input from the terminal using `prompt()`. This lets a human participate as an agent in a simulation.

```typescript
import { TerminalInputProvider } from "eklesia";

const terminalProvider = new TerminalInputProvider();
```

No configuration is needed. When `query()` is called, it prompts the user for input and wraps the response in the standard `ChatCompletionResponse` format.

## Provider Selection with `getProviderByType`

When loading configurations from JSON, Eklesia uses `getProviderByType` to instantiate the correct provider:

```typescript
import { getProviderByType } from "eklesia";

const provider = getProviderByType(
  "openai-chat", // type
  "gpt-4",       // model
  "https://api.openai.com/v1/chat/completions", // endpoint
  apiKey,
  0.7,           // temperature
  300,           // max_tokens
);
```

Currently supported types:
- `"openai-chat"` : `OpenAIGenericProvider`

## Next Steps

- [Agent](/core-concepts/agent) : Agents that use providers to generate responses
- [Custom Provider](/advanced/custom-provider) : Build your own provider
