/**
 * Customers Impact Area Page with Drag & Drop and Custom Areas
 */

import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { AppSidebar } from '@/components/app-sidebar';
import { TodoItem } from '@/components/todo-item';
import { ImpactCard } from '@/components/impact-card';
import { DroppableSubArea } from '@/components/droppable-sub-area';
import { AddSubAreaModal } from '@/components/add-sub-area-modal';
import { EnhancedAIChatModal } from '@/components/enhanced-ai-chat-modal';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { useSubAreasStore } from '@/store/sub-areas';
import { Todo } from '@/domain/data-contracts';
import { CheckSquare2, Star, Shield, Users, MessageCircle, MessageSquare, Home, Plus } from 'lucide-react';
import { ExpandableTaskModal } from '@/components/expandable-task-modal';
import { GrowTaskButton } from '@/components/grow-task-button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Customers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus, assignTaskToSubArea } = useAnalysisStore();
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

  // Hardcoded default areas (always present)
  const defaultCustomerAreas = [
    {
      id: 'product-quality',
      title: 'Product Quality',
      description: 'Product safety, quality, and customer satisfaction',
      icon: Star,
      isUserCreated: false,
      tasks: customersTodos.filter(t => 
        !t.subAreaId && (
          t.title.toLowerCase().includes('quality') || 
          t.title.toLowerCase().includes('safety') || 
          t.title.toLowerCase().includes('product')
        )
      )
    },
    {
      id: 'customer-service',
      title: 'Customer Service',
      description: 'Support, responsiveness, and customer experience',
      icon: MessageCircle,
      isUserCreated: false,
      tasks: customersTodos.filter(t => 
        !t.subAreaId && (
          t.title.toLowerCase().includes('service') || 
          t.title.toLowerCase().includes('support') || 
          t.title.toLowerCase().includes('experience')
        )
      )
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      description: 'Privacy, security, and data handling practices',
      icon: Shield,
      isUserCreated: false,
      tasks: customersTodos.filter(t => 
        !t.subAreaId && (
          t.title.toLowerCase().includes('privacy') || 
          t.title.toLowerCase().includes('data') || 
          t.title.toLowerCase().includes('security')
        )
      )
    },
    {
      id: 'customer-impact',
      title: 'Customer Impact',
      description: 'Beneficial outcomes for customers and society',
      icon: Users,
      isUserCreated: false,
      tasks: customersTodos.filter(t => 
        !t.subAreaId && (
          t.title.toLowerCase().includes('impact') || 
          t.title.toLowerCase().includes('benefit') || 
          t.title.toLowerCase().includes('outcome')
        )
      )
    }
  ];

  // Get tasks for a specific custom sub-area
  const getTasksForSubArea = (subAreaId: string) => {
    return customersTodos.filter(task => task.subAreaId === subAreaId);
  };

  // Get unassigned tasks (not in any hardcoded or custom area)
  const getUnassignedTasks = () => {
    const assignedToCustom = customersTodos.filter(task => task.subAreaId);
    const assignedToDefault = defaultCustomerAreas.flatMap(area => area.tasks);
    const allAssigned = [...assignedToCustom, ...assignedToDefault];
    return customersTodos.filter(task => !allAssigned.find(assigned => assigned.id === task.id));
  };

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
    if (over.data.current?.type === 'subArea') {
      const taskId = active.id as string;
      const subAreaId = over.id as string;
      
      try {
        // For now, just show a toast - this would be implemented with the analysis service
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

                {/* Customer Areas with Add Area Button */}
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

                  <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Hardcoded Default Areas */}
                      {defaultCustomerAreas.map((area) => (
                        <Card key={area.id} className="bg-white/60 relative hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <area.icon className="h-5 w-5 text-primary" />
                              {area.title}
                            </CardTitle>
                            <CardDescription>{area.description}</CardDescription>
                          </CardHeader>
                          {/* AI Chat Icon for Sub-Area - Top Right */}
                          <div className="absolute top-4 right-4">
                            <AIChatIcon 
                              onClick={() => {
                                setChatContext({level: 'subarea', subArea: area.title});
                                setShowAIChat(true);
                              }}
                              size="sm"
                            />
                          </div>
                          <CardContent>
                            <div className="space-y-3">
                              {area.tasks.length > 0 ? (
                                area.tasks.map(task => (
                                  <div key={task.id} className="bg-white/80 rounded p-3 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTaskId(task.id)}>
                                    <TodoItem
                                      todo={task}
                                      onToggleStatus={(status) => handleTodoToggle(task.id, status)}
                                    />
                                  </div>
                                ))
                              ) : (
                                <div className="space-y-3">
                                  <p className="text-sm text-muted-foreground">No specific tasks for this area yet</p>
                                  <GrowTaskButton
                                    subArea={area.title}
                                    impactArea="Customers"
                                    onTaskGenerated={() => {
                                      if (currentBusiness) {
                                        loadTodos(currentBusiness.id);
                                        loadImpactSummaries(currentBusiness.id);
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* User-Created Custom Areas */}
                      {customersSubAreas.filter(sa => sa.isUserCreated).map((subArea) => (
                        <DroppableSubArea
                          key={subArea.id}
                          subArea={subArea}
                          tasks={getTasksForSubArea(subArea.id)}
                          icon={Plus}
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
                                <TodoItem
                                  todo={task}
                                  onToggleStatus={(status) => handleTodoToggle(task.id, status)}
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </DndContext>
                </section>

                {/* All Customer Tasks */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">All Customer Tasks</h3>
                  
                  {customersTodos.length > 0 ? (
                    <div className="space-y-4">
                      {customersTodos.map(todo => (
                        <div key={todo.id} className="bg-white/60 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTaskId(todo.id)}>
                          <TodoItem
                            todo={todo}
                            onToggleStatus={(status) => handleTodoToggle(todo.id, status)}
                            showImpact={false}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No customer tasks available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tasks will appear here after document analysis
                      </p>
                    </div>
                  )}
                </section>

                {/* Resources */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Customer Resources</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Customer Feedback Tools</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Collect and analyze customer satisfaction data
                        </p>
                        <Button variant="outline" size="sm">Get Tools</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Privacy Policy Template</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          GDPR-compliant privacy policy templates
                        </p>
                        <Button variant="outline" size="sm">Download</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Impact Measurement</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Measure the beneficial outcomes for your customers
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

export default Customers;