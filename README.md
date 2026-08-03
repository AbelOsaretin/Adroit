# Adroit - AI Marketing Agency Platform

An autonomous AI marketing agency platform that provides end-to-end marketing services for small and medium-sized businesses (SMEs).

## Features

- **Marketing Strategy** - Create comprehensive marketing plans tailored to your business
- **Content Creation** - Generate social media posts, blog articles, email campaigns, and ad copy
- **SEO Analysis** - Analyze websites and provide optimization recommendations
- **Social Media Management** - Help manage and optimize social media presence

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **AI Framework**: Mastra
- **UI Components**: shadcn/ui, AI Elements
- **Database**: LibSQL (Turso)

## Getting Started

### Prerequisites

- Node.js 22.13.0 or later
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the landing page
6. Navigate to [http://localhost:3000/chat](http://localhost:3000/chat) to chat with the marketing agent

### Mastra Studio

You can also run Mastra Studio to inspect agents and tools:

```bash
npm run dev
```

Then open [http://localhost:4111](http://localhost:4111) to access Mastra Studio.

## Project Structure

```
adroit/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts        # Chat API endpoint
│   │   ├── chat/
│   │   │   └── page.tsx            # Chat interface
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── ai-elements/            # Custom AI UI components
│   │   │   ├── conversation.tsx
│   │   │   ├── message.tsx
│   │   │   ├── prompt-input.tsx
│   │   │   └── tool.tsx
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts
│   └── mastra/
│       ├── agents/
│       │   ├── marketing-agent.ts  # Main marketing agent
│       │   └── weather-agent.ts    # Example agent
│       ├── tools/
│       │   ├── content-creator.ts  # Content generation tool
│       │   ├── marketing-strategy.ts # Strategy creation tool
│       │   ├── seo-analyzer.ts     # SEO analysis tool
│       │   ├── social-media.ts     # Social media management
│       │   └── weather-tool.ts     # Example tool
│       └── index.ts                # Mastra configuration
├── .env
├── components.json
├── package.json
└── tsconfig.json
```

## Usage

### Chat Interface

Visit `/chat` to interact with the Adroit marketing agent. You can:

- Ask for marketing strategy recommendations
- Generate content for different platforms
- Analyze SEO performance
- Get social media management tips

### Available Tools

The marketing agent has access to:

1. **Marketing Strategy Tool** - Creates comprehensive marketing plans
2. **Content Creator Tool** - Generates content for social media, blogs, emails, and ads
3. **SEO Analyzer Tool** - Analyzes websites and provides SEO recommendations
4. **Social Media Tool** - Manages social media content and scheduling

## License

MIT
