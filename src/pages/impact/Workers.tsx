/**
 * Workers Impact Area Page
 * 
 * Detailed view for Workers impact area progress and tasks.
 */

import React, { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { TodoItem } from '@/components/todo-item';
import { ImpactCard } from '@/components/impact-card';
import { ImpactFilesSection } from '@/components/impact-files-section';
import { AIChatModal } from '@/components/ai-chat-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { Users, Heart, DollarSign, GraduationCap, CheckSquare2, MessageSquare } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Workers = () => {
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

  const workersSummary = impactSummaries.find(s => s.impact === 'Workers');
  const workersTodos = todos.filter(t => t.impact === 'Workers');
  const completedTodos = workersTodos.filter(t => t.status === 'done');

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  };

  const workerAreas = [
    {
      title: 'Compensation & Benefits',
      description: 'Fair wages, benefits, and financial security',
      icon: DollarSign,
      tasks: workersTodos.filter(t => 
        t.title.toLowerCase().includes('wage') || 
        t.title.toLowerCase().includes('benefit') || 
        t.title.toLowerCase().includes('compensation')
      )
    },
    {
      title: 'Well-being & Safety',
      description: 'Health, safety, and work-life balance',
      icon: Heart,
      tasks: workersTodos.filter(t => 
        t.title.toLowerCase().includes('health') || 
        t.title.toLowerCase().includes('safety') || 
        t.title.toLowerCase().includes('wellbeing')
      )
    },
    {
      title: 'Career Development',
      description: 'Training, growth, and advancement opportunities',
      icon: GraduationCap,
      tasks: workersTodos.filter(t => 
        t.title.toLowerCase().includes('training') || 
        t.title.toLowerCase().includes('development') || 
        t.title.toLowerCase().includes('education')
      )
    },
    {
      title: 'Engagement & Culture',
      description: 'Employee satisfaction and workplace culture',
      icon: Users,
      tasks: workersTodos.filter(t => 
        t.title.toLowerCase().includes('culture') || 
        t.title.toLowerCase().includes('engagement') || 
        t.title.toLowerCase().includes('satisfaction')
      )
    }
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
            <div className="ml-4 flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg">Workers - Employee Impact</h1>
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
                      <h2 className="text-2xl font-bold mb-4">Workers Overview</h2>
                      <p className="text-muted-foreground mb-6">
                        The Workers impact area evaluates how your company treats its employees, 
                        including compensation, benefits, training, ownership opportunities, and overall workplace environment.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tasks Completed</p>
                          <p className="text-2xl font-bold">{completedTodos.length}/{workersTodos.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="text-2xl font-bold">{workersSummary?.pct || 0}%</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={workersSummary?.pct || 0} 
                        className="mt-4" 
                      />
                      
                      <Button variant="outline" size="sm" className="mt-3">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Analysis Chat
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4">
                        {workersSummary && (
                          <ImpactCard
                            summary={workersSummary}
                            onViewTasks={() => setShowAIChat(true)}
                          />
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => setShowAIChat(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Analysis Chat
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Worker Areas */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Worker Impact Areas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workerAreas.map((area) => (
                      <Card key={area.title} className="bg-white/60">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <area.icon className="h-5 w-5 text-primary" />
                            {area.title}
                          </CardTitle>
                          <CardDescription>{area.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {area.tasks.length > 0 ? (
                              area.tasks.map(task => (
                                <div key={task.id} className="bg-white/80 rounded p-3">
                                  <TodoItem
                                    todo={task}
                                    onToggleStatus={(status) => handleTodoToggle(task.id, status)}
                                  />
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No specific tasks for this area yet</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Workers Documents */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <ImpactFilesSection 
                    impactArea="Workers" 
                    className="bg-transparent border-0 shadow-none p-0"
                  />
                </section>

                {/* All Workers Tasks */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">All Workers Tasks</h3>
                  
                  {workersTodos.length > 0 ? (
                    <div className="space-y-4">
                      {workersTodos.map(todo => (
                        <div key={todo.id} className="bg-white/60 rounded-lg p-4">
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
                      <CheckSquare2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No workers tasks available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tasks will appear here after document analysis
                      </p>
                    </div>
                  )}
                </section>

                {/* Resources */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Resources & Best Practices</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Living Wage Calculator</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Ensure your compensation meets living wage standards
                        </p>
                        <Button variant="outline" size="sm">Calculate</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Employee Handbook Template</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download comprehensive HR policy templates
                        </p>
                        <Button variant="outline" size="sm">Download</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Engagement Surveys</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Tools to measure and improve employee satisfaction
                        </p>
                        <Button variant="outline" size="sm">Explore</Button>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <AIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        impactArea="Workers"
      />
    </SidebarProvider>
  );
};

export default Workers;