import axios from 'axios';
import { API_CONFIG } from '../constants/config';

const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;

export function isAnthropicConfigured() {
  return Boolean(apiKey);
}

export function buildFallbackResponse(systemPrompt, messages) {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user')?.content?.trim() || 'your priorities';

  const normalizedMessage = latestUserMessage.toLowerCase();
  const isRevenueFocus = systemPrompt.includes('Revenue Focus Agent');
  const isStrategyFocus = systemPrompt.includes('Strategic Thinking Agent');
  const isClientFocus = systemPrompt.includes('Client Acquisition Agent');
  const isExecutionFocus = systemPrompt.includes('Execution Engine Agent');

  let nextStep = 'clarify the single most important move for the next session';

  if (isRevenueFocus) {
    nextStep = 'tighten your pricing or offer structure around a premium outcome';
  } else if (isStrategyFocus) {
    nextStep = 'name the one 90-day win that would matter most';
  } else if (isClientFocus) {
    nextStep = 'define the ideal client and the channel where they are most reachable';
  } else if (isExecutionFocus) {
    nextStep = 'turn one commitment into a concrete operating system step';
  }

  const insight = normalizedMessage.includes('price') || normalizedMessage.includes('revenue')
    ? 'focus on revenue quality rather than volume'
    : normalizedMessage.includes('client') || normalizedMessage.includes('lead')
      ? 'focus on the highest-value buyer segment'
      : 'focus on the next decision that unlocks momentum';

  return `Local mode response: no Anthropic API key is configured, so I’m using the built-in advisor flow. Based on your note, "${latestUserMessage}", the next step is to ${nextStep}. The strongest lens here is ${insight}.`;
}

export const anthropicClient = {
  async sendMessage(systemPrompt, messages) {
    if (!apiKey) {
      return buildFallbackResponse(systemPrompt, messages);
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: API_CONFIG.model,
          max_tokens: API_CONFIG.maxTokens,
          system: systemPrompt,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
        }
      );

      if (response.data.content?.[0]?.type === 'text') {
        return response.data.content[0].text;
      }

      return buildFallbackResponse(systemPrompt, messages);
    } catch (error) {
      console.error('Anthropic API error:', error);
      return buildFallbackResponse(systemPrompt, messages);
    }
  },
};
