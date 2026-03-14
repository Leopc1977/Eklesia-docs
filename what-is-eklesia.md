---
title: What is Eklesia
---

# What is [Eklesia](https://github.com/Leopc1977/Eklesia)?

[Eklesia](https://github.com/Leopc1977/Eklesia) is a [TypeScript](https://www.typescriptlang.org/) library that orchestrates [AI agent](https://en.wikipedia.org/wiki/Intelligent_agent) interactions in simulated environments.
It provides a modular, backend-agnostic framework to manage multiple AI agents, enabling simulations, experiments, and multi-agent interactions with minimal setup.

## Origin

Eklesia was originally conceived as a TypeScript rewrite of [ChatArena](https://github.com/Farama-Foundation/chatarena) by the [Farama Foundation](https://github.com/Farama-Foundation). It has since diverged by introducing an explicit **Orchestrator** layer: an architectural component that coordinates agents, environments, and interaction flows, making the system more modular and backend-agnostic.

## Key Features

- **Multi-Agent Orchestration** : Manage multiple AI agents interacting in the same environment
- **Simulated Environments** : Build or plug in different environments (chat, games, custom scenarios)
- **Backend Agnostic** : Works with any OpenAI-compatible API, local models, or custom providers
- **Extensible** : Add new agents, environments, orchestrators, or providers with minimal code

## Core Architecture

Eklesia is built around five key abstractions :

| Concept | Role |
|---|---|
| [**Arena**](/core-concepts/arena) | The top-level simulation container; holds orchestrators and environments |
| [**Orchestrator**](/core-concepts/orchestrator) | Coordinates agent interactions and manages turn-taking/flow |
| [**Environment**](/core-concepts/environment) | The context/world that agents operate within |
| [**Agent**](/core-concepts/agent) | An AI entity (backed by a provider) that participates in a simulation |
| [**Provider**](/core-concepts/provider) | The AI backend abstraction (e.g., OpenAI, local model) |

## How It Works

1. You create **Agents** with names, roles, and AI providers
2. You set up an **Environment** that describes the simulation context
3. An **Orchestrator** manages which agent speaks when
4. The **Arena** ties everything together and runs the simulation loop

```typescript
import { Arena, Agent, Orchestrator, ConversationEnvironment, OpenAIGenericProvider } from "eklesia";

const provider = new OpenAIGenericProvider("gpt-4", "https://api.openai.com/v1/chat/completions", process.env.API_KEY!);

const arena = new Arena(
  [new Agent("Alice", "You are optimistic.", provider), new Agent("Bob", "You are skeptical.", provider)],
  new Orchestrator(new ConversationEnvironment("A debate about AI.")),
  new ConversationEnvironment("A debate about AI."),
);

await arena.run(10);
```

## Acknowledgments

Inspired by :
- [ChatArena](https://github.com/Farama-Foundation/chatarena) by [Farama Foundation](https://github.com/Farama-Foundation)
- [House](https://github.com/sausheong/house) by [sausheong](https://github.com/sausheong)
- [game_arena](https://github.com/google-deepmind/game_arena) by [Google DeepMind](https://github.com/google-deepmind)

## Next Steps

- [Installation](/getting-started/installation) : Get Eklesia set up locally
- [Quick Start](/getting-started/quick-start) : Build your first simulation
