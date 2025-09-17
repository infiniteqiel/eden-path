/**
 * Workers Impact Area Page
 * 
 * Detailed view for Workers impact area progress and tasks.
 */

import React from 'react';
import { ImpactAreaTemplate } from '@/components/impact-area-template';
import { Users, Heart, DollarSign, GraduationCap } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';

const Workers = () => {
  const config = {
    impactArea: 'Workers' as ImpactArea,
    title: 'Workers - Employee Impact',
    description: 'The Workers impact area evaluates how your company treats its employees, including compensation, benefits, training, ownership opportunities, and overall workplace environment.',
    mainIcon: Users,
    iconMap: {
      'compensation': DollarSign,
      'well': Heart,
      'career': GraduationCap,
    },
    defaultIcon: Users,
    resources: [
      {
        title: 'Living Wage Calculator',
        description: 'Ensure your compensation meets living wage standards',
        buttonText: 'Calculate',
      },
      {
        title: 'Employee Handbook Template',
        description: 'Download comprehensive HR policy templates',
        buttonText: 'Download',
      },
      {
        title: 'Engagement Surveys',
        description: 'Tools to measure and improve employee satisfaction',
        buttonText: 'Explore',
      },
    ],
  };

  return <ImpactAreaTemplate config={config} />;
};

export default Workers;