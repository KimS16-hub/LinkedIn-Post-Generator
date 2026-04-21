export interface Brief {
  content: string;
  id: string;
}

export interface AgentStep {
  label: string;
  content: string;
}

export interface GeneratedPost {
  id: string;
  brief: string;
  content: string;
  status: 'pending' | 'generated' | 'error';
  agentSteps?: AgentStep[];
  error?: string;
}
