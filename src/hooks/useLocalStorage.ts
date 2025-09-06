import { useState, useEffect } from 'react';
import { Session, Problem } from '@/types';

export function useLocalStorage() { // Renamed from useLocalStorage to usePersistentStorage conceptually
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:3001/api'; // Assuming your backend runs on port 3001

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Session[] = await response.json();
      // Convert timestamp (number) back to Date objects
      const sessionsWithDates = data.map(session => ({
        ...session,
        timestamp: new Date(session.timestamp),
      }));
      setSessions(sessionsWithDates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('Error loading sessions from backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data from backend on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const addSession = async (session: Session) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...session, timestamp: session.timestamp.getTime() }), // Convert Date to number
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedSession = await response.json();
      setSessions(prev => [{ ...session, timestamp: new Date(session.timestamp) }, ...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const updateSession = async (sessionId: string, updatedSession: Partial<Session>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedSession, timestamp: updatedSession.timestamp?.getTime() }), // Convert Date to number if present
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSessions(prev =>
        prev.map(session =>
          session.id === sessionId ? { ...session, ...updatedSession, timestamp: updatedSession.timestamp ? new Date(updatedSession.timestamp) : session.timestamp } : session
        ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      );
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSessions(prev => prev.filter(session => session.id !== sessionId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const updateProblem = async (sessionId: string, problemId: string, updatedProblem: Partial<Problem>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/problems/${problemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProblem),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSessions(prev =>
        prev.map(session =>
          session.id === sessionId
            ? {
                ...session,
                problems: session.problems.map(problem =>
                  problem.id === problemId ? { ...problem, ...updatedProblem } : problem
                ),
              }
            : session
        ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      );
    } catch (error) {
      console.error('Error updating problem:', error);
    }
  };

  const addProblem = async (sessionId: string, problem: Problem) => {
    console.log('Attempting to add problem:', problem, 'to session:', sessionId);
    const originalSessions = sessions; // Capture current state for potential rollback
    try {
      // Optimistically update the UI
      const newSessions = prev =>
        prev.map(session =>
          session.id === sessionId
            ? { ...session, problems: [...session.problems, problem] }
            : session
        ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setSessions(newSessions);
      console.log('Optimistically updated sessions (add problem):', newSessions(originalSessions));

      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problem),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Problem added successfully to backend.');
    } catch (error) {
      console.error('Error adding problem:', error);
      setSessions(originalSessions); // Rollback on error
      console.log('Rolled back sessions (add problem).');
    }
  };

  const deleteProblem = async (sessionId: string, problemId: string) => {
    console.log('Attempting to delete problem:', problemId, 'from session:', sessionId);
    const originalSessions = sessions; // Capture current state for potential rollback
    try {
      // Optimistically update the UI
      const newSessions = prev =>
        prev.map(session =>
          session.id === sessionId
            ? { ...session, problems: session.problems.filter(p => p.id !== problemId) }
            : session
        ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setSessions(newSessions);
      console.log('Optimistically updated sessions (delete problem):', newSessions(originalSessions));

      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/problems/${problemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Problem deleted successfully from backend.');
    } catch (error) {
      console.error('Error deleting problem:', error);
      setSessions(originalSessions); // Rollback on error
      console.log('Rolled back sessions (delete problem).');
    }
  };

  return {
    sessions,
    isLoading,
    addSession,
    updateSession,
    deleteSession,
    updateProblem,
    addProblem,
    deleteProblem,
  };
}