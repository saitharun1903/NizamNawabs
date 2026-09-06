import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getPublicAIContext } from '@/lib/ai-context';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Returns current public AI assistant configuration (name, greeting, quick prompts)
export async function GET() {
  try {
    const context = await getPublicAIContext();
    return NextResponse.json({
      enabled: context.enabled,
      assistantName: context.assistantName,
      welcomeMessage: context.welcomeMessage,
      suggestedPrompts: context.suggestedPrompts,
      configured: Boolean(process.env.GEMINI_API_KEY),
    });
  } catch (error) {
    return NextResponse.json({
      enabled: true,
      assistantName: 'Nizam Nawabs Assistant',
      welcomeMessage: "Hey. I'm the Nizam Nawabs Assistant. What would you like to know about the team?",
      suggestedPrompts: [
        'Who are Nizam Nawabs?',
        'Show me the roster',
        'When is the next match?',
        'Tell me about Season 1',
        'Latest team news',
      ],
      configured: false,
    });
  }
}

// POST: Streams AI responses safely grounded in current published database content
export async function POST(request: Request) {
  try {
    // 1. Abuse & Rate Protections: Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'The assistant is temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    // 2. Validate Input Payload
    const body = await request.json().catch(() => null);
    if (!body || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'Valid message string required' }, { status: 400 });
    }

    const message = body.message.trim();
    if (!message) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message exceeds maximum limit of 500 characters.' },
        { status: 400 }
      );
    }

    const currentPath = typeof body.pathname === 'string' ? body.pathname : '/';

    // 3. Assemble Safe Public Database Context
    const aiContext = await getPublicAIContext(currentPath);
    if (!aiContext.enabled) {
      return NextResponse.json(
        { error: 'The AI assistant is currently paused by administrators.' },
        { status: 403 }
      );
    }

    // 4. Build Conversation History (Max 8 previous turns to prevent token bloat)
    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const safeHistory = rawHistory
      .slice(-8)
      .filter((h: any) => h && typeof h.content === 'string' && (h.role === 'user' || h.role === 'assistant'))
      .map((h: any) => ({
        role: h.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: String(h.content).slice(0, 500) }],
      }));

    // Append current user message
    const contents = [
      ...safeHistory,
      {
        role: 'user' as const,
        parts: [{ text: message }],
      },
    ];

    // 5. Initialize Official Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    const responseStream = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction: aiContext.systemInstruction,
        temperature: 0.25,
      },
    });

    // 6. Stream chunks over HTTP ReadableStream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (streamError) {
          console.error('[Gemini Stream Error]', streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('[Chat API Error]', error);
    return NextResponse.json(
      { error: 'The assistant is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
