import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import Airtable from 'airtable';

// Airtable setup
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY! });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

// Parse env origin list once at module level
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') || '';
  const headers: HeadersInit = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }

  return new Response(null, { status: 204, headers });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin') || '';
  const corsHeaders: HeadersInit = {};
  
  if (allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Vary'] = 'Origin';
  }

  try {
    const { clientId, message } = await request.json();

    if (!clientId || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing clientId or message' }), 
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // 1. Fetch system prompt from Airtable
    const records = await base(`${process.env.AIRTABLE_APP_NAME!}`)
      .select({
        filterByFormula: `{client_id} = '${clientId}'`,
        maxRecords: 1,
      })
      .firstPage();

    const client = records[0];
    if (!client) {
      return new Response(
        JSON.stringify({ error: `Client ${clientId} not found` }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
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

    // Return streaming response with CORS headers
    return result.toTextStreamResponse({
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to handle chat' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}
