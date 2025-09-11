/**
 * Community Impact Area Page
 * 
 * Detailed view for Community impact area progress and tasks.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { TodoItem } from '@/components/todo-item';
import { ImpactCard } from '@/components/impact-card';
import { ImpactFilesSection } from '@/components/impact-files-section';
import { AIChatModal } from '@/components/ai-chat-modal';
import { EvidenceUploadModal } from '@/components/evidence-upload-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { Target, HandHeart, ShoppingCart, MapPin, CheckSquare2, MessageSquare, Home } from 'lucide-react';
import { AIChatIcon } from '@/components/ai-chat-icon';
import { ExpandableTaskModal } from '@/components/expandable-task-modal';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Community = () => {
  const navigate = useNavigate();
  const [evidenceModalOpen, setEvidenceModalOpen] = React.useState(false);
  const [selectedTodo, setSelectedTodo] = React.useState<Todo | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

  const communitySummary = impactSummaries.find(s => s.impact === 'Community');
  const communityTodos = todos.filter(t => t.impact === 'Community');
  const completedTodos = communityTodos.filter(t => t.status === 'done');

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  };

  const handleUploadEvidence = (todo: Todo) => {
    setSelectedTodo(todo);
    setEvidenceModalOpen(true);
  };

  const communityAreas = [
    {
      title: 'Local Community',
      description: 'Economic development and local engagement',
      icon: MapPin,
      tasks: communityTodos.filter(t => 
        t.title.toLowerCase().includes('local') || 
        t.title.toLowerCase().includes('community') || 
        t.title.toLowerCase().includes('regional')
      )
    },
    {
      title: 'Supply Chain',
      description: 'Supplier diversity and ethical sourcing',
      icon: ShoppingCart,
      tasks: communityTodos.filter(t => 
        t.title.toLowerCase().includes('supplier') || 
        t.title.toLowerCase().includes('supply') || 
        t.title.toLowerCase().includes('sourcing')
      )
    },
    {
      title: 'Charitable Giving',
      description: 'Philanthropy and community investment',
      icon: HandHeart,
      tasks: communityTodos.filter(t => 
        t.title.toLowerCase().includes('charity') || 
        t.title.toLowerCase().includes('donation') || 
        t.title.toLowerCase().includes('giving')
      )
    },
    {
      title: 'Civic Engagement',
      description: 'Political engagement and advocacy',
      icon: Target,
      tasks: communityTodos.filter(t => 
        t.title.toLowerCase().includes('civic') || 
        t.title.toLowerCase().includes('advocacy') || 
        t.title.toLowerCase().includes('political')
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
            <div className="ml-4 flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-lg">Community - Local Impact</h1>
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
                      <h2 className="text-2xl font-bold mb-4">Community Overview</h2>
                      <p className="text-muted-foreground mb-6">
                        The Community impact area evaluates your company's impact on the communities where it operates, 
                        including local economic development, supplier diversity, charitable giving, and civic engagement.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tasks Completed</p>
                          <p className="text-2xl font-bold">{completedTodos.length}/{communityTodos.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="text-2xl font-bold">{communitySummary?.pct || 0}%</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={communitySummary?.pct || 0} 
                        className="mt-4" 
                      />
                      
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4">
                        {communitySummary && (
                          <ImpactCard
                            summary={communitySummary}
                            onViewTasks={() => setShowAIChat(true)}
                          />
                        )}
                      </div>
                      
                    </div>
                  </div>
                </section>

                {/* Community Areas */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Community Impact Areas</h3>
                  
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {communityAreas.map((area) => (
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
                                 <div key={task.id} className="bg-white/80 rounded p-3 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTaskId(task.id)}>
                                    <TodoItem
                                      todo={task}
                                      onToggleStatus={(status) => handleTodoToggle(task.id, status)}
                                      onUploadEvidence={() => handleUploadEvidence(task)}
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

                {/* Community Documents */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <ImpactFilesSection 
                    impactArea="Community" 
                    className="bg-transparent border-0 shadow-none p-0"
                  />
                </section>

                {/* All Community Tasks */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">All Community Tasks</h3>
                  
                   {communityTodos.length > 0 ? (
                     <div className="space-y-4">
                       {communityTodos.map(todo => (
                         <div key={todo.id} className="bg-white/60 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTaskId(todo.id)}>
                            <TodoItem
                              todo={todo}
                              onToggleStatus={(status) => handleTodoToggle(todo.id, status)}
                              onUploadEvidence={() => handleUploadEvidence(todo)}
                              showImpact={false}
                            />
                         </div>
                       ))}
                     </div>
                   ) : (
                    <div className="text-center py-12">
                      <CheckSquare2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No community tasks available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tasks will appear here after document analysis
                      </p>
                    </div>
                  )}
                </section>

                {/* Resources */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Community Resources</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Supplier Directory</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Find diverse and local suppliers for your business
                        </p>
                        <Button variant="outline" size="sm">Browse</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Volunteering Programs</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Set up employee volunteer programs in your community
                        </p>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Impact Measurement</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Tools to measure and report community impact
                        </p>
                        <Button variant="outline" size="sm">Get Tools</Button>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
        
        {/* Evidence Upload Modal */}
        {selectedTodo && (
          <EvidenceUploadModal
            isOpen={evidenceModalOpen}
            onClose={() => {
              setEvidenceModalOpen(false);
              setSelectedTodo(null);
            }}
            todo={selectedTodo}
          />
        )}
      </div>
      
      <AIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        impactArea="Community"
        context={{ level: 'overview' }}
      />
      
      {/* Expandable Task Modal */}
      {expandedTaskId && (
        <ExpandableTaskModal
          isOpen={true}
          todo={communityTodos.find(t => t.id === expandedTaskId)!}
          onClose={() => setExpandedTaskId(null)}
          onToggleStatus={(status) => handleTodoToggle(expandedTaskId, status)}
        />
      )}
    </SidebarProvider>
  );
};

export default Community;