export interface Problem {
  id: string;
  name: string;
  link?: string;
  solved: boolean;
  upsolved?: boolean;
  tag: string;
  review: 'very good problem' | 'good idea' | 'easy problem' | '';
  notes: string;
}

export interface Session {
  id: string;
  type: 'contest' | 'problem';
  timestamp: Date;
  contestLink?: string;
  problems: Problem[];
}

export interface SessionStorage {
  sessions: Session[];
}