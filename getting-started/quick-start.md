---
title: Quick Start
---

# Quick Start

This guide walks you through creating your first multi-agent simulation with Eklesia.

## Prerequisites

Make sure you have [installed Eklesia](/getting-started/installation) and have access to an OpenAI-compatible API endpoint (OpenAI, a local model server, etc.).

## 1. Create a New File

Create a file called `main.ts` in your project:

```typescript
import {
  Arena,
  Agent,
  Orchestrator,
  ConversationEnvironment,
  OpenAIGenericProvider,
} from "eklesia";
```

## 2. Set Up a Provider

A provider connects your agents to an AI backend. The `OpenAIGenericProvider` works with any OpenAI-compatible API:

```typescript
// Using OpenAI
const provider = new OpenAIGenericProvider(
  "gpt-4",
  "https://api.openai.com/v1/chat/completions",
  process.env.API_KEY!,
);

// Or using a local model (e.g., LM Studio, Ollama)
const provider = new OpenAIGenericProvider(
  "deepseek-llm-7b-chat",
  "http://127.0.0.1:8081/v1/chat/completions",
  "not-needed",
);
```

## 3. Create Agents

Each agent has a name, a role description, and a provider:

```typescript
const agent1 = new Agent(
  "Optimist",
  "You always see the bright side of things and propose constructive solutions.",
  provider,
);

const agent2 = new Agent(
  "Skeptic",
  "You question assumptions and point out potential problems.",
  provider,
);
```

## 4. Set Up the Environment

The environment describes the context for the conversation:

```typescript
const environment = new ConversationEnvironment(
  "A discussion about the future of artificial intelligence in education.",
);
```

## 5. Create the Orchestrator and Arena

The orchestrator manages turn-taking. The arena ties everything together:

```typescript
const orchestrator = new Orchestrator(environment);

const arena = new Arena(
  [agent1, agent2],
  orchestrator,
  environment,
);
```

## 6. Run the Simulation

```typescript
const agentsCount = 2;
const totalTurns = 5;

await arena.run(agentsCount * totalTurns);
```

## Full Example

```typescript
import {
  Arena,
  Agent,
  Orchestrator,
  ConversationEnvironment,
  OpenAIGenericProvider,
} from "eklesia";

const provider = new OpenAIGenericProvider(
  "gpt-4",
  "https://api.openai.com/v1/chat/completions",
  process.env.API_KEY!,
);

const agent1 = new Agent(
  "Optimist",
  "You always see the bright side of things and propose constructive solutions.",
  provider,
);

const agent2 = new Agent(
  "Skeptic",
  "You question assumptions and point out potential problems.",
  provider,
);

const environment = new ConversationEnvironment(
  "A discussion about the future of artificial intelligence in education.",
);

const orchestrator = new Orchestrator(environment);

const arena = new Arena([agent1, agent2], orchestrator, environment);

await arena.run(10);
```

Run it with:

```bash
bun run main.ts
```

## Adding Human Participation

You can include a human participant using the `User` agent and `TerminalInputProvider`:

```typescript
import { User, TerminalInputProvider } from "eklesia";

const terminalProvider = new TerminalInputProvider();
const humanUser = new User(terminalProvider);

const arena = new Arena(
  [humanUser, agent1, agent2],
  orchestrator,
  environment,
);

await arena.run(18); // 3 agents × 6 rounds
```

When it's the human's turn, the terminal will prompt for input.

## Using a JSON Configuration

You can also define your simulation in a JSON file and load it:

```typescript
import { Arena } from "eklesia";
import { readFileSync } from "fs";

const config = readFileSync("config.json", "utf-8");
const arena = await Arena.loadConfigJSON(config);

await arena.run(60);
```

See the [examples on GitHub](https://github.com/Leopc1977/Eklesia/tree/main/examples) for JSON config formats.

## Next Steps

- [Core Concepts](/core-concepts/arena) — Understand the building blocks
- [Custom Agent](/advanced/custom-agent) — Create specialized agent types
- [Custom Environment](/advanced/custom-environment) — Build your own environments
