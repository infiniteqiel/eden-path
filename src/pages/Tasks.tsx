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
  const { todos, loadTodos, updateTodoStatus, resetTestData } = useAnalysisStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [expandedTask, setExpandedTask] = useState<Todo | null>(null);

  useEffect(() => {
    if (currentBusiness) {
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadTodos]);

  const handleTodoToggle = async (todoId: string, status: Todo['status']) => {
    await updateTodoStatus(todoId, status);
    if (currentBusiness) {
      loadTodos(currentBusiness.id);
    }
  };

  const handleTestReset = () => {
    if (currentBusiness) {
      resetTestData(currentBusiness.id);
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
              <h1 className="font-bold text-lg">Tasks - B Corp Roadmap</h1>
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
                {/* Header with Actions */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Task Management</h2>
                      <p className="text-muted-foreground">
                        Track and manage your B Corp readiness tasks across all impact areas
                      </p>
                    </div>
                    <Button onClick={handleTestReset} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Tasks
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="text-sm font-medium">Status:</span>
                      <div className="flex gap-1">
                        {['all', 'todo', 'in_progress', 'done', 'blocked'].map(status => (
                          <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                          >
                            {status.replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Priority:</span>
                      <div className="flex gap-1">
                        {['all', 'P1', 'P2', 'P3'].map(priority => (
                          <Button
                            key={priority}
                            variant={filterPriority === priority ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterPriority(priority)}
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
        />
      )}
    </SidebarProvider>
  );
};

export default Tasks;