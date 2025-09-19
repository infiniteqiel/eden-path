/**
 * Tasks Page
 * 
 * Comprehensive task management for B Corp readiness.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { TodoItem } from '@/components/todo-item';
import { ExpandableTaskModal } from '@/components/expandable-task-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { Todo } from '@/domain/data-contracts';
import { CheckSquare2, Clock, AlertCircle, Filter, RotateCcw, Home } from 'lucide-react';
import { AIChatIcon } from '@/components/ai-chat-icon';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Tasks = () => {
  const navigate = useNavigate();
  const { currentBusiness } = useBusinessStore();
  const { todos, binnedTodos, loadTodos, loadBinnedTodos, updateTodoStatus, resetTestData, restoreTask } = useAnalysisStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [expandedTask, setExpandedTask] = useState<Todo | null>(null);
  const [isResetting, setIsResetting] = React.useState(false);

  useEffect(() => {
    if (currentBusiness) {
      loadTodos(currentBusiness.id);
      loadBinnedTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadTodos, loadBinnedTodos]);

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadTodos(currentBusiness.id);
    }
  };

  const handleTestReset = async () => {
    if (!currentBusiness || isResetting) return;
    
    setIsResetting(true);
    
    try {
      console.log('Starting test reset from Tasks page:', currentBusiness.id);
      await resetTestData(currentBusiness.id);
      
      // Reload tasks after reset
      await loadTodos(currentBusiness.id);
      
      console.log('✓ Tasks page test reset complete');
    } catch (error) {
      console.error('Tasks page test reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = filterStatus === 'all' || todo.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || todo.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const todosByStatus = {
    todo: filteredTodos.filter(t => t.status === 'todo'),
    in_progress: filteredTodos.filter(t => t.status === 'in_progress'),
    done: filteredTodos.filter(t => t.status === 'done'),
    blocked: filteredTodos.filter(t => t.status === 'blocked'),
  };

  const todosByImpact = {
    Governance: filteredTodos.filter(t => t.impact === 'Governance'),
    Workers: filteredTodos.filter(t => t.impact === 'Workers'),
    Community: filteredTodos.filter(t => t.impact === 'Community'),
    Environment: filteredTodos.filter(t => t.impact === 'Environment'),
    Customers: filteredTodos.filter(t => t.impact === 'Customers'),
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <header 
            className="h-16 flex items-center border-b px-2 md:px-4 relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)), url(${singaporeCityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <SidebarTrigger />
            <div className="ml-2 md:ml-4 flex items-center justify-between w-full">
              <div className="flex items-center gap-2 md:gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-xs md:text-sm"
                >
                  Dashboard
                </Button>
                <h1 className="font-bold text-sm md:text-lg">Tasks - B Corp Roadmap</h1>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs md:text-sm"
              >
                <Home className="w-3 h-3 md:w-4 md:h-4" />
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
            <div className="container mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 w-full overflow-x-hidden">
              <div className="space-y-4 md:space-y-6 lg:space-y-8">
                {/* Header with Actions */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-2">Task Management</h2>
                      <p className="text-muted-foreground text-sm md:text-base">
                        Track and manage your B Corp readiness tasks across all impact areas
                      </p>
                    </div>
                    <Button 
                      onClick={handleTestReset} 
                      variant="outline" 
                      size="sm" 
                      className="text-sm"
                      disabled={isResetting}
                    >
                      <RotateCcw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">{isResetting ? 'Resetting...' : 'Reset Tasks'}</span>
                      <span className="sm:hidden">{isResetting ? 'Resetting' : 'Reset'}</span>
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="text-sm font-medium">Status:</span>
                      <div className="flex flex-wrap gap-1">
                        {['all', 'todo', 'in_progress', 'done', 'blocked'].map(status => (
                          <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                            className="text-xs"
                          >
                            {status.replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">Priority:</span>
                      <div className="flex flex-wrap gap-1">
                        {['all', 'P1', 'P2', 'P3'].map(priority => (
                          <Button
                            key={priority}
                            variant={filterPriority === priority ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterPriority(priority)}
                            className="text-xs"
                          >
                            {priority}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Task Views */}
                <Tabs defaultValue="status" className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <TabsList>
                    <TabsTrigger value="status">By Status</TabsTrigger>
                    <TabsTrigger value="impact">By Impact Area</TabsTrigger>
                    <TabsTrigger value="binned">Binned Tasks</TabsTrigger>
                  </TabsList>

                  <TabsContent value="status" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(todosByStatus).map(([status, statusTodos]) => (
                        <Card key={status} className="p-4 bg-white/60">
                          <div className="flex items-center gap-2 mb-4">
                            {status === 'todo' && <CheckSquare2 className="h-4 w-4" />}
                            {status === 'in_progress' && <Clock className="h-4 w-4" />}
                            {status === 'done' && <CheckSquare2 className="h-4 w-4 text-green-600" />}
                            {status === 'blocked' && <AlertCircle className="h-4 w-4 text-red-600" />}
                            <h3 className="font-semibold capitalize">{status.replace('_', ' ')}</h3>
                            <Badge variant="secondary">{statusTodos.length}</Badge>
                          </div>
                          <div className="space-y-3">
                            {statusTodos.map(todo => (
                              <div key={todo.id} className="bg-white/80 rounded p-3 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTask(todo)}>
                                <TodoItem
                                  todo={todo}
                                  onToggleStatus={(newStatus) => handleTodoToggle(todo.id, newStatus)}
                                  showImpact
                                />
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="impact" className="space-y-6">
                    <div className="space-y-6">
                      {Object.entries(todosByImpact).map(([impact, impactTodos]) => (
                        <Card key={impact} className="p-6 bg-white/60">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{impact}</h3>
                            <Badge variant="outline">{impactTodos.length} tasks</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {impactTodos.map(todo => (
                              <div key={todo.id} className="bg-white/80 rounded p-3 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setExpandedTask(todo)}>
                                <TodoItem
                                  todo={todo}
                                  onToggleStatus={(newStatus) => handleTodoToggle(todo.id, newStatus)}
                                />
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="binned" className="space-y-6">
                    <Card className="p-6 bg-white/60">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Deleted Tasks</h3>
                        <Badge variant="outline">{binnedTodos.length} tasks</Badge>
                      </div>
                      {binnedTodos.length > 0 ? (
                        <div className="space-y-4">
                          {binnedTodos.map(todo => (
                            <div key={todo.id} className="bg-white/80 rounded p-4 border-l-4 border-red-200">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <TodoItem
                                    todo={todo}
                                    onToggleStatus={() => {}} // Disabled for binned tasks
                                    showImpact
                                    disabled={true}
                                  />
                                  {todo.deletedAt && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Deleted on {new Date(todo.deletedAt).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    await restoreTask(todo.id);
                                    if (currentBusiness) {
                                      loadTodos(currentBusiness.id);
                                      loadBinnedTodos(currentBusiness.id);
                                    }
                                  }}
                                  className="ml-4"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Restore
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No deleted tasks</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Deleted tasks will appear here and can be restored
                          </p>
                        </div>
                      )}
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Expandable Task Modal */}
      {expandedTask && (
        <ExpandableTaskModal
          isOpen={!!expandedTask}
          onClose={() => setExpandedTask(null)}
          todo={expandedTask}
          onToggleStatus={(status) => {
            handleTodoToggle(expandedTask.id, status);
            setExpandedTask(null);
          }}
          onDelete={() => {
            if (currentBusiness) {
              loadTodos(currentBusiness.id);
              loadBinnedTodos(currentBusiness.id);
            }
            setExpandedTask(null);
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default Tasks;