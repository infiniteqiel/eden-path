/**
 * Enhanced Customers Impact Area Page with Drag & Drop
 */

import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { AppSidebar } from '@/components/app-sidebar';
import { DroppableSubArea } from '@/components/droppable-sub-area';
import { ImpactCard } from '@/components/impact-card';
import { AddSubAreaModal } from '@/components/add-sub-area-modal';
import { EnhancedAIChatModal } from '@/components/enhanced-ai-chat-modal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { useSubAreasStore } from '@/store/sub-areas';
import { Todo } from '@/domain/data-contracts';
import { MessageCircle, MessageSquare, Home, Plus, Star, Shield, Users } from 'lucide-react';
import { ExpandableTaskModal } from '@/components/expandable-task-modal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

// Default icon mapping for sub-areas
const getSubAreaIcon = (title: string) => {
  const iconMap: Record<string, any> = {
    'Product Quality': Star,
    'Customer Service': MessageCircle,
    'Data Protection': Shield,
    'Customer Impact': Users,
  };
  return iconMap[title] || Plus;
};

const EnhancedCustomers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();
  const { subAreas, loadSubAreasByImpact } = useSubAreasStore();
  
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
      loadSubAreasByImpact(currentBusiness.id, 'Customers');
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos, loadSubAreasByImpact]);

  const customersSummary = impactSummaries.find(s => s.impact === 'Customers');
  const customersTodos = todos.filter(t => t.impact === 'Customers');
  const completedTodos = customersTodos.filter(t => t.status === 'done');
  const customersSubAreas = subAreas.filter(sa => sa.impactArea === 'Customers');

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  };

  const getTasksForSubArea = (subAreaId: string) => {
    return customersTodos.filter(task => task.subAreaId === subAreaId);
  };

  const getUnassignedTasks = () => {
    return customersTodos.filter(task => !task.subAreaId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Handle task being dropped on a sub-area
    if (over.data.current?.type === 'subArea') {
      const taskId = active.id as string;
      const subAreaId = over.id as string;
      
      try {
        // Update task with new sub-area assignment
        // This would be implemented in your analysis service
        console.log(`Moving task ${taskId} to sub-area ${subAreaId}`);
        
        toast({
          title: "Task moved",
          description: "Task has been assigned to the sub-area",
        });
      } catch (error) {
        console.error('Error moving task:', error);
        toast({
          title: "Error",
          description: "Failed to move task",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubAreaAdded = () => {
    if (currentBusiness) {
      loadSubAreasByImpact(currentBusiness.id, 'Customers');
    }
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
                <MessageCircle className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-lg">Customers - Customer Impact</h1>
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
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-8">
                {/* Overview */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl font-bold mb-4">Customers Overview</h2>
                      <p className="text-muted-foreground mb-6">
                        The Customers impact area evaluates how your products and services benefit customers and society, 
                        including quality, customer service, data protection, and the beneficial outcomes for customers.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tasks Completed</p>
                          <p className="text-2xl font-bold">{completedTodos.length}/{customersTodos.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="text-2xl font-bold">{customersSummary?.pct || 0}%</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={customersSummary?.pct || 0} 
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
                        AI Analysis Chat - Customers Specialist
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4">
                        {customersSummary && (
                          <ImpactCard
                            summary={customersSummary}
                            onViewTasks={() => setShowAIChat(true)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Add Area Button */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Customer Impact Areas</h3>
                    <Button 
                      onClick={() => setShowAddAreaModal(true)}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Area
                    </Button>
                  </div>

                  {/* Drag & Drop Context */}
                  <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {customersSubAreas.map((subArea) => (
                        <DroppableSubArea
                          key={subArea.id}
                          subArea={subArea}
                          tasks={getTasksForSubArea(subArea.id)}
                          icon={getSubAreaIcon(subArea.title)}
                          impactArea="Customers"
                          onTaskToggle={handleTodoToggle}
                          onTaskClick={(taskId) => setExpandedTaskId(taskId)}
                          onAIChatClick={(subAreaTitle) => {
                            setChatContext({level: 'subarea', subArea: subAreaTitle});
                            setShowAIChat(true);
                          }}
                          onTaskGenerated={() => {
                            if (currentBusiness) {
                              loadTodos(currentBusiness.id);
                              loadImpactSummaries(currentBusiness.id);
                            }
                          }}
                        />
                      ))}
                    </div>

                    {/* Unassigned Tasks */}
                    {getUnassignedTasks().length > 0 && (
                      <Card className="mt-6 bg-white/60">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-4">Unassigned Tasks</h4>
                          <div className="space-y-3">
                            {getUnassignedTasks().map(task => (
                              <div 
                                key={task.id} 
                                className="bg-white/80 rounded p-3 cursor-pointer hover:shadow-md transition-all duration-200" 
                                onClick={() => setExpandedTaskId(task.id)}
                              >
                                <span className="text-sm text-muted-foreground">
                                  Drag this task to assign it to a sub-area: {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </DndContext>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <EnhancedAIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        impactArea="Customers"
        subArea={chatContext.subArea}
        taskTitle={chatContext.taskTitle}
        contextLevel={chatContext.level}
      />

      <AddSubAreaModal
        isOpen={showAddAreaModal}
        onClose={() => setShowAddAreaModal(false)}
        businessId={currentBusiness?.id || ''}
        impactArea="Customers"
        onSubAreaAdded={handleSubAreaAdded}
      />
      
      {/* Expandable Task Modal */}
      {expandedTaskId && (
        <ExpandableTaskModal
          isOpen={true}
          todo={customersTodos.find(t => t.id === expandedTaskId)!}
          onClose={() => setExpandedTaskId(null)}
          onToggleStatus={(status) => handleTodoToggle(expandedTaskId, status)}
        />
      )}
    </SidebarProvider>
  );
};

export default EnhancedCustomers;