// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Plus, Trash2, ExternalLink } from "lucide-react";
// // import { Problem } from "@/types";

// // interface ProblemTableProps {
// //   problems: Problem[];
// //   sessionType: 'contest' | 'problem';
// //   onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
// //   onAddProblem: () => void;
// //   onDeleteProblem: (problemId: string) => void;
// // }

// // export function ProblemTable({ problems, sessionType, onUpdateProblem, onAddProblem, onDeleteProblem }: ProblemTableProps) {
// //   const handleLinkClick = (link: string) => {
// //     if (link && link.trim()) {
// //       const url = link.startsWith('http') ? link : `https://${link}`;
// //       window.open(url, '_blank');
// //     }
// //   };

// //   const isProblemHighlighted = (problem: Problem) => {
// //     if (sessionType === 'contest') {
// //       return !problem.solved && !problem.upsolved;
// //     }
// //     return !problem.solved;
// //   };

// //   const getHighlightClasses = (isHighlighted: boolean, isSolved: boolean) => {
// //     if (isHighlighted) {
// //       return 'bg-problem-highlight border-problem-highlight-border';
// //     }
// //     if (isSolved) {
// //       return 'bg-success-light/50 border-success/20';
// //     }
// //     return '';
// //   };

// //   const renderTagsInput = (problem: Problem) => {
// //     const tags = problem.tag ? problem.tag.split(',').map(t => t.trim()).filter(Boolean) : [];
    
// //     return (
// //       <div className="space-y-2">
// //         <Input
// //           placeholder="Add tags (comma-separated)..."
// //           value={problem.tag}
// //           onChange={(e) => onUpdateProblem(problem.id, { tag: e.target.value })}
// //           className={`text-xs ${getHighlightClasses(isProblemHighlighted(problem), problem.solved)}`}
// //         />
// //         {tags.length > 0 && (
// //           <div className="flex flex-wrap gap-1">
// //             {tags.map((tag, index) => (
// //               <span 
// //                 key={index} 
// //                 className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
// //               >
// //                 {tag}
// //               </span>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const getGridCols = () => {
// //     return 'grid-cols-12'; // Use standard 12 column grid
// //   };

// //   const getContestHeaderCols = () => [
// //     { name: "Problem Name", span: "col-span-2" },
// //     { name: "Solved", span: "col-span-1" },
// //     { name: "Upsolved", span: "col-span-1" },
// //     { name: "Tag", span: "col-span-2" },
// //     { name: "Review", span: "col-span-2" },
// //     { name: "Notes", span: "col-span-3" },
// //     { name: "", span: "col-span-1" }
// //   ];

// //   const getProblemHeaderCols = () => [
// //     { name: "Problem Name", span: "col-span-2" },
// //     { name: "Link", span: "col-span-2" },
// //     { name: "Solved", span: "col-span-1" },
// //     { name: "Tag", span: "col-span-2" },
// //     { name: "Review", span: "col-span-2" },
// //     { name: "Notes", span: "col-span-2" },
// //     { name: "", span: "col-span-1" }
// //   ];

// //   return (
// //     <div className="space-y-3">
// //       <div className={`grid ${getGridCols()} gap-2 items-center text-sm font-medium text-muted-foreground px-3 py-2`}>
// //         {(sessionType === 'contest' ? getContestHeaderCols() : getProblemHeaderCols()).map((col, index) => (
// //           <div key={index} className={col.span}>{col.name}</div>
// //         ))}
// //       </div>
      
// //       {problems.map((problem) => (
// //         <div
// //           key={problem.id}
// //           className={`grid ${getGridCols()} gap-2 items-start p-3 rounded-lg border transition-all duration-200 ${
// //             isProblemHighlighted(problem)
// //               ? 'bg-problem-highlight border-problem-highlight-border' 
// //               : problem.solved 
// //                 ? 'bg-success-light border-success/20' 
// //                 : 'bg-card border-card-border hover:border-border'
// //           }`}
// //         >
// //           {/* Problem Name */}
// //           <div className="col-span-2">
// //             <Input
// //               placeholder="Problem name..."
// //               value={problem.name}
// //               onChange={(e) => onUpdateProblem(problem.id, { name: e.target.value })}
// //               className={getHighlightClasses(isProblemHighlighted(problem), problem.solved)}
// //             />
// //           </div>

