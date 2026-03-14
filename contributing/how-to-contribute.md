---
title: How to Contribute
---

# How to Contribute

Contributions to [Eklesia](https://github.com/Leopc1977/Eklesia) are welcome! Whether you want to fix a bug, add a feature, improve documentation, or report an issue, here's how to get started.

## Reporting Issues

If you find a bug or have a feature request, [open an issue](https://github.com/Leopc1977/Eklesia/issues) on GitHub. Include:

- A clear description of the problem or suggestion
- Steps to reproduce (for bugs)
- Your environment details (OS, Bun version, etc.)

## Setting Up for Development

1. **Fork and clone** the repository:

```bash
git clone https://github.com/<your-username>/Eklesia.git
cd Eklesia
```

2. **Install dependencies** using [Bun](https://bun.sh/):

```bash
bun install
```

3. **Run the development server:**

```bash
bun run dev
```

4. **Run tests:**

```bash
bun test
```

## Making Changes

1. Create a new branch for your work:

```bash
git checkout -b feature/my-feature
```

2. Make your changes and ensure tests pass:

```bash
bun test
```

3. Commit your changes with a clear message:

```bash
git commit -m "Add my feature"
```

4. Push to your fork and open a pull request:

```bash
git push origin feature/my-feature
```

## Contributing to Documentation

The documentation site lives in a [separate repository](https://github.com/Leopc1977/Eklesia-docs). To contribute to the docs:

1. Clone the docs repo:

```bash
git clone https://github.com/Leopc1977/Eklesia-docs.git
cd Eklesia-docs
npm install
```

2. Start the local dev server:

```bash
npm run docs:dev
```

3. Edit Markdown files and preview changes in your browser.

## Guidelines

- Write clear, descriptive commit messages
- Follow the existing code style
- Add tests for new features when applicable
- Keep pull requests focused on a single change

## Questions?

Feel free to [open an issue](https://github.com/Leopc1977/Eklesia/issues) or reach out to [Leopc1977](https://github.com/Leopc1977) on GitHub.
