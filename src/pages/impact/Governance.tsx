/**
 * Governance Impact Area Page
 * 
 * Detailed view for Governance impact area progress and tasks.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Building2, Users, Scale, FileText, CheckSquare2, MessageSquare, Home } from 'lucide-react';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { ExpandableTaskModal } from '@/components/expandable-task-modal';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Governance = () => {
  const navigate = useNavigate();
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();
  const [showAIChat, setShowAIChat] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

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

  const governanceAreas = [
    {
      title: 'Mission & Purpose',
      description: 'Legal mission lock and stakeholder governance',
      icon: Building2,
      tasks: governanceTodos.filter(t => t.title.toLowerCase().includes('mission') || t.title.toLowerCase().includes('purpose'))
    },
    {
      title: 'Board Structure',
      description: 'Board composition and oversight',
      icon: Users,
      tasks: governanceTodos.filter(t => t.title.toLowerCase().includes('board') || t.title.toLowerCase().includes('director'))
    },
    {
      title: 'Legal Compliance',
      description: 'Articles of Association and legal requirements',
      icon: Scale,
      tasks: governanceTodos.filter(t => t.title.toLowerCase().includes('legal') || t.title.toLowerCase().includes('articles'))
    },
    {
      title: 'Transparency',
      description: 'Reporting and stakeholder communication',
      icon: FileText,
      tasks: governanceTodos.filter(t => t.title.toLowerCase().includes('report') || t.title.toLowerCase().includes('transparency'))
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
                  <h3 className="text-xl font-bold mb-6">Governance Areas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {governanceAreas.map((area) => (
                      <Card key={area.title} className="bg-white/60 relative hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <area.icon className="h-5 w-5 text-primary" />
                            {area.title}
                          </CardTitle>
                          <CardDescription>{area.description}</CardDescription>
                        </CardHeader>
                        {/* AI Chat Icon for Sub-Area */}
                        <div className="absolute bottom-4 right-4">
                          <AIChatIcon 
                            onClick={() => setShowAIChat(true)}
                            size="sm"
                          />
                        </div>
                        <CardContent>
                          <div className="space-y-3">
                            {area.tasks.length > 0 ? (
                              area.tasks.map(task => (
                                <div key={task.id} className="bg-white/80 rounded p-3 relative cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTaskId(task.id)}>
                                  <TodoItem
                                    todo={task}
                                    onToggleStatus={(status) => handleTodoToggle(task.id, status)}
                                  />
                                  {/* AI Chat Icon for Task */}
                                  <div className="absolute bottom-2 right-2">
                                    <AIChatIcon 
                                      onClick={() => setShowAIChat(true)}
                                      size="sm"
                                    />
                                  </div>
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

                {/* Governance Documents */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <ImpactFilesSection 
                    impactArea="Governance" 
                    className="bg-transparent border-0 shadow-none p-0"
                  />
                </section>

                {/* All Governance Tasks */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">All Governance Tasks</h3>
                  
                   {governanceTodos.length > 0 ? (
                     <div className="space-y-4">
                       {governanceTodos.map(todo => (
                         <div key={todo.id} className="bg-white/60 rounded-lg p-4 relative cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTaskId(todo.id)}>
                           <TodoItem
                             todo={todo}
                             onToggleStatus={(status) => handleTodoToggle(todo.id, status)}
                             showImpact={false}
                           />
                           {/* AI Chat Icon for Task */}
                           <div className="absolute bottom-2 right-2">
                             <AIChatIcon 
                               onClick={() => setShowAIChat(true)}
                               size="sm"
                             />
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                    <div className="text-center py-12">
                      <CheckSquare2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No governance tasks available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tasks will appear here after document analysis
                      </p>
                    </div>
                  )}
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
      
      <AIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        impactArea="Governance"
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
    </SidebarProvider>
  );
};

export default Governance;