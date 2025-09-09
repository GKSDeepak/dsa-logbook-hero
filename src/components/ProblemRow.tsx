import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, X, ExternalLink } from "lucide-react";
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
  viewMode?: 'table' | 'list';
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
  viewMode = 'table'
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

  const handleLinkClick = () => {
    if (sessionType === 'problem' && problem.link) {
      const url = problem.link.startsWith('http') ? problem.link : `https://${problem.link}`;
      window.open(url, '_blank');
    }
  };

  const renderTagsCell = () => {
    const tags = problem.tag ? problem.tag.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    return (
      <div className="flex flex-wrap items-center gap-1">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
          >
            {tag}
            <button 
              onClick={() => handleRemoveTag(tag)} 
              className="ml-1.5 opacity-70 hover:opacity-100 focus:outline-none"
              aria-label={`Remove tag ${tag}`}
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
            className="h-6 w-6 border border-dashed hover:bg-accent hover:text-accent-foreground rounded-full"
            aria-label="Add tag"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  // Render list view for mobile
  if (viewMode === 'list') {
    return (
      <div className={`p-4 rounded-xl border transition-all duration-200 ${
        isProblemHighlighted(problem)
          ? 'bg-problem-highlight border-problem-highlight-border shadow-sm' 
          : isProblemSuccessful(problem)
            ? 'bg-success-light border-success/20' 
            : 'bg-card border-card-border hover:border-border hover:shadow-sm'
      }`}>
        <div className="space-y-4">
          {/* Problem Name and Link */}
          <div className="space-y-2">
            <Input
              placeholder="Problem name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => onUpdateProblem(problem.id, { name })}
              className={getHighlightClasses(isProblemHighlighted(problem))}
            />
            {sessionType === 'problem' && problem.link && (
              <div className="flex gap-2">
                <Input
                  placeholder="Problem link..."
                  value={problem.link || ''}
                  onChange={(e) => onUpdateProblem(problem.id, { link: e.target.value })}
                  className={`text-sm ${getHighlightClasses(isProblemHighlighted(problem))}`}
                />
                {problem.link && problem.link.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLinkClick}
                    className="h-8 px-2"
                    aria-label="Open problem link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Status and Tags */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={problem.solved}
                onCheckedChange={(checked) => 
                  onUpdateProblem(problem.id, { solved: checked as boolean })
                }
                id={`solved-${problem.id}`}
              />
              <label htmlFor={`solved-${problem.id}`} className="text-sm text-muted-foreground">
                Solved
              </label>
            </div>
            
            {sessionType === 'contest' && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={problem.upsolved || false}
                  onCheckedChange={(checked) => 
                    onUpdateProblem(problem.id, { upsolved: checked as boolean })
                  }
                  id={`upsolved-${problem.id}`}
                />
                <label htmlFor={`upsolved-${problem.id}`} className="text-sm text-muted-foreground">
                  Upsolved
                </label>
              </div>
            )}
            
            <div className="flex-1">
              {renderTagsCell()}
            </div>
          </div>
          
          {/* Review */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Review
            </label>
            <Select 
              value={problem.review || ''} 
              onValueChange={(value) => onUpdateProblem(problem.id, { review: value as Problem['review'] })}
            >
              <SelectTrigger className={`text-sm ${getHighlightClasses(isProblemHighlighted(problem))}`}>
                <SelectValue placeholder="Select review..." />
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
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Notes
            </label>
            <Textarea
              placeholder="Notes, approach, complexity..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => onUpdateProblem(problem.id, { notes })}
              className={`min-h-[80px] resize-none ${getHighlightClasses(isProblemHighlighted(problem))}`}
            />
          </div>
          
          {/* Actions */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteProblem(problem.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              aria-label="Delete problem"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render table view (default)
  return (
    <div
      className={`grid ${gridLayout} gap-4 items-start p-4 rounded-xl border transition-all duration-200 ${
        isProblemHighlighted(problem)
          ? 'bg-problem-highlight border-problem-highlight-border shadow-sm' 
          : isProblemSuccessful(problem)
            ? 'bg-success-light border-success/20' 
            : 'bg-card border-card-border hover:border-border hover:shadow-sm'
      }`}
    >
      {/* Problem Name and Link (for problem sessions) */}
      <div className="space-y-2">
        <Input
          placeholder="Problem name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onUpdateProblem(problem.id, { name })}
          className={getHighlightClasses(isProblemHighlighted(problem))}
        />
        {sessionType === 'problem' && (
          <div className="flex gap-2">
            <Input
              placeholder="Problem link..."
              value={problem.link || ''}
              onChange={(e) => onUpdateProblem(problem.id, { link: e.target.value })}
              className={`text-sm ${getHighlightClasses(isProblemHighlighted(problem))}`}
            />
            {problem.link && problem.link.trim() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLinkClick}
                className="h-8 px-2"
                aria-label="Open problem link"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Solved checkbox */}
      <div className="flex items-center justify-center pt-2">
        <div className="flex flex-col items-center">
          <Checkbox
            checked={problem.solved}
            onCheckedChange={(checked) => 
              onUpdateProblem(problem.id, { solved: checked as boolean })
            }
            id={`solved-${problem.id}`}
          />
          <label htmlFor={`solved-${problem.id}`} className="text-xs text-muted-foreground mt-1">
            Solved
          </label>
        </div>
      </div>

      {/* Upsolved checkbox (contest only) */}
      {sessionType === 'contest' && (
        <div className="flex items-center justify-center pt-2">
          <div className="flex flex-col items-center">
            <Checkbox
              checked={problem.upsolved || false}
              onCheckedChange={(checked) => 
                onUpdateProblem(problem.id, { upsolved: checked as boolean })
              }
              id={`upsolved-${problem.id}`}
            />
            <label htmlFor={`upsolved-${problem.id}`} className="text-xs text-muted-foreground mt-1">
              Upsolved
            </label>
          </div>
        </div>
      )}
      
      {/* Tag cell */}
      <div className="pt-2">
        {renderTagsCell()}
      </div>
      
      {/* Review dropdown */}
      <div className="pt-2">
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
      <div className="pt-2">
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
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
          aria-label="Delete problem"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}