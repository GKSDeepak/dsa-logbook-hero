import { useState } from "react";
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
      link: session.type === 'problem' ? '' : undefined,
      solved: false,
      upsolved: session.type === 'contest' ? false : undefined,
      tag: '',
      review: '' as const,
      notes: ''
    };
    onAddProblem(session.id, newProblem);
  };

  const solvedCount = session.problems.filter(p => p.solved).length;
  const totalCount = session.problems.length;

  const sessionIcon = session.type === 'contest' ? Trophy : Code;
  const SessionIcon = sessionIcon;

  return (
    <div className="animate-slide-up bg-card border border-card-border rounded-lg shadow-md overflow-hidden">
      <div
        className={`p-4 cursor-pointer transition-colors duration-200 ${
          session.type === 'contest' 
            ? 'bg-contest-light hover:bg-contest-light/70' 
            : 'bg-problem-light hover:bg-problem-light/70'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              session.type === 'contest' ? 'bg-contest/10' : 'bg-problem/10'
            }`}>
              <SessionIcon className={`h-5 w-5 ${
                session.type === 'contest' ? 'text-contest' : 'text-problem'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg capitalize">
                {session.type} Session
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatTimestamp(session.timestamp)}
                {totalCount > 0 && (
                  <>
                    <span>•</span>
                    <span className={solvedCount === totalCount ? 'text-success font-medium' : ''}>
                      {solvedCount}/{totalCount} solved
                    </span>
                  </>
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
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-card-border">
          {session.type === 'contest' && (
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Contest Link
              </label>
              <input
                type="text"
                placeholder="Enter contest link..."
                value={session.contestLink || ''}
                onChange={(e) => onUpdateSession?.(session.id, { contestLink: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
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