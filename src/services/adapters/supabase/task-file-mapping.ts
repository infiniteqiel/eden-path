/**
 * Supabase Task File Mapping Service
 * 
 * Manages task-file relationships using Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { ITaskFileMappingService, TaskFileMapping } from '@/services/ports/task-file-mapping';

export class SupabaseTaskFileMappingService implements ITaskFileMappingService {
  async mapFilesToTask(taskId: string, fileIds: string[]): Promise<TaskFileMapping[]> {
    const mappings = fileIds.map(fileId => ({
      task_id: taskId,
      file_id: fileId,
      mapped_by: (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id;
      })()
    }));

    // Resolve the mapped_by promises
    const resolvedMappings = await Promise.all(
      mappings.map(async (mapping) => ({
        task_id: mapping.task_id,
        file_id: mapping.file_id,
        mapped_by: await mapping.mapped_by
      }))
    );

    const { data, error } = await supabase
      .from('task_file_mappings')
      .upsert(resolvedMappings)
      .select('*');

    if (error) {
      throw new Error(`Failed to map files to task: ${error.message}`);
    }

    return data.map(this.mapDbToTaskFileMapping);
  }

  async unmapFilesFromTask(taskId: string, fileIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('task_file_mappings')
      .delete()
      .eq('task_id', taskId)
      .in('file_id', fileIds);

    if (error) {
      throw new Error(`Failed to unmap files from task: ${error.message}`);
    }
  }

  async getTaskFiles(taskId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('task_file_mappings')
      .select('file_id')
      .eq('task_id', taskId);

    if (error) {
      throw new Error(`Failed to get task files: ${error.message}`);
    }

    return data.map(row => row.file_id);
  }

  async getFileTasks(fileId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('task_file_mappings')
      .select('task_id')
      .eq('file_id', fileId);

    if (error) {
      throw new Error(`Failed to get file tasks: ${error.message}`);
    }

    return data.map(row => row.task_id);
  }

  async getTaskMappings(taskId: string): Promise<TaskFileMapping[]> {
    const { data, error } = await supabase
      .from('task_file_mappings')
      .select('*')
      .eq('task_id', taskId);

    if (error) {
      throw new Error(`Failed to get task mappings: ${error.message}`);
    }

    return data.map(this.mapDbToTaskFileMapping);
  }

  async isFileMappedToTask(taskId: string, fileId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('task_file_mappings')
      .select('id')
      .eq('task_id', taskId)
      .eq('file_id', fileId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to check file mapping: ${error.message}`);
    }

    return !!data;
  }

  async getFilesMappedToTasks(taskIds: string[]): Promise<Record<string, string[]>> {
    const { data, error } = await supabase
      .from('task_file_mappings')
      .select('task_id, file_id')
      .in('task_id', taskIds);

    if (error) {
      throw new Error(`Failed to get files mapped to tasks: ${error.message}`);
    }

    const result: Record<string, string[]> = {};
    
    for (const taskId of taskIds) {
      result[taskId] = [];
    }

    for (const row of data) {
      if (!result[row.task_id]) {
        result[row.task_id] = [];
      }
      result[row.task_id].push(row.file_id);
    }

    return result;
  }

  private mapDbToTaskFileMapping(row: any): TaskFileMapping {
    return {
      id: row.id,
      taskId: row.task_id,
      fileId: row.file_id,
      mappedBy: row.mapped_by,
      mappedAt: row.mapped_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const supabaseTaskFileMappingService = new SupabaseTaskFileMappingService();