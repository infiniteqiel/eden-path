/**
 * Environment Impact Area Page
 * 
 * Detailed view for Environment impact area progress and tasks.
 */

import React from 'react';
import { ImpactAreaTemplate } from '@/components/impact-area-template';
import { Leaf, Zap, Recycle, Droplets } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';

const Environment = () => {
  const config = {
    impactArea: 'Environment' as ImpactArea,
    title: 'Environment - Sustainability',
    description: 'The Environment impact area evaluates your company\'s environmental performance, including energy use, emissions, waste, water consumption, and overall environmental management.',
    mainIcon: Leaf,
    iconMap: {
      'energy': Zap,
      'waste': Recycle,
      'water': Droplets,
    },
    defaultIcon: Leaf,
    resources: [
      {
        title: 'Carbon Calculator',
        description: 'Calculate your company\'s carbon footprint',
        buttonText: 'Calculate',
      },
      {
        title: 'Sustainability Plan Template',
        description: 'Download environmental management templates',
        buttonText: 'Download',
      },
      {
        title: 'Green Certifications',
        description: 'Explore environmental certifications and standards',
        buttonText: 'Explore',
      },
    ],
  };

  return <ImpactAreaTemplate config={config} />;
};

export default Environment;