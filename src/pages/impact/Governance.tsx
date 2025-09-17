/**
 * Governance Impact Area Page
 * 
 * Detailed view for Governance impact area progress and tasks.
 */

import React from 'react';
import { ImpactAreaTemplate } from '@/components/impact-area-template';
import { Building2, Users, Scale, FileText } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';

const Governance = () => {
  const config = {
    impactArea: 'Governance' as ImpactArea,
    title: 'Governance - Mission & Leadership',
    description: 'Governance measures how your company manages its overall mission, stakeholder engagement, and transparency. This includes your legal structure, board composition, and commitment to your mission.',
    mainIcon: Building2,
    iconMap: {
      'mission': Building2,
      'board': Users,
      'legal': Scale,
    },
    defaultIcon: FileText,
    resources: [
      {
        title: 'B Corp Legal Requirement',
        description: 'Learn about the legal changes needed for B Corp certification',
        buttonText: 'View Guide',
      },
      {
        title: 'Mission Lock Templates',
        description: 'Download templates for Articles of Association updates',
        buttonText: 'Download',
      },
      {
        title: 'Best Practices',
        description: 'Examples from successful B Corp governance structures',
        buttonText: 'Learn More',
      },
    ],
  };

  return <ImpactAreaTemplate config={config} />;
};

export default Governance;