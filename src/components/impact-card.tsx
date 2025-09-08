/**
 * Impact Card Component
 * 
 * Displays progress for each B Corp impact area.
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';
import { ImpactSummary } from '@/domain/data-contracts';
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
  
  return (
    <Card className={cn("impact-card", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl" role="img" aria-label={impact}>
            {impactIcons[impact]}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{impact}</h3>
            <p className="text-sm text-muted-foreground">
              {done} of {total} completed
            </p>
          </div>
        </div>
        <div className={cn("text-xl font-bold", impactColors[impact])}>
          {pct}%
        </div>
      </div>

      <div className="space-y-3">
        <Progress value={pct} className="h-2" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewTasks}
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          View tasks
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}