/**
 * Governance Impact Area Page
 * 
 * Detailed view for Governance impact area progress and tasks.
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
import { DraggableTask } from '@/components/draggable-task';
import { AddSubAreaModal } from '@/components/add-sub-area-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { useSubAreasStore } from '@/store/sub-areas';
import { Todo } from '@/domain/data-contracts';
import { Building2, Users, Scale, FileText, CheckSquare2, MessageSquare, Home, Plus } from 'lucide-react';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { ExpandableTaskModal } from '@/components/expandable-task-modal';
import { GrowTaskButton } from '@/components/grow-task-button';
import { useToast } from '@/hooks/use-toast';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Governance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus, assignTaskToSubArea } = useAnalysisStore();
  const { subAreas, loadSubAreasByImpact, createSubArea } = useSubAreasStore();
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatContext, setChatContext] = useState<{level: 'overview' | 'subarea' | 'task', subArea?: string, taskTitle?: string}>({level: 'overview'});
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
      loadSubAreasByImpact(currentBusiness.id, 'Governance');
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos, loadSubAreasByImpact]);

  const governanceSummary = impactSummaries.find(s => s.impact === 'Governance');
  const governanceTodos = todos.filter(t => t.impact === 'Governance');
  const completedTodos = governanceTodos.filter(t => t.status === 'done');

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

    // Handle task being dropped on a sub-area
    if (over.data?.current?.type === 'subArea') {
      const taskId = active.id as string;
      const subAreaId = over.id as string;
      
      try {
        await assignTaskToSubArea(taskId, subAreaId);
        toast({
          title: "Task assigned",
          description: "Task has been assigned to the selected area.",
        });
        
        if (currentBusiness) {
          loadTodos(currentBusiness.id);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to assign task to area.",
          variant: "destructive",
        });
      }
    }
  };

  const handleTaskGenerated = () => {
    if (currentBusiness) {
      loadTodos(currentBusiness.id);
      loadImpactSummaries(currentBusiness.id);
    }
  };

  const handleCreateSubArea = async (title: string, description?: string) => {
    if (!currentBusiness) return;
    
    try {
      await createSubArea(currentBusiness.id, 'Governance', title, description);
      
      toast({
        title: "Area created",
        description: `${title} has been added successfully.`,
      });
      
      loadSubAreasByImpact(currentBusiness.id, 'Governance');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create area.",
        variant: "destructive",
      });
    }
  };

  // Get tasks for each sub-area
  const getTasksForSubArea = (subAreaId: string) => {
    return governanceTodos.filter(todo => todo.subAreaId === subAreaId);
  };

  // Get unassigned tasks for the "All Tasks" section
  const unassignedTasks = governanceTodos.filter(todo => !todo.subAreaId);

  // Get the dragged task for overlay
  const activeTask = activeId ? governanceTodos.find(t => t.id === activeId) : null;

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
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-lg">Governance - Mission & Leadership</h1>
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
                      <h2 className="text-2xl font-bold mb-4">Governance Overview</h2>
                      <p className="text-muted-foreground mb-6">
                        Governance measures how your company manages its overall mission, stakeholder engagement, 
                        and transparency. This includes your legal structure, board composition, and commitment to your mission.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tasks Completed</p>
                          <p className="text-2xl font-bold">{completedTodos.length}/{governanceTodos.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="text-2xl font-bold">{governanceSummary?.pct || 0}%</p>
                        </div>
                      </div>
                      
                       <Progress 
                        value={governanceSummary?.pct || 0} 
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
                        AI Analysis Chat - Governance Specialist
                      </Button>
                    </div>
                    
                     <div className="space-y-4">
                       <div className="bg-white/60 rounded-lg p-4">
                         {governanceSummary && (
                           <ImpactCard
                             summary={governanceSummary}
                             onViewTasks={() => setShowAIChat(true)}
                           />
                         )}
                       </div>
                     </div>
                  </div>
                </section>

                {/* Governance Areas */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Governance Areas</h3>
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

                  <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {subAreas.map((subArea) => (
                        <DroppableSubArea
                          key={subArea.id}
                          subArea={subArea}
                          tasks={getTasksForSubArea(subArea.id)}
                          icon={subArea.isUserCreated ? Plus : 
                                subArea.title.toLowerCase().includes('mission') ? Building2 :
                                subArea.title.toLowerCase().includes('board') ? Users :
                                subArea.title.toLowerCase().includes('legal') ? Scale : FileText}
                          impactArea="Governance"
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

                    <DragOverlay>
                      {activeTask && (
                        <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-primary/30 animate-scale-in">
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

                {/* All Governance Tasks */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">All Governance Tasks</h3>
                    <p className="text-sm text-muted-foreground">Drag & Drop tasks to organize them into areas above</p>
                  </div>
                  
                   {unassignedTasks.length > 0 ? (
                     <div className="space-y-4">
                       {unassignedTasks.map(todo => (
                         <DraggableTask
                           key={todo.id}
                           task={todo}
                           onToggleStatus={handleTodoToggle}
                           onClick={() => setExpandedTaskId(todo.id)}
                         />
                       ))}
                     </div>
                   ) : (
                    <div className="text-center py-12 animate-fade-in">
                      <CheckSquare2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No unassigned governance tasks</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        All tasks have been organized or generate new ones through document analysis
                      </p>
                    </div>
                  )}
                </section>

                {/* Governance Documents */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <ImpactFilesSection 
                    impactArea="Governance" 
                    className="bg-transparent border-0 shadow-none p-0"
                  />
                </section>

                {/* Resources */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Resources & Guidance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">B Corp Legal Requirement</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn about the legal changes needed for B Corp certification
                        </p>
                        <Button variant="outline" size="sm">View Guide</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Mission Lock Templates</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download templates for Articles of Association updates
                        </p>
                        <Button variant="outline" size="sm">Download</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Best Practices</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Examples from successful B Corp governance structures
                        </p>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </CardContent>
                    </Card>
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
        impactArea="Governance"
        subArea={chatContext.subArea}
        taskTitle={chatContext.taskTitle}
        contextLevel={chatContext.level}
      />
      
      {/* Expandable Task Modal */}
      {expandedTaskId && (
        <ExpandableTaskModal
          isOpen={true}
          todo={governanceTodos.find(t => t.id === expandedTaskId)!}
          onClose={() => setExpandedTaskId(null)}
          onToggleStatus={(status) => handleTodoToggle(expandedTaskId, status)}
        />
      )}

      {/* Add Sub-Area Modal */}
      <AddSubAreaModal
        isOpen={showAddAreaModal}
        onClose={() => setShowAddAreaModal(false)}
        businessId={currentBusiness?.id || ''}
        impactArea="Governance"
        onSubAreaAdded={() => {
          if (currentBusiness) {
            loadSubAreasByImpact(currentBusiness.id, 'Governance');
          }
        }}
      />
    </SidebarProvider>
  );
};

export default Governance;