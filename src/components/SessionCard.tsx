import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProblemTable } from "./ProblemTable";
import { Trophy, Code, ChevronDown, ChevronUp, Trash2, Calendar } from "lucide-react";
import { Session, Problem } from "@/types";
import { v4 as uuidv4 } from 'uuid';

interface SessionCardProps {
  session: Session;
  onUpdateProblem: (sessionId: string, problemId: string, updates: Partial<Problem>) => void;
  onAddProblem: (sessionId: string, problem: Problem) => void;
  onDeleteProblem: (sessionId: string, problemId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSession?: (sessionId: string, updates: Partial<Session>) => void;
}

export function SessionCard({
  session,
  onUpdateProblem,
  onAddProblem,
  onDeleteProblem,
  onDeleteSession,
  onUpdateSession
}: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [contestLink, setContestLink] = useState(session.contestLink || '');

  useEffect(() => {
    setContestLink(session.contestLink || '');
  }, [session.contestLink]);

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const handleAddProblem = () => {
    const newProblem: Problem = {
      id: uuidv4(),
      name: '',
      link: session.type === 'problem' ? '' : '', // Ensure link is always a string
      solved: false,
      upsolved: session.type === 'contest' ? false : false, // Ensure upsolved is always a boolean
      tag: '',
      review: '' as const,
      notes: ''
    };
    onAddProblem(session.id, newProblem);
  };

  const solvedCount = session.problems.filter(p => p.solved).length;
  const totalCount = session.problems.length;
  const upsolvedCount = session.problems.filter(p => p.upsolved).length;

  const sessionIcon = session.type === 'contest' ? Trophy : Code;
  const SessionIcon = sessionIcon;

  // Calculate progress percentage
  const progressPercentage = totalCount > 0 
    ? Math.round(((solvedCount + upsolvedCount) / totalCount) * 100) 
    : 0;

  // Handle keyboard events for expand/collapse
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="animate-slide-up bg-card border border-card-border rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <div
        className={`p-5 cursor-pointer transition-colors duration-200 ${
          session.type === 'contest'
            ? 'bg-contest-light hover:bg-contest-light/70'
            : 'bg-problem-light hover:bg-problem-light/70'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${session.type} session from ${formatTimestamp(session.timestamp)}, ${solvedCount + upsolvedCount} of ${totalCount} problems solved. Click to ${isExpanded ? 'collapse' : 'expand'}.`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              session.type === 'contest' ? 'bg-contest/10' : 'bg-problem/10'
            }`}>
              <SessionIcon className={`h-6 w-6 ${
                session.type === 'contest' ? 'text-contest' : 'text-problem'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg capitalize">
                  {session.type} Session
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {formatTimestamp(session.timestamp)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatTimestamp(session.timestamp)}
                  </span>
                </div>
                
                {totalCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-24 bg-muted rounded-full h-2" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
                      <div 
                        className={`h-2 rounded-full ${
                          progressPercentage === 100 ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${solvedCount === totalCount ? 'text-success' : 'text-muted-foreground'}`}>
                      {solvedCount + upsolvedCount}/{totalCount} solved
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label={`Delete ${session.type} session`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="h-9 w-9 text-muted-foreground hover:bg-accent"
              aria-label={isExpanded ? "Collapse session" : "Expand session"}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 border-t border-card-border bg-background">
          {session.type === 'contest' && (
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Contest Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter contest link..."
                  value={contestLink}
                  onChange={(e) => setContestLink(e.target.value)}
                  onBlur={() => onUpdateSession?.(session.id, { contestLink })}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  aria-label="Contest link"
                />
                {contestLink && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(contestLink, '_blank')}
                    className="h-9"
                    aria-label="Open contest link in new tab"
                  >
                    Open
                  </Button>
                )}
              </div>
            </div>
          )}
          <ProblemTable
            problems={session.problems}
            sessionType={session.type}
            onUpdateProblem={(problemId, updates) => onUpdateProblem(session.id, problemId, updates)}
            onAddProblem={handleAddProblem}
            onDeleteProblem={(problemId) => onDeleteProblem(session.id, problemId)}
          />
        </div>
      )}
    </div>
  );
}