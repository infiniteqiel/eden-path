import { useEffect, useState } from 'react';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Basic health checks
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
        const connectionType = (navigator as any).connection?.effectiveType || 'unknown';
        
        setStatus('healthy');
        console.log('Health Check:', {
          memory: memoryUsage,
          connection: connectionType,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        setStatus('error');
        console.error('Health check failed:', error);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">System Health Check</h1>
        <p className="text-lg">Status: <span className={status === 'healthy' ? 'text-green-600' : 'text-red-600'}>{status}</span></p>
      </div>
    </div>
  );
};

export default HealthCheck;