// //           {sessionType === 'problem' && (
// //             <div className="col-span-2">
// //               <div className="space-y-2">
// //                 <Input
// //                   placeholder="Problem link..."
// //                   value={problem.link || ''}
// //                   onChange={(e) => onUpdateProblem(problem.id, { link: e.target.value })}
// //                   className={`text-sm ${getHighlightClasses(isProblemHighlighted(problem), problem.solved)}`}
// //                 />
// //                 {problem.link && problem.link.trim() && (
// //                   <Button
// //                     variant="ghost"
// //                     size="sm"
// //                     onClick={() => handleLinkClick(problem.link!)}
// //                     className="w-fit text-xs h-6"
// //                   >
// //                     <ExternalLink className="h-3 w-3 mr-1" />
// //                     Open
// //                   </Button>
// //                 )}
// //               </div>
// //             </div>
// //           )}
          
// //           {/* Solved checkbox */}
// //           <div className="col-span-1 flex items-center justify-center pt-2">
// //             <Checkbox
// //               checked={problem.solved}
// //               onCheckedChange={(checked) => 
// //                 onUpdateProblem(problem.id, { solved: checked as boolean })
// //               }
// //             />
// //           </div>

// //           {/* Upsolved checkbox (only for contest) */}
// //           {sessionType === 'contest' && (
// //             <div className="col-span-1 flex items-center justify-center pt-2">
// //               <Checkbox
// //                 checked={problem.upsolved || false}
// //                 onCheckedChange={(checked) => 
// //                   onUpdateProblem(problem.id, { upsolved: checked as boolean })
// //                 }
// //               />
// //             </div>
// //           )}
          
// //           {/* Tag column */}
// //           <div className="col-span-2">
// //             {renderTagsInput(problem)}
// //           </div>
          
// //           {/* Review dropdown */}
// //           <div className="col-span-2">
// //             <Select 
// //               value={problem.review || ''} 
// //               onValueChange={(value) => onUpdateProblem(problem.id, { review: value as Problem['review'] })}
// //             >
// //               <SelectTrigger className={`text-sm ${getHighlightClasses(isProblemHighlighted(problem), problem.solved)}`}>
// //                 <SelectValue placeholder="Review..." />
// //               </SelectTrigger>
// //               <SelectContent className="bg-popover border border-border shadow-lg">
// //                 <SelectItem value="very good problem">Very good problem</SelectItem>
// //                 <SelectItem value="good idea">Good idea</SelectItem>
// //                 <SelectItem value="easy problem">Easy problem</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </div>
          
// //           {/* Notes */}
// //           <div className={sessionType === 'contest' ? 'col-span-3' : 'col-span-2'}>
// //             <Textarea
// //               placeholder="Notes, approach, complexity..."
// //               value={problem.notes}
// //               onChange={(e) => onUpdateProblem(problem.id, { notes: e.target.value })}
// //               className={`min-h-[80px] resize-none ${getHighlightClasses(isProblemHighlighted(problem), problem.solved)}`}
// //             />
// //           </div>
          
// //           {/* Actions */}
// //           <div className="col-span-1 flex items-center justify-center pt-2">
// //             <Button
// //               variant="ghost"
// //               size="icon"
// //               onClick={() => onDeleteProblem(problem.id)}
// //               className="h-6 w-6 text-muted-foreground hover:text-destructive"
// //             >
// //               <Trash2 className="h-3 w-3" />
// //             </Button>
// //           </div>
// //         </div>
// //       ))}
      
// //       <Button
// //         variant="outline"
// //         onClick={onAddProblem}
// //         className="w-full border-dashed hover:border-solid transition-all duration-200"
// //       >
// //         <Plus className="h-4 w-4 mr-2" />
// //         Add Problem
// //       </Button>
// //     </div>
// //   );
// // }

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Plus, Trash2 } from "lucide-react";
// import { Problem } from "@/types";

// interface ProblemTableProps {
//   problems: Problem[];
//   sessionType: 'contest' | 'problem';
//   onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
//   onAddProblem: () => void;
//   onDeleteProblem: (problemId: string) => void;
// }

