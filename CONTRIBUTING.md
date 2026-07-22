# Contributing to Agentic Marketing Agent

Thank you for your interest in contributing! This project is a hackathon collaboration, and we welcome help from fellow builders.

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/agentic-marketing-agent.git
   cd agentic-marketing-agent
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```
5. **Run development server:**
   ```bash
   npm run dev
   ```

## Finding Tasks

All tasks are documented in `docs/compose/plans/2026-07-22-agentic-marketing-agent.md`. Each task includes:
- Files to create/modify
- Step-by-step implementation
- Tests to verify

Check the GitHub Issues tab for available tasks labeled `good-first-issue` or `task`.

## Development Workflow

1. **Pick a task** from GitHub Issues
2. **Create a feature branch:**
   ```bash
   git checkout -b feat/task-X-description
   ```
3. **Implement the task** following the plan
4. **Run tests:**
   ```bash
   npm test
   ```
5. **Run type check:**
   ```bash
   npm run typecheck
   ```
6. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add Task X implementation"
   ```
7. **Push and create a PR:**
   ```bash
   git push origin feat/task-X-description
   ```

## Code Style

- TypeScript strict mode
- Use Zod for schema validation
- Follow existing patterns in the codebase
- No comments unless necessary

## Testing

- Write tests for new tools and workflows
- Tests should pass before submitting PR
- Use vitest for testing

## Questions?

Open a GitHub Issue or reach out to the maintainers.
