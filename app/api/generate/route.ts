import OpenAI from 'openai';
import { NextResponse } from 'next/server';

interface GeneratePostBody {
  brief?: string;
  apiKey?: string;
  systemPrompt?: string;
}

export async function POST(request: Request) {
  let body: GeneratePostBody;

  try {
    body = (await request.json()) as GeneratePostBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const brief = body.brief?.trim();
  const apiKey = body.apiKey?.trim();
  const systemPrompt = body.systemPrompt?.trim();

  if (!brief || !apiKey || !systemPrompt) {
    return NextResponse.json(
      { error: 'brief, apiKey, and systemPrompt are required' },
      { status: 400 }
    );
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: brief },
      ],
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { error: `Failed to generate post: ${message}` },
      { status: 500 }
    );
  }
}
