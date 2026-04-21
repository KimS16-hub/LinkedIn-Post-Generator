import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

interface GeneratePostBody {
  brief?: string;
  apiKey?: string;
  systemPrompt?: string;
}

interface AgentStep {
  label: string;
  content: string;
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
    const client = new Anthropic({ apiKey });

    // Step 1: Analyse briefen – hvad er emne, tone og målgruppe?
    const step1Response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: 'Du er en LinkedIn content-ekspert. Analyser briefs kortfattet og præcist på dansk.',
      messages: [
        {
          role: 'user',
          content: `Analyser dette brief og identificér kortfattet: emne, tone, målgruppe og 2-3 nøglebudskaber.\n\nBrief: ${brief}`,
        },
      ],
    });

    const analysis =
      step1Response.content[0].type === 'text' ? step1Response.content[0].text : '';

    // Step 2: Generer et udkast til LinkedIn-opslaget
    const step2Response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyser dette brief og identificér kortfattet: emne, tone, målgruppe og 2-3 nøglebudskaber.\n\nBrief: ${brief}`,
        },
        { role: 'assistant', content: analysis },
        {
          role: 'user',
          content:
            'Skriv nu et LinkedIn-opslag på dansk baseret på din analyse. Inkludér en stærk hook der stopper scrollet, et informativt midterparti og en tydelig CTA.',
        },
      ],
    });

    const draft =
      step2Response.content[0].type === 'text' ? step2Response.content[0].text : '';

    // Step 3: Evaluer og forbedr – stærk hook, max 3000 tegn, god CTA
    const step3Response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyser dette brief og identificér kortfattet: emne, tone, målgruppe og 2-3 nøglebudskaber.\n\nBrief: ${brief}`,
        },
        { role: 'assistant', content: analysis },
        {
          role: 'user',
          content:
            'Skriv nu et LinkedIn-opslag på dansk baseret på din analyse. Inkludér en stærk hook der stopper scrollet, et informativt midterparti og en tydelig CTA.',
        },
        { role: 'assistant', content: draft },
        {
          role: 'user',
          content:
            'Evaluer opslaget kritisk: Er hooket stærkt nok til at stoppe scrollet? Er det under 3000 tegn? Er CTA\'en klar og handlingsorienteret? Giv den endelige, forbedrede version – kun selve opslaget, ingen forklaring.',
        },
      ],
    });

    const refined =
      step3Response.content[0].type === 'text' ? step3Response.content[0].text : '';

    if (!refined) {
      return NextResponse.json({ error: 'No content generated' }, { status: 502 });
    }

    // Step 4: Tjek for generisk sprog – injicer konkrete detaljer fra briefen hvis nødvendigt
    const step4Response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyser dette brief og identificér kortfattet: emne, tone, målgruppe og 2-3 nøglebudskaber.\n\nBrief: ${brief}`,
        },
        { role: 'assistant', content: analysis },
        {
          role: 'user',
          content:
            'Skriv nu et LinkedIn-opslag på dansk baseret på din analyse. Inkludér en stærk hook der stopper scrollet, et informativt midterparti og en tydelig CTA.',
        },
        { role: 'assistant', content: draft },
        {
          role: 'user',
          content:
            'Evaluer opslaget kritisk: Er hooket stærkt nok til at stoppe scrollet? Er det under 3000 tegn? Er CTA\'en klar og handlingsorienteret? Giv den endelige, forbedrede version – kun selve opslaget, ingen forklaring.',
        },
        { role: 'assistant', content: refined },
        {
          role: 'user',
          content: `Læs dette opslag én gang til med friske øjne og stil dig selv to spørgsmål:
1. Bruger opslaget konkrete detaljer fra briefen (specifikke ord, steder, navne, sansninger), eller er det generisk og kunne være skrevet om hvem som helst?
2. Lyder det som Kim – en rigtig person med en reel oplevelse – eller som en AI der beskriver noget?

Hvis opslaget er generisk eller AI-agtigt: omskriv det med de specifikke detaljer fra briefen. Bevar strukturen og stemmen, men injicer det virkelige og konkrete.
Hvis opslaget allerede er specifikt og autentisk: returner det uændret.

Lever kun det endelige opslag – ingen forklaring.`,
        },
      ],
    });

    const finalContent =
      step4Response.content[0].type === 'text' ? step4Response.content[0].text : refined;

    const agentSteps: AgentStep[] = [
      { label: 'Analyse', content: analysis },
      { label: 'Udkast', content: draft },
      { label: 'Forbedring', content: refined },
    ];

    return NextResponse.json({ content: finalContent, agentSteps });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { error: `Failed to generate post: ${message}` },
      { status: 500 }
    );
  }
}
