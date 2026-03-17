import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   🔌 CONNECTORS (MOCK FOR NOW)
   ========================= */

async function getGmailData() {
  return `
- 2 unread client enquiries
- 1 follow-up needed (wedding shoot lead)
- No response sent yet
`;
}

async function getCalendarData() {
  return `
- Tomorrow: Shoot at 14:00
- Today: No bookings
- Gap: Morning available
`;
}

/* =========================
   🤖 CHAT ENDPOINT
   ========================= */

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Pull connector data
    const gmail = await getGmailData();
    const calendar = await getCalendarData();

    const systemPrompt = `
You are a CEO advisor for Marker Media.

REAL-TIME DATA:

GMAIL:
${gmail}

CALENDAR:
${calendar}

Use this data to guide decisions, find missed revenue, and hold the user accountable.

Always end with:

---ACTIONS---
PRIORITY_1:
PRIORITY_2:
PRIORITY_3:
REVENUE:
STRATEGIC:
---END---
`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    res.json({
      ...response.data,
      tools_used: ['gmail', 'google-calendar']
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

/* =========================
   🚀 START SERVER
   ========================= */

app.listen(3000, () => {
  console.log('✅ Backend running on http://localhost:3000');
});
