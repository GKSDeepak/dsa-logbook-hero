import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Problem } from "@/types";

interface ProblemTableProps {
  problems: Problem[];
  onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
  onAddProblem: () => void;
  onDeleteProblem: (problemId: string) => void;
}

export function ProblemTable({ problems, onUpdateProblem, onAddProblem, onDeleteProblem }: ProblemTableProps) {
  const handleLinkClick = (link: string) => {
    if (link && link.trim()) {
      // Add https:// if no protocol is specified
      const url = link.startsWith('http') ? link : `https://${link}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-3 items-center text-sm font-medium text-muted-foreground px-3 py-2">
        <div className="col-span-5">Problem Name / Link</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-5">Notes</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {problems.map((problem) => (
        <div
          key={problem.id}
          className={`grid grid-cols-12 gap-3 items-start p-3 rounded-lg border transition-all duration-200 ${
            problem.solved 
              ? 'bg-success-light border-success/20' 
              : 'bg-card border-card-border hover:border-border'
          }`}
        >
          <div className="col-span-5 space-y-2">
            <Input
              placeholder="Problem name..."
              value={problem.name}
              onChange={(e) => onUpdateProblem(problem.id, { name: e.target.value })}
              className={`${problem.solved ? 'bg-success-light/50' : ''}`}
            />
            <Input
              placeholder="Link (optional)..."
              value={problem.link || ''}
              onChange={(e) => onUpdateProblem(problem.id, { link: e.target.value })}
              className={`text-sm ${problem.solved ? 'bg-success-light/50' : ''}`}
            />
            {problem.link && problem.link.trim() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLinkClick(problem.link!)}
                className="w-fit text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Link
              </Button>
            )}
          </div>
          
          <div className="col-span-1 flex items-center justify-center pt-2">
            <Checkbox
              checked={problem.solved}
              onCheckedChange={(checked) => 
                onUpdateProblem(problem.id, { solved: checked as boolean })
              }
            />
          </div>
          
          <div className="col-span-5">
            <Textarea
              placeholder="Notes, approach, complexity..."
              value={problem.notes}
              onChange={(e) => onUpdateProblem(problem.id, { notes: e.target.value })}
              className={`min-h-[80px] resize-none ${problem.solved ? 'bg-success-light/50' : ''}`}
            />
          </div>
          
          <div className="col-span-1 flex items-center justify-center pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteProblem(problem.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <Button
        variant="outline"
        onClick={onAddProblem}
        className="w-full border-dashed hover:border-solid transition-all duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Problem
      </Button>
    </div>
  );
}