export interface Brief {
  content: string;
  id: string;
}

export interface GeneratedPost {
  id: string;
  brief: string;
  content: string;
  status: 'pending' | 'generated' | 'error';
  error?: string;
}