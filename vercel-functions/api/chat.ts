import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { VercelRequest, VercelResponse } from '@vercel/node';
import Airtable from 'airtable';

// Airtable setup
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY! });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

// Parse env origin list once at module level
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientId, message } = req.body;

  if (!clientId || !message) {
    return res.status(400).json({ error: 'Missing clientId or message' });
  }

  try {
    // 1. Fetch system prompt from Airtable
    const records = await base(`${process.env.AIRTABLE_APP_NAME!}`)
      .select({
        filterByFormula: `{client_id} = '${clientId}'`,
        maxRecords: 1,
      })
      .firstPage();

    const client = records[0];
    if (!client) {
      return res.status(404).json({ error: `Client ${clientId} not found` });
    }

    const systemPrompt = client.get('system_prompt') as string;

    // 2. Call OpenAI with streaming using AI SDK
    const result = streamText({
      model: openai('gpt-4o'),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    // Set streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Convert the AI SDK stream to Node.js response
    const stream = result.toDataStream();
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convert Uint8Array to string and write to response
        const chunk = new TextDecoder().decode(value);
        res.write(chunk);
      }
    } finally {
      reader.releaseLock();
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to handle chat' });
  }
}
