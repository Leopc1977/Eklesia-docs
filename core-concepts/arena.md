---
title: Arena
---

# Arena

The **Arena** is the top-level simulation container in Eklesia. It brings together agents, an orchestrator, and an environment into a single runnable unit.

## Overview

An Arena holds references to:

- A list of **Agents** that participate in the simulation
- An **Orchestrator** that manages turn-taking and flow
- An **Environment** that provides context and tracks state

Once configured, you call `arena.run()` to start the simulation loop.

## Basic Usage

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

const agent1 = new Agent("Alice", "You are a helpful assistant.", provider);
const agent2 = new Agent("Bob", "You are a critical thinker.", provider);

const environment = new ConversationEnvironment(
  "A discussion between two AI agents about technology.",
);

const orchestrator = new Orchestrator(environment);

const arena = new Arena([agent1, agent2], orchestrator, environment);

// Run for up to 20 steps
await arena.run(20);
```

## Constructor

```typescript
new Arena<GenericAgent, GenericOrchestrator, GenericEnvironment>(
  agents: Array<GenericAgent>,
  orchestrator: GenericOrchestrator,
  environment: GenericEnvironment,
)
```

| Parameter      | Type                   | Description                                         |
| -------------- | ---------------------- | --------------------------------------------------- |
| `agents`       | `Array<Agent>`         | The list of agents participating in the simulation  |
| `orchestrator` | `Orchestrator`         | The orchestrator managing turn flow                  |
| `environment`  | `Environment`          | The environment providing context and tracking state |

## Methods

### `run(maxSteps?)`

Starts the simulation loop. On each step, the orchestrator advances the simulation by one turn. The loop ends when either `maxSteps` is reached or the environment signals a terminal condition.

```typescript
await arena.run(100); // Run for up to 100 steps
```

| Parameter  | Type     | Default | Description                        |
| ---------- | -------- | ------- | ---------------------------------- |
| `maxSteps` | `number` | `100`   | Maximum number of steps to execute |

### `reset()`

Resets the arena state. This method is available for future use.

### `loadConfigJSON(fileContent)` (static)

Creates an Arena from a JSON configuration string. This allows you to define your entire simulation setup declaratively.

```typescript
import { readFileSync } from "fs";

const config = readFileSync("config.json", "utf-8");
const arena = await Arena.loadConfigJSON(config);

await arena.run(60);
```

The JSON configuration should include `agents`, `environment`, and `global_prompt` fields. See the [examples on GitHub](https://github.com/Leopc1977/Eklesia/tree/main/examples) for config file formats.

## Generic Types

Arena supports generics so you can use custom subclasses:

```typescript
class MyAgent extends Agent { /* ... */ }
class MyOrchestrator extends Orchestrator { /* ... */ }
class MyEnvironment extends Environment { /* ... */ }

const arena = new Arena<MyAgent, MyOrchestrator, MyEnvironment>(
  agents,
  orchestrator,
  environment,
);
```

## How It Works

The `run()` method executes a simple loop:

1. Call `orchestrator.step(agents)` to advance the simulation by one turn
2. The orchestrator selects the current agent, gets observations from the environment, asks the agent to act, and records the action
3. The environment checks if a terminal condition has been met
4. If terminal or `maxSteps` reached, the loop stops

## Next Steps

- [Orchestrator](/core-concepts/orchestrator) : Learn how turn-taking is managed
- [Environment](/core-concepts/environment) : Understand the context agents operate in
- [Agent](/core-concepts/agent) : See how agents generate responses