// export function ProblemTable({ problems, sessionType, onUpdateProblem, onAddProblem, onDeleteProblem }: ProblemTableProps) {
//   const isProblemHighlighted = (problem: Problem) => {
//     if (sessionType === 'contest') {
//       // Highlight only if neither solved nor upsolved
//       return !problem.solved && !problem.upsolved;
//     }
//     // For problem session, highlight if not solved
//     return !problem.solved;
//   };

//   const isProblemSuccessful = (problem: Problem) => {
//     if (sessionType === 'contest') {
//       // Successful if either is checked
//       return problem.solved || problem.upsolved;
//     }
//     // Successful if solved
//     return problem.solved;
//   };

//   const getHighlightClasses = (isHighlighted: boolean) => {
//     if (isHighlighted) {
//       return 'bg-problem-highlight border-problem-highlight-border';
//     }
//     return '';
//   };

//   const renderTagsInput = (problem: Problem) => {
//     const tags = problem.tag ? problem.tag.split(',').map(t => t.trim()).filter(Boolean) : [];
    
//     return (
//       <div className="space-y-2">
//         <Input
//           placeholder="Add tags (comma-separated)..."
//           value={problem.tag}
//           onChange={(e) => onUpdateProblem(problem.id, { tag: e.target.value })}
//           className={`text-xs ${getHighlightClasses(isProblemHighlighted(problem))}`}
//         />
//         {tags.length > 0 && (
//           <div className="flex flex-wrap gap-1">
//             {tags.map((tag, index) => (
//               <span 
//                 key={index} 
//                 className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const getGridCols = () => {
//     return 'grid-cols-12'; // Use standard 12 column grid
//   };

//   const getContestHeaderCols = () => [
//     { name: "Problem Name", span: "col-span-2" },
//     { name: "Solved", span: "col-span-1" },
//     { name: "Upsolved", span: "col-span-1" },
//     { name: "Tag", span: "col-span-2" },
//     { name: "Review", span: "col-span-2" },
//     { name: "Notes", span: "col-span-3" },
//     { name: "", span: "col-span-1" }
//   ];

//   const getProblemHeaderCols = () => [
//     { name: "Problem Name", span: "col-span-3" },
//     { name: "Solved", span: "col-span-1" },
//     { name: "Tag", span: "col-span-2" },
//     { name: "Review", span: "col-span-2" },
//     { name: "Notes", span: "col-span-3" },
//     { name: "", span: "col-span-1" }
//   ];

//   return (
//     <div className="space-y-3">
//       <div className={`grid ${getGridCols()} gap-2 items-center text-sm font-medium text-muted-foreground px-3 py-2`}>
//         {(sessionType === 'contest' ? getContestHeaderCols() : getProblemHeaderCols()).map((col, index) => (
//           <div key={index} className={col.span}>{col.name}</div>
//         ))}
//       </div>
      
//       {problems.map((problem) => (
//         <div
//           key={problem.id}
//           className={`grid ${getGridCols()} gap-2 items-start p-3 rounded-lg border transition-all duration-200 ${
//             isProblemHighlighted(problem)
//               ? 'bg-problem-highlight border-problem-highlight-border' 
//               : isProblemSuccessful(problem)
//                 ? 'bg-success-light border-success/20' 
//                 : 'bg-card border-card-border hover:border-border'
//           }`}
//         >
//           {/* Problem Name */}
//           <div className={sessionType === 'contest' ? "col-span-2" : "col-span-3"}>
//             <Input
//               placeholder="Problem name..."
//               value={problem.name}
//               onChange={(e) => onUpdateProblem(problem.id, { name: e.target.value })}
//               className={getHighlightClasses(isProblemHighlighted(problem))}
//             />
//           </div>

//           {/* Solved checkbox */}
//           <div className="col-span-1 flex items-center justify-center pt-2">
//             <Checkbox
//               checked={problem.solved}
//               onCheckedChange={(checked) => 
//                 onUpdateProblem(problem.id, { solved: checked as boolean })
//               }
//             />
//           </div>

//           {/* Upsolved checkbox (only for contest) */}
//           {sessionType === 'contest' && (
//             <div className="col-span-1 flex items-center justify-center pt-2">
//               <Checkbox
//                 checked={problem.upsolved || false}
//                 onCheckedChange={(checked) => 
//                   onUpdateProblem(problem.id, { upsolved: checked as boolean })
//                 }
//               />
//             </div>
//           )}
          
