/**
 * Dashboard Page
 * 
 * Main dashboard showing business overview and progress across Impact Areas.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { ImpactCard } from '@/components/impact-card';
import { TodoItem } from '@/components/todo-item';
import { EmptyState } from '@/components/empty-state';
import { UploadDropzone } from '@/components/upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { Upload, FileText, ArrowRight, Building, Leaf, Users } from 'lucide-react';

const Dashboard = () => {
  const { businesses, currentBusiness, loadBusinesses, selectBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, updateTodoStatus } = useAnalysisStore();

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
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold">Dashboard</h1>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-8">
                {currentBusiness ? (
                  <>
                    {/* Impact Cards - One Row, Square Layout */}
                    <section>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">B Corp Progress</h2>
                        <p className="text-muted-foreground">
                          Track your advancement across the five key impact areas
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {impactSummaries.map((summary) => (
                          <ImpactCard
                            key={summary.impact}
                            summary={summary}
                            onViewTasks={() => {
                              console.log(`Viewing completed tasks for ${summary.impact}`);
                            }}
                            className="aspect-square"
                          />
                        ))}
                      </div>
                    </section>

                    {/* Upload Documents Section */}
                    <section className="bg-muted/30 rounded-xl p-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
                        <p className="text-muted-foreground">
                          Upload your business documents for AI analysis
                        </p>
                      </div>
                      <UploadDropzone
                        onFilesAdd={(files) => {
                          console.log('Files uploaded:', files);
                        }}
                      />
                    </section>

                    {/* Priority Tasks To Do */}
                    <section>
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">Priority Tasks</h3>
                        <p className="text-muted-foreground">
                          Top priority items to advance your B Corp readiness
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {quickTodos.length > 0 ? (
                          quickTodos.map((todo) => (
                            <TodoItem
                              key={todo.id}
                              todo={todo}
                              onToggleStatus={(status) => handleTodoToggle(todo.id, status)}
                            />
                          ))
                        ) : (
                          <Card className="p-6 text-center">
                            <p className="text-muted-foreground">No priority tasks at the moment</p>
                          </Card>
                        )}
                      </div>
                      
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
    </SidebarProvider>
  );
};

export default Dashboard;