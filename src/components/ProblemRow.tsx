import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, X } from "lucide-react";
import { Problem } from "@/types";

interface ProblemRowProps {
  problem: Problem;
  sessionType: 'contest' | 'problem';
  onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
  onDeleteProblem: (problemId: string) => void;
  isProblemHighlighted: (problem: Problem) => boolean;
  isProblemSuccessful: (problem: Problem) => boolean;
  getHighlightClasses: (isHighlighted: boolean) => string;
  gridLayout: string;
}

export function ProblemRow({
  problem,
  sessionType,
  onUpdateProblem,
  onDeleteProblem,
  isProblemHighlighted,
  isProblemSuccessful,
  getHighlightClasses,
  gridLayout,
}: ProblemRowProps) {
  const [name, setName] = useState(problem.name);
  const [notes, setNotes] = useState(problem.notes);
  const [editingTag, setEditingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setName(problem.name);
    setNotes(problem.notes);
  }, [problem.name, problem.notes]);

  const handleAddTag = () => {
    if (newTag.trim() === '') {
      setEditingTag(false);
      setNewTag('');
      return;
    }
    const existingTags = problem.tag ? problem.tag.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (!existingTags.includes(newTag.trim())) {
      const updatedTags = [...existingTags, newTag.trim()].join(', ');
      onUpdateProblem(problem.id, { tag: updatedTags });
    }
    setNewTag('');
    setEditingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const existingTags = problem.tag ? problem.tag.split(',').map(t => t.trim()) : [];
    const updatedTags = existingTags.filter(t => t !== tagToRemove).join(', ');
    onUpdateProblem(problem.id, { tag: updatedTags });
  };

  const renderTagsCell = () => {
    const tags = problem.tag ? problem.tag.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    return (
      <div className="flex flex-wrap items-center gap-1">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
          >
            {tag}
            <button 
              onClick={() => handleRemoveTag(tag)} 
              className="ml-1.5 opacity-50 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {editingTag ? (
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            onBlur={handleAddTag}
            autoFocus
            className="h-7 text-xs w-24"
            placeholder="New tag..."
          />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingTag(true)}
            className="h-6 w-6 border border-dashed hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div
      key={problem.id}
      className={`grid ${gridLayout} gap-4 items-start p-3 rounded-lg border transition-all duration-200 ${
        isProblemHighlighted(problem)
          ? 'bg-problem-highlight border-problem-highlight-border' 
          : isProblemSuccessful(problem)
            ? 'bg-success-light border-success/20' 
            : 'bg-card border-card-border hover:border-border'
      }`}
    >
      {/* Problem Name */}
      <div>
        <Input
          placeholder="Problem name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onUpdateProblem(problem.id, { name })}
          className={getHighlightClasses(isProblemHighlighted(problem))}
        />
      </div>

      {/* Solved checkbox */}
      <div className="flex items-center justify-center pt-2">
        <Checkbox
          checked={problem.solved}
          onCheckedChange={(checked) => 
            onUpdateProblem(problem.id, { solved: checked as boolean })
          }
        />
      </div>

      {/* Upsolved checkbox (contest only) */}
      {sessionType === 'contest' && (
        <div className="flex items-center justify-center pt-2">
          <Checkbox
            checked={problem.upsolved || false}
            onCheckedChange={(checked) => 
              onUpdateProblem(problem.id, { upsolved: checked as boolean })
            }
          />
        </div>
      )}
      
      {/* Tag cell */}
      <div>
        {renderTagsCell()}
      </div>
      
      {/* Review dropdown */}
      <div>
        <Select 
          value={problem.review || ''} 
          onValueChange={(value) => onUpdateProblem(problem.id, { review: value as Problem['review'] })}
        >
          <SelectTrigger className={`text-sm ${getHighlightClasses(isProblemHighlighted(problem))}`}>
            <SelectValue placeholder="Review..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="very good problem">Very good problem</SelectItem>
            <SelectItem value="good idea">Good idea</SelectItem>
            <SelectItem value="easy problem">Easy problem</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Notes */}
      <div>
        <Textarea
          placeholder="Notes, approach, complexity..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdateProblem(problem.id, { notes })}
          className={`min-h-[80px] resize-none ${getHighlightClasses(isProblemHighlighted(problem))}`}
        />
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-center pt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteProblem(problem.id)}
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}