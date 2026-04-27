import { useState } from 'react';
import { generatePost, APIError } from '../services/api';
import { useSettings } from './useSettings';
import type { Brief, GeneratedPost } from '../types';

export function usePostGeneration() {
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { systemPrompt } = useSettings();

  const generatePosts = async (briefs: Brief[]) => {
    setError(null);
    const initialPosts = briefs.map((brief) => ({
      id: brief.id,
      brief: brief.content,
      content: '',
      status: 'pending' as const,
    }));
    setPosts(initialPosts);

    for (const [index, brief] of briefs.entries()) {
      try {
        const { content, agentSteps } = await generatePost({
          brief: brief.content,
          systemPrompt,
        });
        setPosts((currentPosts) =>
          currentPosts.map((post, i) =>
            i === index
              ? { ...post, content, agentSteps, status: 'generated' as const }
              : post
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof APIError ? err.message : 'Failed to generate post';

        setPosts((currentPosts) =>
          currentPosts.map((post, i) =>
            i === index
              ? { ...post, status: 'error' as const, error: errorMessage }
              : post
          )
        );
      }
    }
  };

  return { posts, error, generatePosts, setError };
}
