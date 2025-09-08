/**
 * Mock File Service Implementation
 * 
 * In-memory implementation for development and testing.
 * Will be replaced with Supabase adapter later.
 */

import { DataFile, FileKind, OcrStatus, ImpactArea } from '@/domain/data-contracts';
import { IFileService } from '@/services/ports/files';

// In-memory storage
let mockFiles: DataFile[] = [
  {
    id: '1',
    dataroomId: 'room-1',
    kind: 'articles_of_association',
    originalName: 'Articles of Association.pdf',
    storagePath: '/mock/articles.pdf',
    contentType: 'application/pdf',
    uploadedAt: '2024-01-15T10:30:00Z',
    ocrStatus: 'done',
    size: 245760,
    impactArea: 'Governance'
  },
  {
    id: '2',
    dataroomId: 'room-1', 
    kind: 'employee_handbook',
    originalName: 'Employee Handbook v2.docx',
    storagePath: '/mock/handbook.docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: '2024-01-20T14:22:00Z',
    ocrStatus: 'done',
    size: 156420,
    impactArea: 'Workers'
  },
  {
    id: '3',
    dataroomId: 'room-1',
    kind: 'env_policy',
    originalName: 'Environmental Policy Draft.txt',
    storagePath: '/mock/env-policy.txt', 
    contentType: 'text/plain',
    uploadedAt: '2024-01-25T09:15:00Z',
    ocrStatus: 'done',
    size: 8920,
    impactArea: 'Environment'
  }
];

let nextId = mockFiles.length + 1;

export const list = async (businessId: string): Promise<DataFile[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockFiles.filter(f => f.dataroomId === `room-${businessId.split('-')[1] || '1'}`);
};

export const upload = async (businessId: string, file: File, impactArea?: ImpactArea): Promise<DataFile> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newFile: DataFile = {
    id: String(nextId++),
    dataroomId: `room-${businessId.split('-')[1] || '1'}`,
    kind: inferFileKind(file.name),
    originalName: file.name,
    storagePath: `/mock/${file.name}`,
    contentType: file.type,
    uploadedAt: new Date().toISOString(),
    ocrStatus: 'pending' as OcrStatus,
    size: file.size,
    impactArea,
    linkedTodoId: undefined
  };

  mockFiles.push(newFile);

  // Simulate OCR processing
  setTimeout(() => {
    const fileIndex = mockFiles.findIndex(f => f.id === newFile.id);
    if (fileIndex >= 0) {
      mockFiles[fileIndex].ocrStatus = 'done';
    }
  }, 2000);

  return newFile;
};

export const createVirtual = async (
  businessId: string,
  name: string,
  text: string,
  kind: FileKind = 'other'
): Promise<DataFile> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newFile: DataFile = {
    id: String(nextId++),
    dataroomId: `room-${businessId.split('-')[1] || '1'}`,
    kind,
    originalName: name,
    storagePath: `/mock/virtual/${name}`,
    contentType: 'text/plain',
    uploadedAt: new Date().toISOString(),
    ocrStatus: 'done',
    size: text.length
  };

  mockFiles.push(newFile);
  return newFile;
};

export const remove = async (fileId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockFiles = mockFiles.filter(f => f.id !== fileId);
};

export const updateMetadata = async (
  fileId: string,
  updates: Partial<Pick<DataFile, 'kind' | 'originalName'>>
): Promise<DataFile> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const fileIndex = mockFiles.findIndex(f => f.id === fileId);
  if (fileIndex === -1) {
    throw new Error('File not found');
  }

  mockFiles[fileIndex] = { ...mockFiles[fileIndex], ...updates };
  return mockFiles[fileIndex];
};

export const getContent = async (fileId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const file = mockFiles.find(f => f.id === fileId);
  if (!file) {
    throw new Error('File not found');
  }

  // Return mock content based on file type
  switch (file.kind) {
    case 'articles_of_association':
      return `ARTICLES OF ASSOCIATION

1. Company Name and Purpose
The company shall be called "${file.originalName.replace('.pdf', '').replace('Articles of Association', 'TechCorp Ltd')}"

2. Objects and Powers
The objects for which the Company is established are to carry on business as a technology company...

[This is mock content for demonstration purposes]`;

    case 'employee_handbook':
      return `EMPLOYEE HANDBOOK

Welcome to our company! This handbook outlines our policies and procedures.

1. Equal Opportunities
We are committed to providing equal opportunities for all employees...

2. Health and Safety
We prioritize the health and safety of all our team members...

[This is mock content for demonstration purposes]`;

    case 'env_policy':
      return `ENVIRONMENTAL POLICY

Our commitment to environmental sustainability:

1. Reduce waste and energy consumption
2. Promote recycling and sustainable practices  
3. Monitor and report environmental impact

[This is mock content for demonstration purposes]`;

    default:
      return `Mock content for ${file.originalName}\n\nThis is placeholder content that would normally be extracted from the actual file through OCR or direct text extraction.`;
  }
};

// Helper function to infer file kind from filename
function inferFileKind(filename: string): FileKind {
  const lower = filename.toLowerCase();
  
  if (lower.includes('article') || lower.includes('memorandum')) return 'articles_of_association';
  if (lower.includes('certificate') || lower.includes('incorporation')) return 'certificate_of_incorp';
  if (lower.includes('handbook') || lower.includes('employee')) return 'employee_handbook';
  if (lower.includes('hr') || lower.includes('human')) return 'hr_policy';
  if (lower.includes('diversity') || lower.includes('inclusion')) return 'di_policy';
  if (lower.includes('environment') || lower.includes('env')) return 'env_policy';
  if (lower.includes('supplier') || lower.includes('code')) return 'supplier_code';
  if (lower.includes('privacy') || lower.includes('data')) return 'privacy_policy';
  if (lower.includes('impact') || lower.includes('report')) return 'impact_report';
  if (lower.includes('business') && lower.includes('plan')) return 'business_plan';
  
  return 'other';
}

export const mockFileService = {
  list,
  upload,
  createVirtual,
  remove,
  updateMetadata,
  getContent
};