/**
 * Dashboard Page
 * 
 * Main dashboard showing business overview and progress across Impact Areas.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader, MissionSnippet } from '@/components/app-header';
import { BusinessSwitcher } from '@/components/business-switcher';
import { ImpactCard } from '@/components/impact-card';
import { TodoItem } from '@/components/todo-item';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { Upload, FileText } from 'lucide-react';

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
      <div className="min-h-screen bg-background">
        <AppHeader mode="auth" />
        <main className="container mx-auto px-4 py-8">
          <EmptyState
            title="Welcome to bcstart.ai"
            description="Let's get started by setting up your first business profile."
            ctaLabel="Create Business"
            onCta={() => {}}
          />
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        {/* Global trigger that is ALWAYS visible */}
        <div className="fixed top-4 left-4 z-50">
          <SidebarTrigger />
        </div>
        
        <AppSidebar />
        
        <div className="flex-1">
          <AppHeader mode="auth" />
          <MissionSnippet />

          <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            </div>
            
            {currentBusiness && (
              <div className="flex gap-3">
                <Button asChild>
                  <Link to={`/business/${currentBusiness.id}/dataroom`}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {currentBusiness ? (
            <>
              {/* Progress Overview */}
              <section>
                <h2 className="text-xl font-semibold mb-6">Progress Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {impactSummaries.map((summary) => (
                      <ImpactCard
                        key={summary.impact}
                        summary={summary}
                        onViewTasks={() => {
                          // Show completed tasks for this impact area
                          console.log(`Viewing completed tasks for ${summary.impact}`);
                        }}
                      />
                    ))}
                </div>
              </section>

              {/* Quick To-Dos */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Quick To-Dos</h2>
                  <Button variant="outline" asChild>
                    <Link to={`/business/${currentBusiness.id}/roadmap`}>
                      View All
                    </Link>
                  </Button>
                </div>

                {quickTodos.length > 0 ? (
                  <div className="grid gap-3">
                    {quickTodos.slice(0, 5).map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleStatus={(status) => handleTodoToggle(todo.id, status)}
                        onViewEvidence={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ready to Begin?</CardTitle>
                      <CardDescription>
                        Start by uploading your business documents to generate personalized action items.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-3">
                      <Button asChild>
                        <Link to={`/business/${currentBusiness.id}/dataroom`}>
                          <FileText className="h-4 w-4 mr-2" />
                          Upload Documents
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to={`/business/${currentBusiness.id}/roadmap`}>
                          View Sample Tasks
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </section>
            </>
          ) : (
            <EmptyState
              title="Select a Business"
              description="Choose a business from the dropdown above to view its dashboard."
              ctaLabel="Create New Business"
              onCta={() => {}}
            />
          )}
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// App Sidebar Component for Dashboard
function AppSidebar() {
  const { businesses, currentBusiness, selectBusiness } = useBusinessStore();

  return (
    <Sidebar className="w-60" collapsible="offcanvas">
      <SidebarContent>
        <div className="p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">SELECT BUSINESS</h3>
          {businesses.length > 0 && (
            <BusinessSwitcher
              businesses={businesses}
              currentBusiness={currentBusiness}
              onBusinessChange={(business) => selectBusiness(business.id)}
            />
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default Dashboard;