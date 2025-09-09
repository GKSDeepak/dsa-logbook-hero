import { Button } from "@/components/ui/button";
import { Trophy, Code, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onCreateSession: (type: 'contest' | 'problem') => void;
}

export function Header({ onCreateSession }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DSA Practice Tracker</h1>
            <p className="text-muted-foreground text-sm mt-1 hidden sm:block">Track your coding journey, one problem at a time</p>
          </div>
          
          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="contest"
              size="lg"
              onClick={() => onCreateSession('contest')}
              className="animate-fade-in"
              aria-label="Create new contest session"
            >
              <Trophy className="h-5 w-5" />
              Contest
            </Button>
            <Button
              variant="problem"
              size="lg"
              onClick={() => onCreateSession('problem')}
              className="animate-fade-in"
              aria-label="Create new problem session"
            >
              <Code className="h-5 w-5" />
              Problem
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
          
          {/* Mobile menu */}
          <div className="sm:hidden flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open session menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onCreateSession('contest')}>
                  <Trophy className="h-4 w-4 mr-2" />
                  New Contest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCreateSession('problem')}>
                  <Code className="h-4 w-4 mr-2" />
                  New Problem
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}