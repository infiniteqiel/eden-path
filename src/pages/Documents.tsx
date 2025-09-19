/**
 * Documents Page
 * 
 * Manage business documents and data room.
 */

import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { AppSidebar } from '@/components/app-sidebar';
import { EnhancedUploadDropzone } from '@/components/enhanced-upload-dropzone';
import { DraggableFile } from '@/components/draggable-file';
import { DroppableDocumentCategory } from '@/components/droppable-document-category';
import { AddCategoryModal } from '@/components/add-category-modal';
import { FileCard } from '@/components/file-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useDataroomStore } from '@/store/dataroom';
import { useDocumentCategoryStore } from '@/store/document-categories';
import { FileText, Upload, Folder, Building, Users, Heart, Leaf, Star, Plus, Trash2, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImpactArea, DataFile } from '@/domain/data-contracts';
import { fileService } from '@/services/registry';
import { toast } from 'sonner';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Documents = () => {
  const { currentBusiness } = useBusinessStore();
  const { files, binnedFiles, loadFiles, loadBinnedFiles, removeFile, restoreFile } = useDataroomStore();
  const { categories, loadCategories } = useDocumentCategoryStore();
  const [activeFile, setActiveFile] = useState<DataFile | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      loadFiles(currentBusiness.id);
      loadBinnedFiles(currentBusiness.id);
      loadCategories(currentBusiness.id);
    }
  }, [currentBusiness, loadFiles, loadBinnedFiles, loadCategories]);

  const handleUploadComplete = () => {
    if (currentBusiness) {
      loadFiles(currentBusiness.id);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'file') {
      setActiveFile(active.data.current.file);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveFile(null);

    if (!over || !currentBusiness) return;

    const fileId = active.id as string;
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      if (over.data.current?.type === 'category') {
        const categoryId = over.id as string;
        await fileService.updateFileCategory(fileId, categoryId);
        await loadFiles(currentBusiness.id);
        toast.success('File categorized successfully');
      }
    } catch (error) {
      toast.error('Failed to categorize file');
      console.error('Error categorizing file:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await removeFile(fileId);
      if (currentBusiness) {
        await loadBinnedFiles(currentBusiness.id);
      }
      toast.success('File moved to bin');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleRestoreFile = async (fileId: string) => {
    try {
      await restoreFile(fileId);
      if (currentBusiness) {
        await loadFiles(currentBusiness.id);
      }
      toast.success('File restored');
    } catch (error) {
      toast.error('Failed to restore file');
    }
  };

  // Get files by category
  const getFilesByCategory = (categoryId: string) => {
    return files.filter(file => file.categoryId === categoryId);
  };

  // Get uncategorized files (All Documents)
  const uncategorizedFiles = files.filter(file => !file.categoryId);

  // Group files by impact area for reference
  const filesByImpactArea = files.reduce((acc, file) => {
    const area = file.impactArea || 'Other';
    if (!acc[area]) acc[area] = [];
    acc[area].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  const impactAreas: Array<{ 
    name: ImpactArea | 'Other'; 
    icon: any; 
    color: string;
    description: string;
  }> = [
    { name: 'Governance', icon: Building, color: 'blue', description: 'Corporate governance and mission' },
    { name: 'Workers', icon: Users, color: 'green', description: 'Employee policies and benefits' },
    { name: 'Community', icon: Heart, color: 'purple', description: 'Community impact and engagement' },
    { name: 'Environment', icon: Leaf, color: 'emerald', description: 'Environmental policies and metrics' },
    { name: 'Customers', icon: Star, color: 'orange', description: 'Customer impact and satisfaction' },
    { name: 'Other', icon: Folder, color: 'gray', description: 'Uncategorized documents' }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <header 
            className="h-16 flex items-center border-b px-4 relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <SidebarTrigger />
            <h1 className="ml-4 font-bold text-lg">Documents - Data Room</h1>
          </header>
          
          <main 
            className="flex-1 overflow-auto relative"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                  {/* Upload Section */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
                      <p className="text-muted-foreground">
                        Upload your business documents for AI analysis and B Corp readiness assessment
                      </p>
                    </div>
                    <EnhancedUploadDropzone 
                      businessId={currentBusiness?.id || ''} 
                      onUploadComplete={handleUploadComplete} 
                    />
                  </section>

                  {/* Document Categories */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Document Categories</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAddCategory(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Category
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categories.map((category) => {
                        const categoryFiles = getFilesByCategory(category.id);
                        return (
                          <DroppableDocumentCategory
                            key={category.id}
                            category={category}
                            files={categoryFiles}
                            className="bg-white/60"
                          />
                        );
                      })}
                      
                      {/* File Bin Category */}
                      <Card className="bg-white/60">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            File Bin
                          </CardTitle>
                          <CardDescription>
                            Deleted files (can be restored)
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground mb-3">
                            {binnedFiles.length} files
                          </div>
                          
                          {binnedFiles.length > 0 ? (
                            <ScrollArea className="h-32">
                              <div className="space-y-2 pr-2">
                                {binnedFiles.slice(0, 3).map((file) => (
                                  <div key={file.id} className="flex items-center gap-2 p-2 rounded border bg-white/40">
                                    <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="text-xs truncate flex-1">{file.originalName}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRestoreFile(file.id)}
                                      className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                                    >
                                      <RotateCcw className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                {binnedFiles.length > 3 && (
                                  <div className="text-xs text-muted-foreground text-center py-1">
                                    +{binnedFiles.length - 3} more files
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          ) : (
                            <div className="text-center py-4 text-xs text-muted-foreground">
                              No files in bin
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  {/* Documents by Impact Area */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-6">Documents by Impact Area</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {impactAreas.map((area) => {
                        const areaFiles = filesByImpactArea[area.name] || [];
                        const Icon = area.icon;
                        
                        return (
                          <Card key={area.name} className="bg-white/60">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base">
                                <Icon className={`h-5 w-5 text-${area.color}-600`} />
                                {area.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {area.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm text-muted-foreground mb-3">
                                {areaFiles.length} files
                              </div>
                              
                              {areaFiles.length > 0 ? (
                                <ScrollArea className="h-32">
                                  <div className="space-y-2 pr-2">
                                    {areaFiles.map((file) => (
                                      <div key={file.id} className="flex items-center gap-2 p-2 rounded border bg-white/40">
                                        <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <span className="text-xs truncate flex-1">{file.originalName}</span>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              ) : (
                                <div className="text-center py-4 text-xs text-muted-foreground">
                                  No files uploaded
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </section>

                  {/* File Management Section */}
                  <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-6">File Management</h3>
                    
                    {/* All Documents */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-4">All Documents</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag files to categories above to organize them
                      </p>
                      
                      {uncategorizedFiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {uncategorizedFiles.map((file) => (
                            <DraggableFile
                              key={file.id}
                              file={file}
                              onDelete={handleDeleteFile}
                              className="bg-white/60 rounded-lg"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No uncategorized documents</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            All files have been organized into categories
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
              
              <DragOverlay>
                {activeFile && (
                  <div className="bg-white/90 border-2 border-primary/50 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{activeFile.originalName}</span>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </main>
        </div>
      </div>
      
      <AddCategoryModal
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
        businessId={currentBusiness?.id || ''}
      />
    </SidebarProvider>
  );
};

export default Documents;