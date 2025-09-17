/**
 * Impact Card Component
 * 
 * Displays progress for each B Corp impact area.
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CompletedTasksModal } from '@/components/completed-tasks-modal';
import { ArrowRight } from 'lucide-react';
import { ImpactSummary } from '@/domain/data-contracts';
import { useAnalysisStore } from '@/store/analysis';
import { cn } from '@/lib/utils';

// Modal to show all tasks for an impact area
interface AllTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactArea: string;
}

function AllTasksModal({ isOpen, onClose, impactArea }: AllTasksModalProps) {
  const { todos } = useAnalysisStore();
  const areaTasks = todos.filter(todo => todo.impact === impactArea);
  
  return (
    <CompletedTasksModal
      isOpen={isOpen}
      onClose={onClose}
      completedTasks={areaTasks}
      impactArea={impactArea as any}
    />
  );
}

interface ImpactCardProps {
  summary: ImpactSummary;
  onViewTasks: () => void;
  className?: string;
}

// Icon mapping for impact areas
const impactIcons = {
  Governance: '🏛️',
  Workers: '👥', 
  Community: '🤝',
  Environment: '🌱',
  Customers: '💼'
};

// Color mapping for impact areas
const impactColors = {
  Governance: 'text-blue-600',
  Workers: 'text-purple-600', 
  Community: 'text-orange-600',
  Environment: 'text-green-600',
  Customers: 'text-indigo-600'
};

export function ImpactCard({ summary, onViewTasks, className }: ImpactCardProps) {
  const { impact, total, done, pct } = summary;
  const { todos } = useAnalysisStore();
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);
  
  const completedTasks = todos.filter(todo => 
    todo.impact === impact && todo.status === 'done'
  );
  
  return (
    <Card className={cn("impact-card w-full h-full p-2 sm:p-3 flex flex-col", className)}>
      {/* Header with icon, title and percentage */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
          <div className="text-base sm:text-lg flex-shrink-0" role="img" aria-label={impact}>
            {impactIcons[impact]}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate text-xs sm:text-sm leading-tight">{impact}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {done} of {total} Recommended
            </p>
          </div>
        </div>
        <div className={cn("font-bold flex-shrink-0 ml-1 text-sm sm:text-lg", impactColors[impact])}>
          {pct}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2 sm:mb-3">
        <Progress value={pct} className="h-1.5 sm:h-2" />
      </div>
      
      {/* Bottom section with button */}
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAllTasksModal(true)}
          className="w-full justify-between text-muted-foreground hover:text-foreground text-[10px] sm:text-xs py-1.5 sm:py-2 h-auto"
        >
          View tasks
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
        
      <AllTasksModal
        isOpen={showAllTasksModal}
        onClose={() => setShowAllTasksModal(false)}
        impactArea={impact}
      />
    </Card>
  );
}