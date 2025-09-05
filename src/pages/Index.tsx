import { Header } from "@/components/Header";
import { SessionCard } from "@/components/SessionCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Session, Problem } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from "lucide-react";

const Index = () => {
  const {
    sessions,
    isLoading,
    addSession,
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
      link: '',
      solved: false,
      notes: ''
    }));

    const newSession: Session = {
      id: uuidv4(),
      type,
      timestamp: new Date(),
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Practice Sessions</h2>
                <p className="text-muted-foreground">
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''} • {
                    sessions.reduce((total, session) => total + session.problems.filter(p => p.solved).length, 0)
                  } problems solved
                </p>
              </div>
            </div>
            
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onUpdateProblem={updateProblem}
                onAddProblem={addProblem}
                onDeleteProblem={deleteProblem}
                onDeleteSession={deleteSession}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
