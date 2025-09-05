import { useState, useEffect } from 'react';
import { Session, SessionStorage } from '@/types';

const STORAGE_KEY = 'dsa-practice-tracker';

export function useLocalStorage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: SessionStorage = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const sessionsWithDates = data.sessions.map(session => ({
          ...session,
          timestamp: new Date(session.timestamp)
        }));
        setSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error('Error loading sessions from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever sessions change
  useEffect(() => {
    if (!isLoading) {
      try {
        const data: SessionStorage = { sessions };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving sessions to localStorage:', error);
      }
    }
  }, [sessions, isLoading]);

  const addSession = (session: Session) => {
    setSessions(prev => [session, ...prev]);
  };

  const updateSession = (sessionId: string, updatedSession: Partial<Session>) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId ? { ...session, ...updatedSession } : session
      )
    );
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const updateProblem = (sessionId: string, problemId: string, updatedProblem: Partial<Problem>) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              problems: session.problems.map(problem =>
                problem.id === problemId ? { ...problem, ...updatedProblem } : problem
              )
            }
          : session
      )
    );
  };

  const addProblem = (sessionId: string, problem: Problem) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, problems: [...session.problems, problem] }
          : session
      )
    );
  };

  const deleteProblem = (sessionId: string, problemId: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, problems: session.problems.filter(p => p.id !== problemId) }
          : session
      )
    );
  };

  return {
    sessions,
    isLoading,
    addSession,
    updateSession,
    deleteSession,
    updateProblem,
    addProblem,
    deleteProblem
  };
}

export type Problem = {
  id: string;
  name: string;
  link?: string;
  solved: boolean;
  notes: string;
};