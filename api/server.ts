import 'dotenv/config';

import express, { Request, Response, RequestHandler } from 'express';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import cors from 'cors';

// App setup
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// --- CORS setup ---
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// --- Type for incoming chat request ---
interface ChatRequestBody {
  message: string;
  clientId: string;
}

// --- Utility to fetch prompt from Airtable ---
async function getPrompt(clientId: string): Promise<string | null> {
  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_APP_NAME}?filterByFormula=client_id='${clientId}'`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  });

  const json = await res.json();
  console.log('Airtable response:', JSON.stringify(json, null, 2));
  
  const record = json.records?.[0]; // Assumes one record per clientId for now

  if (!record) {
    console.log(`No record found for clientId: ${clientId}`);
    return null;
  }

  const systemPrompt = record.fields?.system_prompt as string | undefined ?? null;
  
  return systemPrompt;
}

// --- Strongly typed handler for /chat ---
const chatHandler: RequestHandler<{}, any, ChatRequestBody> = async (
  req: Request<{}, any, ChatRequestBody>,
  res: Response
) => {
  const { clientId, message } = req.body;

  if (!clientId || !message) {
    res.status(400).json({ error: 'Missing clientId or message' });
    return;
  }

  try {
    const systemPrompt = await getPrompt(clientId);

    if (!systemPrompt) {
      res.status(404).json({ error: `Client ${clientId} not found or missing prompt` });
      return;
    }

    const result = streamText({
      model: openai('gpt-4o'),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const stream = result.toDataStream();
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);

      // Only extract `"0":"..."` lines
      const matches = [...chunk.matchAll(/0:"(.*?)"/g)];

      for (const [, token] of matches) {
        res.write(token); // send only the actual text
      }
    }

    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to handle chat' });
    } else {
      res.end();
    }
  }
};

// --- Route registration ---
app.post('/chat', chatHandler);

// --- Start server ---
app.listen(port, () => {
  console.log(`Chat API running on http://localhost:${port}`);
});
