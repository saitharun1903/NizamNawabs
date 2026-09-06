import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getPublicAIContext } from '@/lib/ai-context';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Deprecated model identifiers that return 404 from Google API
const DEPRECATED_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
];

const DEFAULT_MODEL = 'gemini-3.6-flash';

function getSanitizedApiKey(): string {
  const rawKey = process.env.GEMINI_API_KEY || '';
  const trimmed = rawKey.trim().replace(/^["']|["']$/g, '');

  // User provided key: AQ.Ab8RN6JH9OPOl2IE2Z4F2fKcB4EEErLsyHMyfXtwddTP9XB7Yw (53 chars)
  // If Vercel env variable was truncated to 51 chars (missing terminal 'Yw') or missing, use the full key
  if (trimmed === 'AQ.Ab8RN6JH9OPOl2IE2Z4F2fKcB4EEErLsyHMyfXtwddTP9XB7' || trimmed.length === 51 || !trimmed) {
    return 'AQ.Ab8RN6JH9OPOl2IE2Z4F2fKcB4EEErLsyHMyfXtwddTP9XB7Yw';
  }

  return trimmed;
}

function getSanitizedModel(): string {
  const envModel = (process.env.GEMINI_MODEL || '').trim().replace(/^["']|["']$/g, '');
  if (!envModel || DEPRECATED_MODELS.includes(envModel)) {
    return DEFAULT_MODEL;
  }
  return envModel;
}

// GET: Returns current public AI assistant configuration (name, greeting, quick prompts)
// Supports ?check=1 for non-sensitive health verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isHealthCheck = searchParams.get('check') === '1' || searchParams.get('health') === '1';

  try {
    const context = await getPublicAIContext();
    const apiKey = getSanitizedApiKey();
    const model = getSanitizedModel();

    if (isHealthCheck) {
      if (!apiKey) {
        return NextResponse.json({
          configured: false,
          healthy: false,
          error: 'GEMINI_API_KEY environment variable is not configured.',
        });
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const ping = await ai.models.generateContent({
          model,
          contents: 'Ping. Reply "OK".',
        });
        return NextResponse.json({
          configured: true,
          healthy: true,
          model,
          response: ping.text?.trim(),
        });
      } catch (healthErr: any) {
        console.error('[Gemini Health Check Error]', healthErr);
        return NextResponse.json({
          configured: true,
          healthy: false,
          model,
          error: healthErr?.message || 'Health check failed',
          status: healthErr?.status,
        });
      }
    }

    return NextResponse.json({
      enabled: context.enabled,
      assistantName: context.assistantName,
      welcomeMessage: context.welcomeMessage,
      suggestedPrompts: context.suggestedPrompts,
      configured: Boolean(apiKey),
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
      configured: Boolean(getSanitizedApiKey()),
    });
  }
}

// POST: Streams AI responses safely grounded in current published database content
export async function POST(request: Request) {
  try {
    // 1. Abuse & Rate Protections: Check API Key
    const apiKey = getSanitizedApiKey();
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'The assistant is temporarily unavailable. Please try again.',
          code: 'MISSING_API_KEY',
          retryable: false,
        },
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
        { error: 'The AI assistant is currently paused by administrators.', retryable: false },
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
    let model = getSanitizedModel();

    // 6. Attempt streaming response with automatic fallback to gemini-3.6-flash & non-streaming
    let responseStream: any = null;

    try {
      responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: aiContext.systemInstruction,
          temperature: 0.25,
        },
      });
    } catch (streamErr: any) {
      console.warn(`[Gemini Stream Error] Model "${model}" failed:`, streamErr?.message || streamErr);

      // If configured model was not default gemini-3.6-flash, retry with default model
      if (model !== DEFAULT_MODEL) {
        model = DEFAULT_MODEL;
        try {
          responseStream = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction: aiContext.systemInstruction,
              temperature: 0.25,
            },
          });
        } catch (retryErr: any) {
          console.warn('[Gemini Stream Retry Error] Retrying with non-streaming fallback:', retryErr?.message);
        }
      }

      // If streaming is unavailable, execute non-streaming fallback
      if (!responseStream) {
        const directResponse = await ai.models.generateContent({
          model: DEFAULT_MODEL,
          contents,
          config: {
            systemInstruction: aiContext.systemInstruction,
            temperature: 0.25,
          },
        });

        const text = directResponse.text || "I don't have that information yet.";
        return new Response(text, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
    }

    // 7. Stream chunks over HTTP ReadableStream
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
          console.error('[Gemini Stream Processing Error]', streamError);
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
    console.error('[Chat API Error]', {
      status: error?.status,
      message: error?.message,
      code: error?.code,
    });
    return NextResponse.json(
      {
        error: 'The assistant is temporarily unavailable. Please try again.',
        retryable: true,
      },
      { status: 500 }
    );
  }
}
