/**
 * Progress Page
 * 
 * Detailed progress tracking and analytics for B Corp readiness.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { ImpactCard } from '@/components/impact-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessStore } from '@/store/business';
import { useAnalysisStore } from '@/store/analysis';
import { TrendingUp, Target, Calendar, Award, RotateCcw, MessageSquare } from 'lucide-react';
import singaporeCityscape from '@/assets/singapore-cityscape.jpg';

const Progress = () => {
  const navigate = useNavigate();
  const { currentBusiness } = useBusinessStore();
  const { impactSummaries, todos, loadImpactSummaries, loadTodos, resetTestData } = useAnalysisStore();
  const [isResetting, setIsResetting] = React.useState(false);

  useEffect(() => {
    if (currentBusiness) {
      loadImpactSummaries(currentBusiness.id);
      loadTodos(currentBusiness.id);
    }
  }, [currentBusiness, loadImpactSummaries, loadTodos]);

  const handleTestReset = async () => {
    if (!currentBusiness || isResetting) return;
    
    setIsResetting(true);
    
    try {
      console.log('Starting test reset from Progress page:', currentBusiness.id);
      await resetTestData(currentBusiness.id);
      
      // Reload data after reset
      await Promise.all([
        loadTodos(currentBusiness.id),
        loadImpactSummaries(currentBusiness.id)
      ]);
      
      console.log('✓ Progress page test reset complete');
    } catch (error) {
      console.error('Progress page test reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const overallProgress = impactSummaries.reduce((acc, summary) => acc + summary.pct, 0) / impactSummaries.length || 0;
  const completedTasks = todos.filter(t => t.status === 'done').length;
  const totalTasks = todos.length;
  const highPriorityPending = todos.filter(t => t.priority === 'P1' && t.status !== 'done').length;

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
            <h1 className="ml-4 font-bold text-lg">Progress - B Corp Analytics</h1>
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
                {/* Overview Metrics */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Progress Overview</h2>
                      <p className="text-muted-foreground">
                        Track your B Corp certification readiness across all dimensions
                      </p>
                    </div>
                    <Button 
                      onClick={handleTestReset} 
                      variant="outline"
                      disabled={isResetting}
                    >
                      <RotateCcw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                      {isResetting ? 'Resetting...' : 'Reset Progress'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-white/60">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
                        <p className="text-xs text-muted-foreground">Across all impact areas</p>
                        <ProgressBar value={overallProgress} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">Total roadmap items</p>
                        <ProgressBar value={(completedTasks / totalTasks) * 100} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{highPriorityPending}</div>
                        <p className="text-xs text-muted-foreground">P1 tasks remaining</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{Math.round(overallProgress * 0.8)}/80</div>
                        <p className="text-xs text-muted-foreground">Estimated BIA points</p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Impact Area Progress */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Impact Area Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {impactSummaries.map((summary) => (
                      <div key={summary.impact} className="bg-white/60 rounded-lg p-4">
                        <ImpactCard
                          summary={summary}
                          onViewTasks={() => navigate(`/impact/${summary.impact.toLowerCase()}`)}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Detailed Progress Charts */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">Detailed Analytics</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Progress by Priority */}
                    <Card className="bg-white/60">
                      <CardHeader>
                        <CardTitle>Progress by Priority</CardTitle>
                        <CardDescription>Task completion across priority levels</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {['P1', 'P2', 'P3'].map(priority => {
                          const priorityTodos = todos.filter(t => t.priority === priority);
                          const completed = priorityTodos.filter(t => t.status === 'done').length;
                          const total = priorityTodos.length;
                          const percentage = total > 0 ? (completed / total) * 100 : 0;
                          
                          return (
                            <div key={priority} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{priority} Priority</span>
                                <span>{completed}/{total} ({Math.round(percentage)}%)</span>
                              </div>
                              <ProgressBar value={percentage} />
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>

                    {/* Progress by Impact Area */}
                    <Card className="bg-white/60">
                      <CardHeader>
                        <CardTitle>Tasks by Impact Area</CardTitle>
                        <CardDescription>Distribution of tasks across B Corp areas</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {impactSummaries.map(summary => {
                          const areaTodos = todos.filter(t => t.impact === summary.impact);
                          const completed = areaTodos.filter(t => t.status === 'done').length;
                          const total = areaTodos.length;
                          const percentage = total > 0 ? (completed / total) * 100 : 0;
                          
                          return (
                            <div key={summary.impact} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{summary.impact}</span>
                                <span>{completed}/{total} ({Math.round(percentage)}%)</span>
                              </div>
                              <ProgressBar value={percentage} />
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Next Steps */}
                <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                   <h3 className="text-xl font-bold mb-4">Recommended Next Steps</h3>
                  <div className="space-y-4">
                    {highPriorityPending > 0 && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900">Focus on High Priority Tasks</p>
                          <p className="text-sm text-red-700">
                            You have {highPriorityPending} P1 priority tasks that need immediate attention.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {overallProgress < 50 && (
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-900">Upload More Documents</p>
                          <p className="text-sm text-yellow-700">
                            Consider uploading additional business documents to improve your readiness assessment.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {overallProgress >= 70 && (
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <Award className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-900">Great Progress!</p>
                          <p className="text-sm text-green-700">
                            You're well on your way to B Corp readiness. Consider scheduling your formal assessment.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">Get AI Analysis</p>
                        <p className="text-sm text-blue-700 mb-3">
                          Chat with our AI specialist for personalized insights and recommendations.
                        </p>
                        <Button 
                          size="sm"
                          onClick={() => navigate('/dashboard')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Start AI Analysis Chat
                        </Button>
                      </div>
                    </div>
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

export default Progress;