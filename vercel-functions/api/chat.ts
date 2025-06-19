import { OpenAI } from 'openai';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { AirtableBase } from './lib/airtable';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Airtable setup
const airtableBase = new AirtableBase({
  apiKey: process.env.AIRTABLE_API_KEY!,
  baseId: process.env.AIRTABLE_BASE_ID!,
});

export const config = {
  api: {
    bodyParser: true,
  },
};

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
    res.status(204).end(); // No content
    return;
  }

  if (req.method !== 'POST') return res.status(405).end();

  const { clientId, message } = req.body;

  if (!clientId || !message) {
    return res.status(400).json({ error: 'Missing clientId or message' });
  }

  try {
    // 1. Fetch system prompt from Airtable
    const records = await airtableBase.get(`${process.env.AIRTABLE_APP_NAME!}`)
      .select({
        filterByFormula: `{client_id} = '${clientId}'`,
        maxRecords: 1,
      })
      .firstPage();

    const client = records[0];
    if (!client) throw new Error(`Client ${clientId} not found`);

    // Test response to verify Airtable data
    return res.status(200).json({
      message: 'Airtable data retrieved successfully',
      clientId: clientId,
      clientData: {
        id: client.id,
        fields: client.fields,
      },
      recordsFound: records.length,
    });

    // const systemPrompt = client.get('system_prompt') as string;

    // // 2. Call OpenAI with streaming
    // const stream = await openai.chat.completions.create({
    //   model: 'gpt-4o',
    //   stream: true,
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: message },
    //   ],
    // });

    // res.setHeader('Content-Type', 'text/event-stream');
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Connection', 'keep-alive');

    // for await (const chunk of stream) {
    //   const content = chunk.choices[0]?.delta?.content || '';
    //   res.write(`data: ${content}\n\n`);
    // }

    // res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to handle chat' });
  }
}