//           {/* Tag column */}
//           <div className="col-span-2">
//             {renderTagsInput(problem)}
//           </div>
          
//           {/* Review dropdown */}
//           <div className="col-span-2">
//             <Select 
//               value={problem.review || ''} 
//               onValueChange={(value) => onUpdateProblem(problem.id, { review: value as Problem['review'] })}
//             >
//               <SelectTrigger className={`text-sm ${getHighlightClasses(isProblemHighlighted(problem))}`}>
//                 <SelectValue placeholder="Review..." />
//               </SelectTrigger>
//               <SelectContent className="bg-popover border border-border shadow-lg">
//                 <SelectItem value="very good problem">Very good problem</SelectItem>
//                 <SelectItem value="good idea">Good idea</SelectItem>
//                 <SelectItem value="easy problem">Easy problem</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
          
//           {/* Notes */}
//           <div className={sessionType === 'contest' ? 'col-span-3' : 'col-span-3'}>
//             <Textarea
//               placeholder="Notes, approach, complexity..."
//               value={problem.notes}
//               onChange={(e) => onUpdateProblem(problem.id, { notes: e.target.value })}
//               className={`min-h-[80px] resize-none ${getHighlightClasses(isProblemHighlighted(problem))}`}
//             />
//           </div>
          
//           {/* Actions */}
//           <div className="col-span-1 flex items-center justify-center pt-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => onDeleteProblem(problem.id)}
//               className="h-6 w-6 text-muted-foreground hover:text-destructive"
//             >
//               <Trash2 className="h-3 w-3" />
//             </Button>
//           </div>
//         </div>
//       ))}
      
//       <Button
//         variant="outline"
//         onClick={onAddProblem}
//         className="w-full border-dashed hover:border-solid transition-all duration-200"
//       >
//         <Plus className="h-4 w-4 mr-2" />
//         Add Problem
//       </Button>
//     </div>
//   );
// }



import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Problem } from "@/types";
import { ProblemRow } from "./ProblemRow"; // Import the new component

interface ProblemTableProps {
  problems: Problem[];
  sessionType: 'contest' | 'problem';
  onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
  onAddProblem: () => void;
  onDeleteProblem: (problemId: string) => void;
}

export function ProblemTable({ problems, sessionType, onUpdateProblem, onAddProblem, onDeleteProblem }: ProblemTableProps) {
  const isProblemHighlighted = (problem: Problem) => {
    if (sessionType === 'contest') {
      return !problem.solved && !problem.upsolved;
    }
    return !problem.solved;
  };

  const isProblemSuccessful = (problem: Problem) => {
    if (sessionType === 'contest') {
      return problem.solved || problem.upsolved;
    }
    return problem.solved;
  };

  const getHighlightClasses = (isHighlighted: boolean) => {
    return isHighlighted ? 'bg-problem-highlight border-problem-highlight-border' : '';
  };

  const gridLayout = sessionType === 'contest' 
    ? "grid-cols-[2.5fr_0.5fr_0.5fr_1.5fr_2fr_4fr_auto]" 
    : "grid-cols-[3fr_0.5fr_1.5fr_2fr_4.5fr_auto]";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className={`grid ${gridLayout} gap-4 items-center text-sm font-medium text-muted-foreground px-3`}>
        {sessionType === 'contest' ? (
          <>
            <div>Problem Name</div>
            <div className="text-center">Solved</div>
            <div className="text-center">Upsolved</div>
            <div>Tag</div>
            <div>Review</div>
            <div>Notes</div>
            <div></div>
          </>
        ) : (
          <>
            <div>Problem Name</div>
            <div className="text-center">Solved</div>
            <div>Tag</div>
            <div>Review</div>
            <div>Notes</div>
            <div></div>
          </>
        )}
      </div>
      
      {/* Problem Rows */}
      {problems.map((problem) => (
        <ProblemRow
          key={problem.id}
          problem={problem}
          sessionType={sessionType}
          onUpdateProblem={onUpdateProblem}
          onDeleteProblem={onDeleteProblem}
          isProblemHighlighted={isProblemHighlighted}
          isProblemSuccessful={isProblemSuccessful}
          getHighlightClasses={getHighlightClasses}
          gridLayout={gridLayout}
        />
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