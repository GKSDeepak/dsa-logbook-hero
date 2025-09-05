export interface Problem {
  id: string;
  name: string;
  link?: string;
  solved: boolean;
  notes: string;
}

export interface Session {
  id: string;
  type: 'contest' | 'problem';
  timestamp: Date;
  problems: Problem[];
}

export interface SessionStorage {
  sessions: Session[];
}