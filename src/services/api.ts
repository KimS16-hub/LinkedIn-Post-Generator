import type { AgentStep } from '../types';

interface GeneratePostOptions {
  brief: string;
  apiKey: string;
  systemPrompt: string;
}

interface GeneratePostResult {
  content: string;
  agentSteps: AgentStep[];
}

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function generatePost({
  brief,
  apiKey,
  systemPrompt,
}: GeneratePostOptions): Promise<GeneratePostResult> {
  if (!apiKey) {
    throw new APIError('API key is required');
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ brief, apiKey, systemPrompt }),
  });

  const payload = (await response.json()) as {
    content?: string;
    agentSteps?: AgentStep[];
    error?: string;
  };

  if (!response.ok) {
    throw new APIError(payload.error || 'Failed to generate post');
  }

  if (!payload.content) {
    throw new APIError('No content generated');
  }

  return {
    content: payload.content,
    agentSteps: payload.agentSteps ?? [],
  };
}
