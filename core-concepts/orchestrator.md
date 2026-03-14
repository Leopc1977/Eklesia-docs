---
title: Orchestrator
---

# Orchestrator

The **Orchestrator** coordinates agent interactions within an environment. It manages turn-taking, determines which agent acts next, and checks for terminal conditions.

## Overview

The Orchestrator is the engine that drives the simulation forward. On each step, it:

1. Selects the next agent (round-robin by default)
2. Retrieves observations from the environment for that agent
3. Asks the agent to act based on those observations
4. Records the agent's action in the environment
5. Checks whether the simulation should end

## Basic Usage

```typescript
import { Orchestrator, ConversationEnvironment } from "eklesia";

const environment = new ConversationEnvironment(
  "A debate between AI agents about climate policy.",
);

const orchestrator = new Orchestrator(environment);
```

The orchestrator is typically used within an [Arena](/core-concepts/arena), which calls `orchestrator.step()` in a loop.

## Constructor

```typescript
new Orchestrator<GenericEnvironment>(
  environment: GenericEnvironment,
)
```

| Parameter     | Type          | Description                                     |
| ------------- | ------------- | ----------------------------------------------- |
| `environment` | `Environment` | The environment the orchestrator operates within |

## Properties

| Property            | Type          | Description                                           |
| ------------------- | ------------- | ----------------------------------------------------- |
| `environment`       | `Environment` | The environment this orchestrator manages              |
| `currentAgentIndex` | `number`      | Tracks which agent acts next (protected, starts at 0)  |

## Methods

### `step(agents)`

Advances the simulation by one turn. Returns `true` if the simulation should end (terminal condition met), `false` otherwise.

```typescript
const isTerminal = await orchestrator.step(agents);
```

| Parameter | Type           | Description                          |
| --------- | -------------- | ------------------------------------ |
| `agents`  | `Array<Agent>` | The list of agents to cycle through  |

**Step-by-step flow:**

1. Select the agent at `currentAgentIndex % agents.length`
2. Call `environment.getObservation(agentName)` to get relevant messages
3. Call `agent.act(observation, environment.description)` to generate a response
4. Call `environment.addMessage(agentName, action)` to record the response
5. Call `environment.isTerminal(endingRound)` to check if the simulation should stop
6. Increment `currentAgentIndex`

## Turn Order

By default, the orchestrator uses **round-robin** turn order. Agents take turns in the order they appear in the agents array. After the last agent acts, the cycle begins again from the first agent.

```
Step 0: Agent[0] acts
Step 1: Agent[1] acts
Step 2: Agent[2] acts
Step 3: Agent[0] acts  ← new round
...
```

## Creating a Custom Orchestrator

You can extend the base `Orchestrator` to implement different turn-taking strategies. See the [Custom Orchestrator](/advanced/custom-orchestrator) guide for details.

## Next Steps

- [Arena](/core-concepts/arena) : The container that runs the orchestrator
- [Environment](/core-concepts/environment) : The context the orchestrator operates within
- [Custom Orchestrator](/advanced/custom-orchestrator) : Build your own turn-taking logic
