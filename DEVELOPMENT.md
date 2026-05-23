# Marker Media CEO Operation System - Development Guide

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Create .env file with API key
cp .env.example .env
# Edit .env and add your Anthropic API key

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## Project Architecture

### Components
- **AgentSelector**: Initial view showing all 5 agents
- **AgentChat**: Conversation interface for each agent
- **MessageBubble**: Individual message display
- **AgentCard**: Agent selection card

### Services
- **anthropic.js**: Handles API calls to Claude
- **storage.js**: Local storage utilities

### Hooks
- **useLocalStorage**: Persist conversation data

### Context
- **ConversationContext**: Global conversation state

## Adding New Agents

1. Add to `src/constants/agents.js` in the `AGENTS` array
2. Define the agent's `id`, `label`, `sub`, `icon`, `accent` color, and `prompt`
3. Component automatically renders the new agent

## Environment Variables

```
VITE_ANTHROPIC_API_KEY      # Anthropic API key
VITE_API_BASE_URL           # API base URL (optional)
```

## Styling

- Global styles in `src/styles/index.css`
- CSS variables for theming and spacing
- Component-specific styles in each CSS file
- Mobile-responsive design with media queries

## API Integration

The app uses Anthropic's Claude API via `anthropicClient.sendMessage()`. 

Each agent has a unique system prompt defined in `agents.js` that shapes its conversational style and focus area.

## Deployment

Build for production:
```bash
npm run build
```

The `dist/` folder contains the optimized production build.

## Troubleshooting

**API Key Error**: Ensure `VITE_ANTHROPIC_API_KEY` is set in `.env`

**Build Fails**: Clear `node_modules` and run `npm install` again

**Styles Not Loading**: Check that Tabler Icons CDN is accessible in `public/index.html`
