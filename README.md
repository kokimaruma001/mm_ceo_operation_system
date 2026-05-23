# Marker Media CEO Operation System

A luxury creative agency management platform powered by AI agents. This system helps Marker Media's founder navigate strategic decisions, optimize revenue, and scale the business toward premium clientele.

## Features

- **Daily Clarity Agent**: Identify high-impact activities vs. busy work
- **Revenue Focus Agent**: Optimize pricing, refine offers, scale to R8K-R25K per engagement
- **Strategic Thinking Agent**: Vision alignment and market positioning
- **Client Management Agent**: Premium client acquisition and relationship tracking
- **Execution Agent**: Turn strategy into actionable operations

## Tech Stack

- **Frontend**: React 18 + Vite
- **AI**: Anthropic Claude API
- **HTTP Client**: Axios
- **Development**: Node.js + npm

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Anthropic API key

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Add your Anthropic API key to `.env`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   ├── agents/          # Agent-specific components
  │   ├── common/          # Reusable UI components
  │   └── layout/          # Layout components
  ├── pages/               # Page components
  ├── services/            # API services
  ├── hooks/               # Custom React hooks
  ├── context/             # React context providers
  ├── constants/           # Constants and configurations
  ├── styles/              # Global styles
  └── utils/               # Utility functions
public/                    # Static assets
```

## API Integration

The system integrates with the Anthropic Claude API for agent conversations. Configuration is in `src/constants/agents.js`.

## Contributing

Submit pull requests with clear descriptions of changes.

## License

Proprietary - Marker Media
