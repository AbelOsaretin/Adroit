# Adroit - AI Marketing Agency Platform

<p align="center">
  <img src="https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Adroit" alt="Adroit Banner" width="100%">
</p>

<p align="center">
  <strong>Autonomous AI marketing agency for small businesses, powered by USDC on Arc blockchain</strong>
</p>

<p align="center">
  <a href="https://adroit-one.vercel.app">Live Demo</a> •
  <a href="https://docs.google.com/presentation/d/13SG8eeR0QpSDNT7B7_ZJwQ60WVRg09XenUY_UXn31mQ/edit">Presentation</a> •
  <a href="https://github.com/AbelOsaretin/Adroit/issues">Report Issue</a>
</p>

---

## What is Adroit?

Adroit is an autonomous AI marketing agency platform that democratizes marketing for small and medium-sized businesses. Built with cutting-edge AI and blockchain technology, Adroit provides enterprise-grade marketing services at a fraction of traditional agency costs.

**The Problem:** Small businesses can't afford traditional marketing agencies ($5,000-$50,000/month). They struggle with:
- Creating effective ad campaigns
- Managing multiple marketing channels
- Understanding analytics and ROI
- Creating quality content consistently

**The Solution:** Adroit uses AI agents to automate marketing tasks, powered by USDC on Arc blockchain for seamless payments.

---

## Key Features

### AI Marketing Agent
- **31+ tools** for Meta Ads campaign management
- Automated campaign creation, optimization, and analysis
- Real-time performance monitoring and recommendations

### Social Login & Wallets
- Google OAuth authentication
- Non-custodial wallets on Arc blockchain
- Users control their own private keys

### USDC Payments
- **Virtual cards** for ad spend (funded with USDC)
- **Crosschain transfers** via Circle Gateway
- **Agent-to-agent commerce** with x402 micropayments

### Dashboard
- Real-time campaign performance charts
- Wallet management (send/receive USDC)
- Gateway for crosschain transfers
- Services marketplace for AI agents

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **AI Framework** | Mastra AI |
| **Blockchain** | Arc (USDC native gas) |
| **Wallets** | Circle User-Controlled Wallets |
| **Payments** | x402 Gateway Nanopayments |
| **Database** | Turso/LibSQL |
| **Ads** | Meta Ads SDK |

---

## Getting Started

### Prerequisites

- Node.js 22+ 
- npm or yarn
- Circle Developer Account ([console.circle.com](https://console.circle.com))
- Meta Developer Account ([developers.facebook.com](https://developers.facebook.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/AbelOsaretin/Adroit.git
cd Adroit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

### Environment Variables

```bash
# Circle
CIRCLE_API_KEY=your-circle-api-key
CIRCLE_APP_ID=your-circle-app-id
ENTITY_SECRET=your-entity-secret

# Meta
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret

# Database (Turso)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token

# AI
OPENAI_API_KEY=your-openai-key
```

---

## Project Structure

```
adroit/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/             # Authentication
│   │   ├── onboard/           # Business onboarding
│   │   └── services/          # Agent services
│   ├── components/            # UI components
│   ├── lib/                   # Utilities & database
│   └── mastra/                # AI agents & tools
│       ├── agents/            # Marketing agent
│       ├── tools/             # 31+ marketing tools
│       └── mcp/               # Meta Ads integration
├── docs/                      # Documentation
└── public/                    # Static assets
```

---

## Usage

### User Flow

```
Homepage → Login (Google) → Onboard → Dashboard
```

1. **Login**: Authenticate with Google, wallet created on Arc
2. **Onboard**: Tell the AI about your business
3. **Dashboard**: Manage campaigns, wallet, and settings

### Agent Capabilities

The AI agent can:
- Manage Meta Ads campaigns (31+ tools)
- Create and optimize ad campaigns
- Analyze performance metrics
- Manage USDC wallet and virtual cards
- Transfer USDC crosschain via Gateway
- Sell services to other AI agents via x402

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Chat with AI agent |
| `/api/meta` | GET | Fetch Meta Ads data |
| `/api/wallet` | POST | Wallet operations |
| `/api/cards` | POST | Virtual card management |
| `/api/user` | GET/POST | User data management |
| `/api/services` | GET | List agent services |

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production

```bash
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token
CIRCLE_API_KEY=your-circle-key
META_APP_ID=your-meta-app-id
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License

MIT

---

## Acknowledgments

- [Encode Club](https://encode.club/) - ARC Hackathon organizers
- [Circle](https://www.circle.com/) - Blockchain infrastructure
- [Mastra](https://mastra.ai/) - AI agent framework
- [Arc](https://www.arc.io/) - Blockchain with USDC native gas

---

<p align="center">
  Built with ❤️ for small businesses everywhere
</p>
