/**
 * Impact Area Selector Component
 * 
 * Dropdown selector for changing task impact areas with lock/unlock functionality
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';

interface ImpactAreaSelectorProps {
  currentImpact: ImpactArea;
  taskId: string;
  onImpactChange: (newImpact: ImpactArea) => void;
  isLocked: boolean;
  onToggleLock: () => void;
}

const impactAreas: ImpactArea[] = ['Governance', 'Workers', 'Community', 'Environment', 'Customers'];

const impactAreaColors: Record<ImpactArea, string> = {
  'Governance': 'bg-blue-50 text-blue-700 border-blue-200',
  'Workers': 'bg-green-50 text-green-700 border-green-200',
  'Community': 'bg-purple-50 text-purple-700 border-purple-200',
  'Environment': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Customers': 'bg-orange-50 text-orange-700 border-orange-200',
  'Other': 'bg-gray-50 text-gray-700 border-gray-200'
};

export function ImpactAreaSelector({
  currentImpact,
  taskId,
  onImpactChange,
  isLocked,
  onToggleLock
}: ImpactAreaSelectorProps) {
  if (isLocked) {
    return (
      <div className="flex items-center gap-2">
        <Badge className={impactAreaColors[currentImpact]}>
          {currentImpact}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLock}
          className="h-6 w-6 p-0"
          title="Unlock to change impact area"
        >
          <Lock className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentImpact}
        onValueChange={(value) => onImpactChange(value as ImpactArea)}
      >
        <SelectTrigger className="w-auto h-6 px-2 text-xs font-medium border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {impactAreas.map((area) => (
            <SelectItem key={area} value={area} className="text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  area === 'Governance' ? 'bg-blue-500' :
                  area === 'Workers' ? 'bg-green-500' :
                  area === 'Community' ? 'bg-purple-500' :
                  area === 'Environment' ? 'bg-emerald-500' :
                  'bg-orange-500'
                }`} />
                {area}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleLock}
        className="h-6 w-6 p-0"
        title="Lock to prevent changes"
      >
        <Unlock className="h-3 w-3" />
      </Button>
    </div>
  );
}