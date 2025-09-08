/**
 * Mock Legal Requirements Service Implementation
 * 
 * Handles UK B-Corp legal requirements and mission lock process.
 */

import { LegalStatus, LegalStep } from '@/domain/data-contracts';
import { ILegalService } from '@/services/ports/legal';

// In-memory storage
let mockLegalStatus: { [businessId: string]: LegalStatus } = {
  '1': {
    businessId: '1',
    hasMissionLock: false,
    resolutionPassedAt: undefined,
    filedAtCompaniesHouse: undefined,
    cc04Filed: false,
    notes: 'Initial assessment complete. Ready to begin mission lock process.',
    updatedAt: '2024-01-01T00:00:00Z'
  }
};

let mockStepStatus: { [businessId: string]: { [stepId: string]: boolean } } = {
  '1': {
    'step-1': true,  // Articles review completed
    'step-2': false,
    'step-3': false, 
    'step-4': false,
    'step-5': false
  }
};

const legalSteps: Omit<LegalStep, 'completed'>[] = [
  {
    id: 'step-1',
    title: 'Review Current Articles of Association',
    description: 'Review your existing Articles to identify what changes are needed for B Corp mission lock language.',
    required: true
  },
  {
    id: 'step-2', 
    title: 'Adopt B Lab Mission Lock Clause',
    description: 'Incorporate the required B Lab language into your Articles of Association to create the mission lock.',
    required: true
  },
  {
    id: 'step-3',
    title: 'Pass Special Resolution (75% Vote)',
    description: 'Hold a board/shareholder meeting to pass the special resolution adopting the new Articles.',
    required: true
  },
  {
    id: 'step-4',
    title: 'File Changes with Companies House',
    description: 'Submit form CC04 to Companies House to formally register the amended Articles of Association.',
    required: true
  },
  {
    id: 'step-5',
    title: 'Confirm and Store Documentation',
    description: 'Ensure all documentation is properly stored and provide copies for B Corp certification review.',
    required: true
  }
];

export const getStatus = async (businessId: string): Promise<LegalStatus> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockLegalStatus[businessId] || {
    businessId,
    hasMissionLock: false,
    updatedAt: new Date().toISOString()
  };
};

export const setStatus = async (businessId: string, patch: Partial<LegalStatus>): Promise<LegalStatus> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const current = mockLegalStatus[businessId] || { 
    businessId, 
    hasMissionLock: false,
    updatedAt: new Date().toISOString()
  };
  
  const updated = {
    ...current,
    ...patch,
    businessId, // Ensure businessId doesn't get overridden
    updatedAt: new Date().toISOString()
  };
  
  mockLegalStatus[businessId] = updated;
  return updated;
};

export const getSteps = async (businessId: string): Promise<LegalStep[]> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const stepStatus = mockStepStatus[businessId] || {};
  
  return legalSteps.map(step => ({
    ...step,
    completed: stepStatus[step.id] || false
  }));
};

export const completeStep = async (businessId: string, stepId: string, attachments?: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  if (!mockStepStatus[businessId]) {
    mockStepStatus[businessId] = {};
  }
  
  mockStepStatus[businessId][stepId] = true;
  
  // Update legal status if all required steps are complete
  const allSteps = await getSteps(businessId);
  const allCompleted = allSteps.filter(s => s.required).every(s => s.completed || s.id === stepId);
  
  if (allCompleted) {
    await setStatus(businessId, {
      hasMissionLock: true,
      filedAtCompaniesHouse: new Date().toISOString()
    });
  }
};

export const getTemplates = async (): Promise<{
  id: string;
  name: string;
  description: string;
  templateUrl?: string;
  content?: string;
}[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'mission-lock-clause',
      name: 'B Corp Mission Lock Clause',
      description: 'Standard B Lab approved language for UK Articles of Association',
      content: `MISSION LOCK PROVISIONS

The following provisions shall be included in the Articles of Association:

1. BENEFIT PURPOSE
The Company is formed to create general public benefit, which is defined as material positive impact on society and the environment, taken as a whole, from the business and operations of the Company.

2. ACCOUNTABILITY
The Directors shall manage the Company in a manner that balances the pecuniary interests of shareholders with the best interests of persons that are materially affected by the Company's conduct (the "Stakeholders"), including employees, customers, community and local environment.

3. TRANSPARENCY  
The Company shall publish an annual benefit report that includes:
a) A narrative description of the ways the Company pursued general public benefit during the year
b) An assessment of the Company's overall social and environmental performance against a third-party standard

[This is template language for demonstration purposes - consult legal counsel for actual implementation]`
    },
    {
      id: 'special-resolution-template',
      name: 'Special Resolution Template', 
      description: 'Template resolution for adopting mission lock provisions',
      content: `SPECIAL RESOLUTION

RESOLVED THAT:

1. The Articles of Association of the Company be amended by the adoption of the new Articles of Association in the form produced to this meeting and initialled by the Chairman for the purposes of identification.

2. Any Director be and is hereby authorised to do all such acts and things as may be necessary to give effect to this resolution including filing the necessary forms with the Registrar of Companies.

[This is template language for demonstration purposes - consult legal counsel for actual implementation]`
    },
    {
      id: 'cc04-guidance',
      name: 'Companies House CC04 Filing Guidance',
      description: 'Step-by-step guidance for filing amended Articles',
      content: `FILING AMENDED ARTICLES OF ASSOCIATION

Form CC04 Requirements:

1. Complete form CC04 "Application to change company's articles"
2. Attach the new Articles of Association (signed copy)
3. Pay the filing fee (currently £15 online, £40 by post)
4. Include covering letter explaining the nature of changes

Required Information:
- Company number
- Company name  
- Date of resolution
- Type of resolution (Special Resolution - 75% required)

Processing Time: Usually 8-15 working days

Note: This is guidance only. For official requirements, consult Companies House directly or seek legal advice.`
    }
  ];
};