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
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  
  const completedTasks = todos.filter(todo => 
    todo.impact === impact && todo.status === 'done'
  );
  
  return (
    <Card className={cn("impact-card w-full h-full min-h-[140px] p-3 sm:p-4", className)}>
      <div className="flex items-start justify-between mb-2 sm:mb-4 h-full">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="text-lg sm:text-xl md:text-2xl flex-shrink-0" role="img" aria-label={impact}>
            {impactIcons[impact]}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg truncate leading-tight">{impact}</h3>
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
              {done} completed
            </p>
          </div>
        </div>
        <div className={cn("text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold flex-shrink-0 ml-1", impactColors[impact])}>
          {pct}%
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col justify-end">
        <Progress value={pct} className="h-1.5 sm:h-2" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowCompletedModal(true)}
          className="w-full justify-between text-muted-foreground hover:text-foreground text-xs sm:text-sm py-1 sm:py-2"
        >
          View tasks
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        
        <CompletedTasksModal
          isOpen={showCompletedModal}
          onClose={() => setShowCompletedModal(false)}
          completedTasks={completedTasks}
          impactArea={impact}
        />
      </div>
    </Card>
  );
}