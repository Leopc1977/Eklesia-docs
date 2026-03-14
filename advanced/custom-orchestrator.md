---
title: Custom Orchestrator
---

# Custom Orchestrator

The default [Orchestrator](/core-concepts/orchestrator) uses round-robin turn order. You can create custom orchestrators to implement different turn-taking strategies.

## Extending the Base Orchestrator

Create a custom orchestrator by extending the `Orchestrator` class and overriding the `step()` method:

```typescript
import { Orchestrator, Agent, Environment } from "eklesia";

class RandomOrchestrator<
  T extends Environment = Environment
> extends Orchestrator<T> {

  async step(agents: Array<Agent>): Promise<boolean> {
    if (agents.length === 0) return false;

    // Pick a random agent instead of round-robin
    const randomIndex = Math.floor(Math.random() * agents.length);
    const currentAgent = agents[randomIndex];

    const observation = this.environment.getObservation(currentAgent.agentName);
    const action = await currentAgent.act(
      observation,
      this.environment.description,
    );

    this.environment.addMessage(currentAgent.agentName, action);

    return await this.environment.isTerminal(false);
  }
}
```

## Example: Priority-Based Orchestrator

An orchestrator that gives certain agents more turns:

```typescript
class PriorityOrchestrator<
  T extends Environment = Environment
> extends Orchestrator<T> {
  private priorities: Map<string, number>;
  private turnCounter = 0;

  constructor(environment: T, priorities: Map<string, number>) {
    super(environment);
    this.priorities = priorities;
  }

  async step(agents: Array<Agent>): Promise<boolean> {
    if (agents.length === 0) return false;

    // Build a weighted list based on priorities
    const weighted: Agent[] = [];
    for (const agent of agents) {
      const weight = this.priorities.get(agent.agentName) ?? 1;
      for (let i = 0; i < weight; i++) {
        weighted.push(agent);
      }
    }

    const currentAgent = weighted[this.turnCounter % weighted.length];
    this.turnCounter++;

    const observation = this.environment.getObservation(currentAgent.agentName);
    const action = await currentAgent.act(
      observation,
      this.environment.description,
    );

    this.environment.addMessage(currentAgent.agentName, action);

    return await this.environment.isTerminal(false);
  }
}
```

## Usage

```typescript
import { Arena, Agent, ConversationEnvironment, OpenAIGenericProvider } from "eklesia";

const provider = new OpenAIGenericProvider(
  "gpt-4",
  "https://api.openai.com/v1/chat/completions",
  process.env.API_KEY!,
);

const agents = [
  new Agent("Leader", "You lead the discussion.", provider),
  new Agent("Analyst", "You analyze proposals critically.", provider),
];

const environment = new ConversationEnvironment("A strategy meeting.");
const orchestrator = new RandomOrchestrator(environment);

const arena = new Arena(agents, orchestrator, environment);
await arena.run(20);
```

## Key Points

- Override `step()` to control which agent acts and when
- Access `this.environment` to interact with the environment
- Access `this.currentAgentIndex` if you want to build on the existing counter
- Return `true` from `step()` to signal that the simulation should end
- Return `false` to continue to the next step
