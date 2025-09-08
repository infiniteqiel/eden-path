/**
 * Customers Impact Area Page
 * 
 * Detailed view for Customers impact area progress and tasks.
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
import { CheckSquare2, Star, Shield, Users, MessageCircle } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Customers = () => {
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

  const customersSummary = impactSummaries.find(s => s.impact === 'Customers');
  const customersTodos = todos.filter(t => t.impact === 'Customers');
  const completedTodos = customersTodos.filter(t => t.status === 'done');

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  };

  const customerAreas = [
    {
      title: 'Product Quality',
      description: 'Product safety, quality, and customer satisfaction',
      icon: Star,
      tasks: customersTodos.filter(t => 
        t.title.toLowerCase().includes('quality') || 
        t.title.toLowerCase().includes('safety') || 
        t.title.toLowerCase().includes('product')
      )
    },
    {
      title: 'Customer Service',
      description: 'Support, responsiveness, and customer experience',
      icon: MessageCircle,
      tasks: customersTodos.filter(t => 
        t.title.toLowerCase().includes('service') || 
        t.title.toLowerCase().includes('support') || 
        t.title.toLowerCase().includes('experience')
      )
    },
    {
      title: 'Data Protection',
      description: 'Privacy, security, and data handling practices',
      icon: Shield,
      tasks: customersTodos.filter(t => 
        t.title.toLowerCase().includes('privacy') || 
        t.title.toLowerCase().includes('data') || 
        t.title.toLowerCase().includes('security')
      )
    },
    {
      title: 'Customer Impact',
      description: 'Beneficial outcomes for customers and society',
      icon: Users,
      tasks: customersTodos.filter(t => 
        t.title.toLowerCase().includes('impact') || 
        t.title.toLowerCase().includes('benefit') || 
        t.title.toLowerCase().includes('outcome')
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
              <CheckSquare2 className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg">Customers - Customer Impact</h1>
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
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-4">
                      {customersSummary && (
                        <ImpactCard
                          summary={customersSummary}
                          onViewTasks={() => {}}
                        />
                      )}
                    </div>
                  </div>
                </section>

                {/* Customer Areas */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Customer Impact Areas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customerAreas.map((area) => (
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

                {/* All Customer Tasks */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">All Customer Tasks</h3>
                  
                  {customersTodos.length > 0 ? (
                    <div className="space-y-4">
                      {customersTodos.map(todo => (
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
    </SidebarProvider>
  );
};

export default Customers;