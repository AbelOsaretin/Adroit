# Agentic Marketing Agent

An autonomous AI agent that manages marketing campaigns for small businesses using USDC on Arc blockchain.

## Features

- **Campaign Optimization**: Analyzes Google/Meta Ads performance
- **Autonomous Payments**: Holds USDC wallet on Arc
- **Approval Workflow**: Large changes require owner approval
- **Real-time Dashboard**: Monitor campaigns and recommendations

## Tech Stack

- **Framework**: Mastra (Agent + API + Workflows)
- **Blockchain**: Arc Testnet (USDC as gas)
- **Wallet**: Circle Developer-Controlled
- **Database**: PostgreSQL
- **Frontend**: Next.js

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env`
4. Run development server: `npm run dev`
5. Access dashboard at http://localhost:3000

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL
- OpenAI API key

### Commands

```bash
npm run dev        # Start Mastra dev server
npm run build      # Build for production
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run lint       # Lint code
npm run typecheck  # Type check
```

## Project Structure

```
agentic-marketing-agent/
├── src/mastra/
│   ├── index.ts              # Mastra entry point
│   ├── agents/               # AI agents
│   ├── tools/                # Integration tools
│   ├── workflows/            # Business workflows
│   └── storage/              # Database operations
├── tests/                    # Test files
├── dashboard/                # Next.js frontend
└── docs/                     # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

## Hackathon Track

**Agentic Economy** - Autonomous AI agents that hold wallets and transact in USDC.

## License

MIT
