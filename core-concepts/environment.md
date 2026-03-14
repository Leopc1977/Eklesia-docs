---
title: Environment
---

# Environment

The **Environment** represents the context or world in which agents operate. It tracks messages, provides observations to agents, and determines when the simulation should end.

## Overview

Eklesia provides two environment classes:

- **`Environment`** — The abstract base class that defines the interface
- **`ConversationEnvironment`** — A concrete implementation for multi-agent conversations

## Environment (Base Class)

The base `Environment` class defines the interface that all environments must implement. It holds a description and an optional [Moderator](/core-concepts/agent#moderator).

### Constructor

```typescript
new Environment(
  description?: string,
  moderator?: Moderator | null,
)
```

| Parameter     | Type              | Default | Description                                    |
| ------------- | ----------------- | ------- | ---------------------------------------------- |
| `description` | `string`          | `""`    | A text description of the environment context  |
| `moderator`   | `Moderator\|null` | `null`  | An optional moderator agent for terminal checks |

### Methods to Implement

| Method           | Returns            | Description                                       |
| ---------------- | ------------------ | ------------------------------------------------- |
| `getObservation` | `any`              | Returns relevant state/messages for a given agent  |
| `addMessage`     | `void`             | Records an agent's action in the environment       |
| `isTerminal`     | `Promise<boolean>` | Checks if the simulation should end                |

## ConversationEnvironment

`ConversationEnvironment` is the built-in environment for multi-agent conversations. It stores messages in order and supports moderator-based terminal conditions.

### Constructor

```typescript
import { ConversationEnvironment } from "eklesia";

const env = new ConversationEnvironment(
  "A panel discussion about renewable energy.",
  moderator, // optional
);
```

| Parameter     | Type              | Default | Description                                            |
| ------------- | ----------------- | ------- | ------------------------------------------------------ |
| `description` | `string`          | —       | A description of the conversation context              |
| `moderator`   | `Moderator\|null` | `null`  | An optional moderator for terminal condition checks     |

### Properties

| Property       | Type              | Description                              |
| -------------- | ----------------- | ---------------------------------------- |
| `messages`     | `Array<Message>`  | The conversation history                 |
| `nextAgentIdx` | `number`          | Tracks the next agent (used internally)  |
| `description`  | `string`          | The environment description              |
| `moderator`    | `Moderator\|null` | The moderator agent, if set              |

### Methods

#### `addMessage(agentName, content)`

Adds a new message to the conversation history.

```typescript
env.addMessage("Alice", "I think we should invest in solar energy.");
```

#### `getObservation(agentName?)`

Returns the conversation history. If `agentName` is provided, returns only that agent's messages. If `null`, returns all messages.

```typescript
const allMessages = env.getObservation(null);
const aliceMessages = env.getObservation("Alice");
```

#### `isTerminal(beforeNewRound)`

Checks if the conversation should end. If a moderator is configured, it asks the moderator to evaluate the conversation and looks for terminal sentences in the response.

```typescript
const shouldEnd = await env.isTerminal(true);
```

The moderator checks happen based on the moderator's `period` setting:
- `"turn"` — Check after every agent's turn
- `"round"` — Check only at the end of a full round (when `beforeNewRound` is `true`)

#### `print()`

Logs the full message history to the console.

## The Message Type

Messages in the environment use a simple structure:

```typescript
type Message = {
  role: string;    // The agent's name or "system"
  content: string; // The message content
};
```

## Next Steps

- [Agent](/core-concepts/agent) — The entities that act within the environment
- [Custom Environment](/advanced/custom-environment) — Build your own environment
