/**
 * Service Registry
 * 
 * Central registry for swapping between different service implementations.
 * Currently uses mock adapters, but can easily be switched to Supabase/AI implementations.
 */

import { IFileService } from './ports/files';
import { IAnalysisService } from './ports/analysis';
import { IBusinessService } from './ports/business';
import { IRiskService } from './ports/risk';
import { ILegalService } from './ports/legal';
import { IAuthService } from './ports/auth';
import { ITaskFileMappingService } from './ports/task-file-mapping';
import { IDocumentCategoryService } from './ports/document-categories';

// Import implementations
import * as MockAnalysis from './adapters/mock/analysis';
import * as MockBusiness from './adapters/mock/business';
import * as MockRisk from './adapters/mock/risk';
import * as MockLegal from './adapters/mock/legal';
import * as SupabaseAuth from './adapters/supabase/auth';
import * as SupabaseAnalysis from './adapters/supabase/analysis';
import * as SupabaseBusiness from './adapters/supabase/business';
import { supabaseFileService } from './adapters/supabase/files';
import { supabaseTaskFileMappingService } from './adapters/supabase/task-file-mapping';
import { supabaseDocumentCategoryService } from './adapters/supabase/document-categories';

/**
 * Service implementations registry
 * 
 * To swap to Supabase implementations later:
 * 1. Create adapters in /services/adapters/supabase/
 * 2. Import them here
 * 3. Replace the mock implementations
 * 4. The UI layer remains completely unchanged
 */
export const Services: {
  files: IFileService;
  analysis: IAnalysisService;
  business: IBusinessService;
  risk: IRiskService;
  legal: ILegalService;
  auth: IAuthService;
  taskFileMapping: ITaskFileMappingService;
  documentCategories: IDocumentCategoryService;
} = {
  files: supabaseFileService as IFileService,
  analysis: SupabaseAnalysis as IAnalysisService,
  business: SupabaseBusiness as IBusinessService,
  risk: MockRisk as IRiskService,
  legal: MockLegal as ILegalService,
  auth: SupabaseAuth as IAuthService,
  taskFileMapping: supabaseTaskFileMappingService as ITaskFileMappingService,
  documentCategories: supabaseDocumentCategoryService as IDocumentCategoryService,
};

// Future implementation example:
/*
import * as SupabaseFiles from './adapters/supabase/files';
import * as SupabaseAnalysis from './adapters/supabase/analysis';
import * as SupabaseBusiness from './adapters/supabase/business';
import * as SupabaseRisk from './adapters/supabase/risk';
import * as SupabaseLegal from './adapters/supabase/legal';
import * as SupabaseAuth from './adapters/supabase/auth';

export const Services = {
  files: SupabaseFiles as IFileService,
  analysis: SupabaseAnalysis as IAnalysisService,
  business: SupabaseBusiness as IBusinessService,
  risk: SupabaseRisk as IRiskService,
  legal: SupabaseLegal as ILegalService,
  auth: SupabaseAuth as IAuthService,
};
*/

// Convenience exports for direct service access
export const fileService = Services.files;
export const analysisService = Services.analysis;
export const businessService = Services.business;
export const riskService = Services.risk;
export const legalService = Services.legal;
export const authService = Services.auth;
export const taskFileMappingService = Services.taskFileMapping;
export const documentCategoryService = Services.documentCategories;