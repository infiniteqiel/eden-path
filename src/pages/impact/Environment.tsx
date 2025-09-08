/**
 * Environment Impact Area Page
 * 
 * Detailed view for Environment impact area progress and tasks.
 */

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { TodoItem } from '@/components/todo-item';
import { ImpactCard } from '@/components/impact-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { Leaf, Zap, Recycle, Droplets, CheckSquare2 } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Environment = () => {
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

  const environmentSummary = impactSummaries.find(s => s.impact === 'Environment');
  const environmentTodos = todos.filter(t => t.impact === 'Environment');
  const completedTodos = environmentTodos.filter(t => t.status === 'done');

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  };

  const environmentAreas = [
    {
      title: 'Energy & Carbon',
      description: 'Energy consumption and carbon footprint management',
      icon: Zap,
      tasks: environmentTodos.filter(t => 
        t.title.toLowerCase().includes('energy') || 
        t.title.toLowerCase().includes('carbon') || 
        t.title.toLowerCase().includes('emissions')
      )
    },
    {
      title: 'Waste Management',
      description: 'Waste reduction, recycling, and circular economy',
      icon: Recycle,
      tasks: environmentTodos.filter(t => 
        t.title.toLowerCase().includes('waste') || 
        t.title.toLowerCase().includes('recycl') || 
        t.title.toLowerCase().includes('circular')
      )
    },
    {
      title: 'Water & Resources',
      description: 'Water conservation and resource efficiency',
      icon: Droplets,
      tasks: environmentTodos.filter(t => 
        t.title.toLowerCase().includes('water') || 
        t.title.toLowerCase().includes('resource') || 
        t.title.toLowerCase().includes('material')
      )
    },
    {
      title: 'Environmental Policy',
      description: 'Environmental management systems and policies',
      icon: Leaf,
      tasks: environmentTodos.filter(t => 
        t.title.toLowerCase().includes('policy') || 
        t.title.toLowerCase().includes('management') || 
        t.title.toLowerCase().includes('compliance')
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
              <Leaf className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg">Environment - Sustainability</h1>
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
                      <h2 className="text-2xl font-bold mb-4">Environment Overview</h2>
                      <p className="text-muted-foreground mb-6">
                        The Environment impact area evaluates your company's environmental performance, 
                        including energy use, emissions, waste, water consumption, and overall environmental management.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tasks Completed</p>
                          <p className="text-2xl font-bold">{completedTodos.length}/{environmentTodos.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="text-2xl font-bold">{environmentSummary?.completionPercentage || 0}%</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={environmentSummary?.completionPercentage || 0} 
                        className="mt-4" 
                      />
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-4">
                      {environmentSummary && (
                        <ImpactCard
                          summary={environmentSummary}
                          onViewTasks={() => {}}
                        />
                      )}
                    </div>
                  </div>
                </section>

                {/* Environment Areas */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Environmental Impact Areas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {environmentAreas.map((area) => (
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

                {/* All Environment Tasks */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">All Environment Tasks</h3>
                  
                  {environmentTodos.length > 0 ? (
                    <div className="space-y-4">
                      {environmentTodos.map(todo => (
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
                      <p className="text-muted-foreground">No environment tasks available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tasks will appear here after document analysis
                      </p>
                    </div>
                  )}
                </section>

                {/* Resources */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Environmental Resources</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Carbon Calculator</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Calculate your company's carbon footprint
                        </p>
                        <Button variant="outline" size="sm">Calculate</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Sustainability Plan Template</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download environmental management templates
                        </p>
                        <Button variant="outline" size="sm">Download</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Green Certifications</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Explore environmental certifications and standards
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
    </SidebarProvider>
  );
};

export default Environment;