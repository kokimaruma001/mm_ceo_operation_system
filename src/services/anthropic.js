import axios from 'axios';
import { API_CONFIG } from '../constants/config';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const anthropicClient = {
  async sendMessage(systemPrompt, messages) {
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: API_CONFIG.model,
          max_tokens: API_CONFIG.maxTokens,
          system: systemPrompt,
          messages: messages.map(msg => ({
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

      throw new Error('Unexpected API response format');
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  },
};
