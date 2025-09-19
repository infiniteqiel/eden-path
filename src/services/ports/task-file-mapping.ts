/**
 * Task File Mapping Service Port
 * 
 * Interface for managing task-file relationships
 */

export interface TaskFileMapping {
  id: string;
  taskId: string;
  fileId: string;
  mappedBy: string;
  mappedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITaskFileMappingService {
  /**
   * Map files to a task
   */
  mapFilesToTask(taskId: string, fileIds: string[]): Promise<TaskFileMapping[]>;

  /**
   * Unmap files from a task
   */
  unmapFilesFromTask(taskId: string, fileIds: string[]): Promise<void>;

  /**
   * Get all files mapped to a task
   */
  getTaskFiles(taskId: string): Promise<string[]>;

  /**
   * Get all tasks that a file is mapped to
   */
  getFileTasks(fileId: string): Promise<string[]>;

  /**
   * Get all mappings for a task
   */
  getTaskMappings(taskId: string): Promise<TaskFileMapping[]>;

  /**
   * Check if a file is mapped to a task
   */
  isFileMappedToTask(taskId: string, fileId: string): Promise<boolean>;

  /**
   * Get files mapped to multiple tasks
   */
  getFilesMappedToTasks(taskIds: string[]): Promise<Record<string, string[]>>;
}