# CLAUDE.md — Eklesia Documentation

This file provides guidance for AI assistants working in this repository.

## Project Overview

This is the **VitePress documentation site** for [Eklesia](https://github.com/Leopc1977/Eklesia), a TypeScript library that orchestrates AI agent interactions in simulated environments. The docs site is deployed to GitHub Pages at `https://leopc1977.github.io/Eklesia-docs/`.

The **Eklesia library itself** lives in a separate repository: `https://github.com/Leopc1977/Eklesia`. This repo is docs-only.

## Repository Structure

```
/
├── index.md                      # Homepage (VitePress "home" layout with hero/features)
├── what-is-eklesia.md            # Intro page explaining what Eklesia is
├── package.json                  # npm scripts for dev/build/deploy
├── package-lock.json
├── .gitignore
├── .vitepress/
│   └── config.mts                # VitePress site config (nav, sidebar, base path)
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions CI/CD → deploys to GitHub Pages on push to main
├── getting-started/
│   ├── installation.md           # Clone + bun install instructions
│   └── quick-start.md            # Quick start guide (stub)
├── core-concepts/
│   ├── arena.md                  # Arena concept (stub)
│   ├── orchestrator.md           # Orchestrator concept (stub)
│   ├── environment.md            # Environment concept (stub)
│   ├── agent.md                  # Agent concept (stub)
│   └── provider.md               # Provider concept (stub)
├── advanced/
│   ├── custom-orchestrator.md    # Custom orchestrator guide (stub)
│   ├── custom-environment.md     # Custom environment guide (stub)
│   ├── custom-agent.md           # Custom agent guide (stub)
│   └── custom-provider.md        # Custom provider guide (stub)
└── contributing/
    ├── how-to-contribute.md      # Contribution guide (stub)
    └── license.md                # License page (stub)
```

Most content pages outside of `getting-started/installation.md` and `what-is-eklesia.md` are **empty stubs** awaiting content.

## Eklesia Core Concepts

When writing documentation for the Eklesia library, these are the key abstractions in the framework:

| Concept | Role |
|---|---|
| **Arena** | The top-level simulation container; holds orchestrators and environments |
| **Orchestrator** | Coordinates agent interactions and manages turn-taking/flow |
| **Environment** | The context/world that agents operate within |
| **Agent** | An AI entity (backed by a provider) that participates in a simulation |
| **Provider** | The AI backend abstraction (e.g. OpenAI, Anthropic, local model) |

## Development Commands

```bash
# Install dependencies
npm install

# Start local dev server (hot-reload)
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build locally
npm run docs:preview

# Deploy to GitHub Pages (builds then pushes to gh-pages branch)
npm run docs:deploy
```

> **Note:** The Eklesia library itself uses **Bun** (`bun install`), but this docs repository uses **npm**.

## Tech Stack

- **VitePress** `^2.0.0-alpha.12` — static site generator for Markdown-based docs
- **Node.js** 22 — runtime used in CI
- **npm** — package manager for this docs repo
- **GitHub Pages** — deployment target; base path is `/Eklesia-docs/`
- **gh-pages** CLI — used for manual deploys via `npm run docs:deploy`

## VitePress Configuration (`config.mts`)

Key settings in `.vitepress/config.mts`:

- `base: "/Eklesia-docs/"` — required for GitHub Pages deployment; all asset paths are relative to this base
- Sidebar is organized in sections: Prologue → Getting Started → Core Concepts → Advanced → Reference → Contributing
- Social links point to the main Eklesia GitHub repo

**Known issues in `config.mts` to be aware of:**
- The nav bar has a stale link to `/markdown-examples` (file was deleted; should be removed or updated)
- The "API Reference" nav/sidebar link has no target page yet (`/reference/api` does not exist)

## CI/CD

`.github/workflows/deploy.yml` deploys the site automatically on every push to the `main` branch:

1. Checkout repo with full history
2. Setup Node.js 22 with npm cache
3. `npm ci` — install dependencies
4. `npm run docs:build` — build VitePress site to `.vitepress/dist/`
5. Upload artifact and deploy to GitHub Pages

Deployments are serialized (no concurrent runs) and in-progress deploys are never cancelled.

## Writing Content Conventions

- All pages use **Markdown** with optional YAML front matter (`title:` field for page title)
- Code blocks should use fenced code blocks with language tags (e.g. ` ```bash `, ` ```typescript `)
- Link to the Eklesia library repo as: `https://github.com/Leopc1977/Eklesia`
- Link to the docs repo as: `https://github.com/Leopc1977/Eklesia-docs`
- Internal links use root-relative paths without `.md` extension (e.g. `/core-concepts/agent`)
- When adding a new page, register it in the `sidebar` array in `.vitepress/config.mts`

## Gitignore Rules

The following are excluded from version control:
- `node_modules/`
- `.vitepress/dist/` (build output)
- `.vitepress/cache/` (VitePress cache)
- Log files, `.env*` files, OS files (`.DS_Store`, `Thumbs.db`), IDE folders (`.vscode/`, `.idea/`)

## Branch Strategy

- `main` — production branch; pushes here trigger automatic GitHub Pages deployment
- `master` — original default branch (the CI workflow targets `main`)
- Feature branches follow the convention: `claude/<description>-<id>`
