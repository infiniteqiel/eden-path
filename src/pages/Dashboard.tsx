/**
 * Dashboard Page
 * 
 * Main dashboard showing business overview and progress across Impact Areas.
 */

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { ImpactCard } from '@/components/impact-card';
import { TodoItem } from '@/components/todo-item';
import { EmptyState } from '@/components/empty-state';
import { UploadDropzone } from '@/components/upload-dropzone';
import { EvidenceUploadModal } from '@/components/evidence-upload-modal';
import { UploadModal } from '@/components/upload-modal';
import { BusinessSwitcher } from '@/components/business-switcher';
import { CompanyCreationModal } from '@/components/company-creation-modal';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { Upload, FileText, ArrowRight, Building, Leaf, Users, RotateCcw, Home } from 'lucide-react';
import { AIChatIcon } from '@/components/ai-chat-icon';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [evidenceModalOpen, setEvidenceModalOpen] = React.useState(false);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [companyModalOpen, setCompanyModalOpen] = React.useState(false);
  const [selectedTodo, setSelectedTodo] = React.useState<Todo | null>(null);
  
  const { businesses, currentBusiness, loadBusinesses, selectBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus, resetTestData, resetAllTestData } = useAnalysisStore();

  // Get quick todos (top 5 priority P1/P2 not done)
  const quickTodos = todos
    .filter(todo => todo.status !== 'done' && ['P1', 'P2'].includes(todo.priority))
    .slice(0, 5);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
    }
  };

  const handleTestReset = () => {
    // Reset progress and add random priority tasks
    if (currentBusiness) {
      resetTestData(currentBusiness.id);
    }
  };

  const handleUploadEvidence = (todo: Todo) => {
    setSelectedTodo(todo);
    setEvidenceModalOpen(true);
  };

  if (!businesses.length) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1">
            <header className="h-12 flex items-center border-b px-4">
              <SidebarTrigger />
            </header>
            <main className="container mx-auto px-4 py-8">
              <EmptyState
                title="Welcome to bcstart.ai"
                description="Let's get started by setting up your first business profile."
                ctaLabel="Create Business"
                onCta={() => {}}
              />
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

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
            <div className="ml-4 flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 md:hidden lg:flex"
                >
                  Dashboard
                </Button>
                <h1 className="font-bold text-lg">Dashboard - B Corp Progress</h1>
                <BusinessSwitcher
                  businesses={businesses}
                  currentBusiness={currentBusiness}
                  onBusinessChange={(business) => selectBusiness(business.id)}
                  onAddCompany={() => setCompanyModalOpen(true)}
                />
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
            className="flex-1 overflow-auto relative"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-full overflow-x-hidden">
              <div className="space-y-4 md:space-y-8">
                {currentBusiness ? (
                  <>
                     {/* Impact Cards - One Row, Square Layout */}
                    <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold mb-2">B Corp Progress Overview</h2>
                          <p className="text-muted-foreground text-sm md:text-base">
                            Track your advancement across the five key impact areas
                          </p>
                        </div>
                        {/* Upload Button - Top Right */}
                        <Button 
                          onClick={() => setUploadModalOpen(true)}
                          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="hidden sm:inline">Upload Documents</span>
                          <span className="sm:hidden">Upload</span>
                        </Button>
                      </div>
                      
                       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                         {impactSummaries.filter(summary => summary.impact !== 'Other').map((summary) => {
                           const impactTodos = todos.filter(t => t.impact === summary.impact && t.status !== 'done').slice(0, 3);
                           
                           return (
                             <Card key={summary.impact} className="aspect-square p-4 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 border border-muted hover:border-primary/30 bg-gradient-to-br from-white to-white/50">
                               <div className="h-full flex flex-col">
                                 <div className="flex items-center gap-2 mb-3">
                                   <div className={`w-3 h-3 rounded-full ${
                                     summary.impact === 'Governance' ? 'bg-blue-600' :
                                     summary.impact === 'Workers' ? 'bg-green-600' :
                                     summary.impact === 'Community' ? 'bg-orange-600' :
                                     summary.impact === 'Environment' ? 'bg-purple-600' :
                                     'bg-indigo-600'
                                   }`} />
                                   <h3 className="font-semibold text-sm truncate">{summary.impact}</h3>
                                 </div>
                                 
                                 {/* Progress Bar */}
                                 <div className="w-full bg-secondary rounded-full h-2 mb-3">
                                   <div 
                                     className={`h-2 rounded-full transition-all duration-500 ${
                                       summary.impact === 'Governance' ? 'bg-blue-600' :
                                       summary.impact === 'Workers' ? 'bg-green-600' :
                                       summary.impact === 'Community' ? 'bg-orange-600' :
                                       summary.impact === 'Environment' ? 'bg-purple-600' :
                                       'bg-indigo-600'
                                     }`}
                                     style={{ width: `${summary.pct}%` }}
                                   />
                                 </div>
                                 
                                  <div className={`text-xs font-medium mb-3 ${
                                    summary.impact === 'Governance' ? 'text-blue-600' :
                                    summary.impact === 'Workers' ? 'text-green-600' :
                                    summary.impact === 'Community' ? 'text-orange-600' :
                                    summary.impact === 'Environment' ? 'text-purple-600' :
                                    'text-indigo-600'
                                  }`}>
                                    {summary.pct}% Complete
                                  </div>
                                 
                                 {/* Top Task Titles */}
                                 <div className="flex-1 space-y-1">
                                   {impactTodos.length > 0 ? (
                                     impactTodos.map((todo) => (
                                       <button
                                         key={todo.id}
                                         onClick={() => navigate('/tasks')}
                                         className="block w-full text-left text-xs text-muted-foreground hover:text-primary hover:bg-secondary/50 p-1 rounded transition-colors truncate"
                                         title={todo.title}
                                       >
                                         • {todo.title}
                                       </button>
                                     ))
                                   ) : (
                                     <p className="text-xs text-muted-foreground">All tasks complete! 🎉</p>
                                   )}
                                 </div>
                                 
                                 <Button 
                                   variant="outline" 
                                   size="sm" 
                                   onClick={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                                   className="w-full mt-2 text-xs hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-300"
                                 >
                                   View Details
                                 </Button>
                               </div>
                             </Card>
                           );
                         })}
                         
                         {/* Other Category - Separate */}
                         {impactSummaries.find(s => s.impact === 'Other') && (
                           <Card className="aspect-square p-4 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 border border-muted hover:border-primary/30 bg-gradient-to-br from-white to-white/50">
                             <div className="h-full flex flex-col">
                               <div className="flex items-center gap-2 mb-3">
                                 <div className="w-3 h-3 rounded-full bg-gray-600" />
                                 <h3 className="font-semibold text-sm truncate">Other</h3>
                               </div>
                               
                               <div className="w-full bg-secondary rounded-full h-2 mb-3">
                                 <div 
                                   className="h-2 rounded-full transition-all duration-500 bg-gray-600"
                                   style={{ width: `${impactSummaries.find(s => s.impact === 'Other')?.pct || 0}%` }}
                                 />
                               </div>
                               
                               <div className="text-xs font-medium mb-3 text-gray-600">
                                 {impactSummaries.find(s => s.impact === 'Other')?.pct || 0}% Complete
                               </div>
                               
                               <div className="flex-1">
                                 <p className="text-xs text-muted-foreground">Additional documents and benefits</p>
                               </div>
                               
                               <Button 
                                 variant="outline" 
                                 size="sm" 
                                 onClick={() => navigate('/impact/other')}
                                 className="w-full mt-2 text-xs hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-300"
                               >
                                 View Details
                               </Button>
                             </div>
                           </Card>
                         )}
                      </div>
                    </section>

                    {/* Priority Tasks To Do - Expanded */}
                    <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Priority Tasks</h3>
                          <p className="text-muted-foreground">
                            Top priority items to advance your B Corp readiness
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <AIChatIcon 
                            onClick={() => console.log('AI Chat for Dashboard')}
                            size="md"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleTestReset}
                            className="shrink-0"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Test Reset
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={resetAllTestData}
                            className="shrink-0 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset All Data (Global)
                          </Button>
                        </div>
                      </div>
                      
                      <ScrollArea className="h-96">
                        <div className="space-y-3 pr-4">
                          {quickTodos.length > 0 ? (
                            quickTodos.slice(0, 4).map((todo) => (
                              <div key={todo.id} className="bg-white/60 rounded-lg p-4">
                                <TodoItem
                                  todo={todo}
                                  onToggleStatus={(status) => handleTodoToggle(todo.id, status)}
                                  onUploadEvidence={() => handleUploadEvidence(todo)}
                                />
                              </div>
                            ))
                          ) : (
                            <div className="bg-white/60 rounded-lg p-6 text-center">
                              <p className="text-muted-foreground">No priority tasks at the moment</p>
                            </div>
                          )}
                          {quickTodos.length > 4 && (
                            <div className="text-center pt-4">
                              <p className="text-sm text-muted-foreground">
                                +{quickTodos.length - 4} more tasks
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      
                      <div className="mt-6 text-center">
                        <Button asChild variant="outline">
                          <Link to={`/business/${currentBusiness.id}/roadmap`}>
                            View All Tasks
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </section>
                  </>
                ) : (
                  <EmptyState
                    title="Select a Business"
                    description="Choose a business from the sidebar to view its dashboard."
                    ctaLabel="Create New Business"
                    onCta={() => {}}
                  />
                )}
              </div>
            </div>
            </main>
          </div>
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
        
        {/* Upload Modal */}
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onFilesAdd={(files) => {
            console.log('Files uploaded:', files);
          }}
        />
        
        <CompanyCreationModal
          open={companyModalOpen}
          onClose={() => setCompanyModalOpen(false)}
        />
      </SidebarProvider>
    );
  };

export default Dashboard;