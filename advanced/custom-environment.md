---
title: Custom Environment
---

# Custom Environment

The built-in [ConversationEnvironment](/core-concepts/environment) handles multi-agent chat. You can create custom environments for games, simulations, or any other interaction pattern.

## Extending the Base Environment

Create a custom environment by extending the `Environment` class and implementing the required methods:

```typescript
import { Environment, Moderator } from "eklesia";
import type { Message } from "eklesia";

class GameEnvironment extends Environment {
  private state: Map<string, number> = new Map();
  private history: Array<Message> = [];

  constructor(description: string, moderator: Moderator | null = null) {
    super(description, moderator);
  }

  addMessage(agentName: string, content: string) {
    this.history.push({ role: agentName, content });
    // Update game state based on the agent's action
    const currentScore = this.state.get(agentName) ?? 0;
    this.state.set(agentName, currentScore + 1);
  }

  getObservation(agentName: string | null = null): Array<Message> {
    if (agentName === null) return this.history;
    return this.history.filter((m) => m.role === agentName);
  }

  async isTerminal(beforeNewRound: boolean): Promise<boolean> {
    // End the game when any player reaches 10 points
    for (const [, score] of this.state) {
      if (score >= 10) return true;
    }
    return false;
  }

  getScores(): Map<string, number> {
    return new Map(this.state);
  }
}
```

## Required Methods

### `addMessage(agentName, content)`

Records an agent's action. This is called by the orchestrator after each agent acts.

```typescript
addMessage(agentName: string, content: string): void
```

### `getObservation(agentName?)`

Returns the state visible to a given agent. The orchestrator calls this before asking an agent to act.

```typescript
getObservation(agentName: string | null): any
```

- When `agentName` is `null`, return the full state
- When an agent name is provided, return only what that agent should see

### `isTerminal(beforeNewRound)`

Determines if the simulation should end.

```typescript
async isTerminal(beforeNewRound: boolean): Promise<boolean>
```

- `beforeNewRound` is `true` when a full round of agent turns has completed
- If a moderator is set, you can delegate the check to the moderator (as `ConversationEnvironment` does)

## Example: Voting Environment

```typescript
class VotingEnvironment extends Environment {
  private votes: Map<string, string> = new Map();
  private messages: Array<Message> = [];
  private candidates: string[];

  constructor(description: string, candidates: string[]) {
    super(description);
    this.candidates = candidates;
  }

  addMessage(agentName: string, content: string) {
    this.messages.push({ role: agentName, content });

    // Parse vote from the response
    for (const candidate of this.candidates) {
      if (content.toLowerCase().includes(`vote: ${candidate.toLowerCase()}`)) {
        this.votes.set(agentName, candidate);
        break;
      }
    }
  }

  getObservation(agentName: string | null = null): Array<Message> {
    return this.messages;
  }

  async isTerminal(): Promise<boolean> {
    // End when all agents have voted
    return this.votes.size >= this.messages.length;
  }

  getResults(): Map<string, number> {
    const tally = new Map<string, number>();
    for (const [, candidate] of this.votes) {
      tally.set(candidate, (tally.get(candidate) ?? 0) + 1);
    }
    return tally;
  }
}
```

## Usage

```typescript
import { Arena, Agent, Orchestrator, OpenAIGenericProvider } from "eklesia";

const provider = new OpenAIGenericProvider(
  "gpt-4",
  "https://api.openai.com/v1/chat/completions",
  process.env.API_KEY!,
);

const agents = [
  new Agent("Voter1", "You are a voter. Choose the best candidate.", provider),
  new Agent("Voter2", "You are a voter. Choose the best candidate.", provider),
];

const environment = new VotingEnvironment(
  "An election between candidates A, B, and C.",
  ["A", "B", "C"],
);

const orchestrator = new Orchestrator(environment);
const arena = new Arena(agents, orchestrator, environment);

await arena.run(10);
```

## Key Points

- Always implement `addMessage`, `getObservation`, and `isTerminal`
- The `description` property is passed to agents as context
- Use the `moderator` property if you want AI-driven terminal condition evaluation
- Custom environments can track any kind of state beyond simple message history
