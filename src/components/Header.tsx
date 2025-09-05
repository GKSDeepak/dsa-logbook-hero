import { Button } from "@/components/ui/button";
import { Trophy, Code } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onCreateSession: (type: 'contest' | 'problem') => void;
}

export function Header({ onCreateSession }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DSA Practice Tracker</h1>
            <p className="text-muted-foreground mt-1">Track your coding journey, one problem at a time</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="contest"
              size="lg"
              onClick={() => onCreateSession('contest')}
              className="animate-fade-in"
            >
              <Trophy className="h-5 w-5" />
              Contest
            </Button>
            <Button
              variant="problem"
              size="lg"
              onClick={() => onCreateSession('problem')}
              className="animate-fade-in"
            >
              <Code className="h-5 w-5" />
              Problem
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}