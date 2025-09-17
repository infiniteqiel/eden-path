/**
 * Shared Impact Area Template
 * 
 * Consistent template for all impact areas with standardized layout,
 * drag-and-drop, default sub-areas, and "Grow a Task" buttons.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { AppSidebar } from '@/components/app-sidebar';
import { TodoItem } from '@/components/todo-item';
import { ImpactCard } from '@/components/impact-card';
import { ImpactFilesSection } from '@/components/impact-files-section';
import { EnhancedAIChatModal } from '@/components/enhanced-ai-chat-modal';
import { DroppableSubArea } from '@/components/droppable-sub-area';
import { DroppableUnassignedArea } from '@/components/droppable-unassigned-area';
import { DraggableTask } from '@/components/draggable-task';
import { AddSubAreaModal } from '@/components/add-sub-area-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { useSubAreasStore } from '@/store/sub-areas';
import { Todo, ImpactArea } from '@/domain/data-contracts';
import { CheckSquare2, MessageSquare, Home, Plus, LucideIcon } from 'lucide-react';
import { ExpandableTaskModal } from '@/components/expandable-task-modal';
import { useToast } from '@/hooks/use-toast';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

interface ImpactAreaConfig {
  impactArea: ImpactArea;
  title: string;
  description: string;
  mainIcon: LucideIcon;
  iconMap: Record<string, LucideIcon>;
  defaultIcon: LucideIcon;
  resources: {
    title: string;
    description: string;
    buttonText: string;
  }[];
}

interface ImpactAreaTemplateProps {
  config: ImpactAreaConfig;
}

export function ImpactAreaTemplate({ config }: ImpactAreaTemplateProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus, assignTaskToSubArea } = useAnalysisStore();
  const { subAreas, loadSubAreasByImpact, ensureDefaults, createSubArea } = useSubAreasStore();
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatContext, setChatContext] = useState<{level: 'overview' | 'subarea' | 'task', subArea?: string, taskTitle?: string}>({level: 'overview'});
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
      ensureDefaults(currentBusiness.id);
      loadSubAreasByImpact(currentBusiness.id, config.impactArea);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos, ensureDefaults, loadSubAreasByImpact, config.impactArea]);

  const impactSummary = impactSummaries.find(s => s.impact === config.impactArea);
  const impactTodos = todos.filter(t => t.impact === config.impactArea);
  const completedTodos = impactTodos.filter(t => t.status === 'done');

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;

    try {
      // Handle task being dropped on a sub-area
      if (over.data?.current?.type === 'subArea') {
        const subAreaId = over.id as string;
        await assignTaskToSubArea(taskId, subAreaId);
        toast({
          title: "Task assigned",
          description: "Task has been assigned to the selected area.",
        });
      }
      // Handle task being dropped on unassigned area
      else if (over.data?.current?.type === 'unassigned') {
        await assignTaskToSubArea(taskId, null);
        toast({
          title: "Task unassigned",
          description: "Task has been moved to unassigned tasks.",
        });
      }
      
      if (currentBusiness) {
        loadTodos(currentBusiness.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task assignment.",
        variant: "destructive",
      });
    }
  };

  const handleOrganiseTasks = async () => {
    if (!currentBusiness || unassignedTasks.length === 0) return;

    try {
      let assignedCount = 0;
      
      // Auto-map tasks to sub-areas based on keyword matching
      for (const task of unassignedTasks) {
        const taskText = `${task.title} ${task.descriptionMd || ''}`.toLowerCase();
        
        // Find best matching sub-area
        let bestMatch = null;
        let bestScore = 0;
        
        for (const subArea of subAreas.filter(sa => sa.impactArea === config.impactArea)) {
          const areaText = `${subArea.title} ${subArea.description || ''}`.toLowerCase();
          
          // Simple keyword matching score
          let score = 0;
          const areaWords = areaText.split(' ').filter(w => w.length > 3);
          
          for (const word of areaWords) {
            if (taskText.includes(word)) {
              score += 1;
            }
          }
          
          if (score > bestScore) {
            bestScore = score;
            bestMatch = subArea;
          }
        }
        
        // Assign if we found a decent match
        if (bestMatch && bestScore > 0) {
          await assignTaskToSubArea(task.id, bestMatch.id);
          assignedCount++;
        }
      }
      
      if (assignedCount > 0) {
        toast({
          title: "Tasks organised",
          description: `${assignedCount} task${assignedCount === 1 ? '' : 's'} automatically assigned to areas.`,
        });
        
        if (currentBusiness) {
          loadTodos(currentBusiness.id);
        }
      } else {
        toast({
          title: "No matches found",
          description: "No clear matches found between tasks and areas.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to organise tasks.",
        variant: "destructive",
      });
    }
  };

  const handleTaskGenerated = () => {
    if (currentBusiness) {
      loadTodos(currentBusiness.id);
      loadImpactSummaries(currentBusiness.id);
    }
  };

  const handleSubAreaAdded = () => {
    if (currentBusiness) {
      loadSubAreasByImpact(currentBusiness.id, config.impactArea);
    }
  };

  // Get tasks for each sub-area
  const getTasksForSubArea = (subAreaId: string) => {
    return impactTodos.filter(todo => todo.subAreaId === subAreaId);
  };

  // Get unassigned tasks for the "All Tasks" section
  const unassignedTasks = impactTodos.filter(todo => !todo.subAreaId);

  // Get the dragged task for overlay
  const activeTask = activeId ? impactTodos.find(t => t.id === activeId) : null;

  // Get icon for sub-area
  const getSubAreaIcon = (subArea: any) => {
    if (subArea.isUserCreated) return Plus;
    
    const title = subArea.title.toLowerCase();
    for (const [keyword, icon] of Object.entries(config.iconMap)) {
      if (title.includes(keyword.toLowerCase())) {
        return icon;
      }
    }
    return config.defaultIcon;
  };

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
            <div className="ml-4 flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <config.mainIcon className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-lg">{config.title}</h1>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </header>
          
          <main 
            className="flex-1 overflow-auto"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
              <div className="space-y-8">
                {/* Overview */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 min-w-0">
                      <h2 className="text-2xl font-bold mb-4">{config.impactArea} Overview</h2>
                      <p className="text-muted-foreground mb-6">
                        {config.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tasks Completed</p>
                          <p className="text-2xl font-bold">{completedTodos.length}/{impactTodos.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="text-2xl font-bold">{impactSummary?.pct || 0}%</p>
                        </div>
                      </div>
                      
                       <Progress 
                        value={impactSummary?.pct || 0} 
                        className="mt-4" 
                      />
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => {
                          setChatContext({level: 'overview'});
                          setShowAIChat(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Analysis Chat - {config.impactArea} Specialist
                      </Button>
                    </div>
                    
                     <div className="space-y-4">
                       <div className="bg-white/60 rounded-lg p-4">
                         {impactSummary && (
                           <ImpactCard
                             summary={impactSummary}
                             onViewTasks={() => setShowAIChat(true)}
                           />
                         )}
                       </div>
                     </div>
                  </div>
                </section>

                {/* Impact Areas */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">{config.impactArea} Areas</h3>
                      <div className="flex items-center gap-3">
                        {unassignedTasks.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleOrganiseTasks}
                            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                          >
                            <CheckSquare2 className="h-4 w-4" />
                            Organise Tasks
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAddAreaModal(true)}
                          className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                        >
                          <Plus className="h-4 w-4" />
                          Add Area
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {subAreas
                        .filter(sa => sa.impactArea === config.impactArea)
                        .map((subArea) => (
                          <DroppableSubArea
                            key={subArea.id}
                            subArea={subArea}
                            tasks={getTasksForSubArea(subArea.id)}
                            icon={getSubAreaIcon(subArea)}
                            impactArea={config.impactArea}
                            onTaskToggle={handleTodoToggle}
                            onTaskClick={setExpandedTaskId}
                            onAIChatClick={(subAreaTitle) => {
                              setChatContext({level: 'subarea', subArea: subAreaTitle});
                              setShowAIChat(true);
                            }}
                            onTaskGenerated={handleTaskGenerated}
                            className="animate-fade-in hover-scale"
                          />
                        ))}
                    </div>

                    {/* Unified All Tasks Section */}
                    <DroppableUnassignedArea
                      tasks={unassignedTasks}
                      impactArea={config.impactArea}
                      onTaskToggle={handleTodoToggle}
                      onTaskClick={setExpandedTaskId}
                    />

                    <DragOverlay 
                      dropAnimation={null}
                      style={{
                        cursor: 'grabbing',
                      }}
                    >
                      {activeTask && (
                        <div 
                          className="bg-white rounded-lg p-3 shadow-2xl border-2 border-primary/50 rotate-2 scale-105 pointer-events-none"
                          style={{
                            transformOrigin: '0 0',
                          }}
                        >
                          <TodoItem
                            todo={activeTask}
                            onToggleStatus={() => {}}
                            showImpact={false}
                          />
                        </div>
                      )}
                    </DragOverlay>
                  </DndContext>

                </section>

                {/* Documents */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <ImpactFilesSection 
                    impactArea={config.impactArea} 
                    className="bg-transparent border-0 shadow-none p-0"
                  />
                </section>

                {/* Resources */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Resources & Guidance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {config.resources.map((resource, index) => (
                      <Card key={index} className="bg-white/60">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {resource.description}
                          </p>
                          <Button variant="outline" size="sm">{resource.buttonText}</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <EnhancedAIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        impactArea={config.impactArea}
        subArea={chatContext.subArea}
        taskTitle={chatContext.taskTitle}
        contextLevel={chatContext.level}
      />
      
      {/* Expandable Task Modal */}
      {expandedTaskId && (
        <ExpandableTaskModal
          isOpen={true}
          todo={impactTodos.find(t => t.id === expandedTaskId)!}
          onClose={() => setExpandedTaskId(null)}
          onToggleStatus={(status) => handleTodoToggle(expandedTaskId, status)}
        />
      )}

      {/* Add Sub-Area Modal */}
      <AddSubAreaModal
        isOpen={showAddAreaModal}
        onClose={() => setShowAddAreaModal(false)}
        businessId={currentBusiness?.id || ''}
        impactArea={config.impactArea}
        onSubAreaAdded={handleSubAreaAdded}
      />
    </SidebarProvider>
  );
}