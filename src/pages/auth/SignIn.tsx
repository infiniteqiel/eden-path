/**
 * Sign In Page
 * 
 * User authentication with demo credentials helper.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';
import { useAuthStore } from '@/store/auth';
import { Building, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isLoading, error, clearError, user } = useAuthStore();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(formData.email, formData.password);
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
      navigate('/');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'sarah@example.com',
      password: 'password123'
    });
  };

  const isValid = formData.email && formData.password;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader mode="public" />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to continue your B Corp journey
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/auth/forgot-password" 
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SignIn;