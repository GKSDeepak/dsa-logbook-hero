import { Header } from "@/components/Header";
import { SessionCard } from "@/components/SessionCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Session, Problem } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { Loader2, TrendingUp, Target, Clock } from "lucide-react";

const Index = () => {
  const {
    sessions,
    isLoading,
    addSession,
    updateSession,
    updateProblem,
    addProblem,
    deleteProblem,
    deleteSession
  } = useLocalStorage();

  const handleCreateSession = (type: 'contest' | 'problem') => {
    const defaultProblemsCount = type === 'contest' ? 4 : 2;
    const defaultProblems: Problem[] = Array.from({ length: defaultProblemsCount }, () => ({
      id: uuidv4(),
      name: '',
      link: type === 'problem' ? '' : undefined,
      solved: false,
      upsolved: type === 'contest' ? false : undefined,
      tag: '',
      review: '' as const,
      notes: ''
    }));

    const newSession: Session = {
      id: uuidv4(),
      type,
      timestamp: new Date(),
      contestLink: type === 'contest' ? '' : undefined,
      problems: defaultProblems
    };

    addSession(newSession);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your practice sessions...
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSessions = sessions.length;
  const totalProblems = sessions.reduce((total, session) => total + session.problems.length, 0);
  const solvedProblems = sessions.reduce((total, session) => total + session.problems.filter(p => p.solved).length, 0);
  const upsolvedProblems = sessions.reduce((total, session) => total + session.problems.filter(p => p.upsolved).length, 0);
  const totalSolved = solvedProblems + upsolvedProblems;
  const completionPercentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;
  
  // Calculate recent activity (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentSessions = sessions.filter(session => 
    new Date(session.timestamp) >= oneWeekAgo
  );
  
  const recentProblems = recentSessions.reduce((total, session) => 
    total + session.problems.filter(p => p.solved || p.upsolved).length, 0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onCreateSession={handleCreateSession} />
      
      <main className="container mx-auto px-4 py-8">
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="text-3xl">🚀</div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Ready to start coding?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first practice session by clicking Contest or Problem above. 
              Track your progress and level up your DSA skills!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Problems</p>
                    <p className="text-2xl font-bold">{totalProblems}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solved</p>
                    <p className="text-2xl font-bold">{totalSolved}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/10 rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold">{recentProblems}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-contest/10 rounded-lg">
                    <div className="h-5 w-5 rounded-full bg-contest flex items-center justify-center text-xs text-contest-foreground font-bold">
                      %
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion</p>
                    <p className="text-2xl font-bold">{completionPercentage}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sessions Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-card-border rounded-lg p-6 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold">Practice Sessions</h2>
                <p className="text-muted-foreground mt-1">
                  {totalSessions} session{totalSessions !== 1 ? 's' : ''} • {totalSolved} problems solved
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-medium">
                  {completionPercentage}% completion
                </div>
              </div>
            </div>
            
            {/* Sessions List */}
            <div className="space-y-6">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onUpdateProblem={updateProblem}
                  onAddProblem={addProblem}
                  onDeleteProblem={deleteProblem}
                  onDeleteSession={deleteSession}
                  onUpdateSession={updateSession}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
