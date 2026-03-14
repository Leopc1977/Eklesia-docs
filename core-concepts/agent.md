---
title: Agent
---

# Agent

An **Agent** is an AI entity that participates in a simulation. Each agent has a name, a role description, and a [Provider](/core-concepts/provider) that connects it to an AI backend.

## Overview

Eklesia provides three agent types:

- **`Agent`** : The standard AI agent backed by a provider
- **`Moderator`** : A specialized agent that evaluates terminal conditions
- **`User`** : An agent backed by human terminal input

## Agent (Base Class)

### Constructor

```typescript
import { Agent, OpenAIGenericProvider } from "eklesia";

const provider = new OpenAIGenericProvider(
  "gpt-4",
  "https://api.openai.com/v1/chat/completions",
  process.env.API_KEY!,
);

const agent = new Agent(
  "Alice",
  "You are a creative problem solver who thinks outside the box.",
  provider,
);
```

```typescript
new Agent<GenericProvider>(
  agentName: string,
  roleDesc: string,
  provider: GenericProvider,
  mergeOtherAgentAsUser?: boolean,
  requestMsg?: Message | null,
)
```

| Parameter               | Type              | Default | Description                                                    |
| ----------------------- | ----------------- | ------- | -------------------------------------------------------------- |
| `agentName`             | `string`          | —       | The agent's display name                                       |
| `roleDesc`              | `string`          | —       | A description of the agent's role and personality              |
| `provider`              | `Provider`        | —       | The AI backend that generates responses                        |
| `mergeOtherAgentAsUser` | `boolean`         | `false` | Whether to merge other agents' messages into one user message  |
| `requestMsg`            | `Message \| null` | `null`  | A custom prompt to use instead of the default "Now you speak"  |

### Properties

| Property                | Type              | Description                            |
| ----------------------- | ----------------- | -------------------------------------- |
| `agentName`             | `string`          | The agent's name                       |
| `roleDesc`              | `string`          | The agent's role description           |
| `provider`              | `Provider`        | The AI backend provider                |
| `mergeOtherAgentAsUser` | `boolean`         | Whether to merge other agents' messages |
| `requestMsg`            | `Message \| null` | Custom request message, if set         |

### Methods

#### `act(observation, environmentDescription)`

Generates a response based on the conversation history and environment context. This is the main method called by the orchestrator during each step.

```typescript
const response = await agent.act(messages, "A debate about AI safety.");
```

| Parameter                | Type             | Description                                        |
| ------------------------ | ---------------- | -------------------------------------------------- |
| `observation`            | `Array<Message>` | The conversation history visible to the agent      |
| `environmentDescription` | `string`         | The environment's description text                 |

**Returns:** `Promise<string>`: The agent's response text.

### How Messages Are Constructed

When an agent acts, it builds a prompt from:

1. A **system prompt** combining the environment description, the agent's name, and its role description
2. The **conversation history**, where:
   - Messages from the agent itself become `assistant` messages
   - Messages from other agents become `user` messages (prefixed with `[AgentName]`)
   - System messages remain as `system` messages
3. A final **request prompt**: either the custom `requestMsg` or the default `"Now you speak, {agentName}."`

## Moderator

The **Moderator** is a specialized agent that evaluates whether a conversation should end. It extends `Agent` with additional properties for terminal condition checking.

### Constructor

```typescript
import { Moderator, OpenAIGenericProvider } from "eklesia";

const moderator = new Moderator(
  "Evaluate the discussion and determine if consensus has been reached.",
  "end discussion",
  ["The discussion has concluded.", "Consensus reached."],
  "round",
  provider,
);
```

| Parameter                 | Type            | Description                                                     |
| ------------------------- | --------------- | --------------------------------------------------------------- |
| `roleDesc`                | `string`        | The moderator's role description                                |
| `terminalConditionPrompt` | `string`        | Prompt used when evaluating terminal conditions                 |
| `terminalSentences`       | `Array<string>` | Phrases that, if found in the response, signal termination      |
| `period`                  | `string`        | When to check: `"turn"` (every turn) or `"round"` (per round)  |
| `provider`                | `Provider`      | The AI backend for evaluation                                   |

### How Terminal Checking Works

1. The environment calls `moderator.act()` with the full conversation and the `terminalConditionPrompt`
2. The moderator's AI provider generates a response
3. The environment checks if any of the `terminalSentences` appear in the response
4. If a match is found, the simulation ends

## User

The **User** agent allows a human to participate in a simulation through terminal input. It uses the `TerminalInputProvider` to read input from `stdin`.

```typescript
import { User, TerminalInputProvider } from "eklesia";

const terminalProvider = new TerminalInputProvider();
const user = new User(terminalProvider);
```

## Next Steps

- [Provider](/core-concepts/provider): The AI backends that power agents
- [Custom Agent](/advanced/custom-agent): Create specialized agent types
