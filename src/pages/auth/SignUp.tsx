/**
 * Sign Up Page
 * 
 * User registration with B Corp context and enhanced media experience.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';
import { RotatingBCorpFacts } from '@/components/rotating-bcorp-facts';
import { useAuthStore } from '@/store/auth';
import { Building, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-utopia.jpg';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.name);
      toast({
        title: 'Welcome to bcstart.ai!',
        description: 'Your account has been created successfully.',
      });
      navigate('/');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const isValid = formData.name && formData.email && formData.password && formData.confirmPassword;

  return (
    <div className="min-h-screen bg-background relative">
      <AppHeader mode="public" />
      
      {/* Background Hero Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
      </div>
      
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Column - Rotating B Corp Facts */}
          <div className="hidden lg:block">
            <RotatingBCorpFacts />
          </div>
          
          {/* Right Column - Sign Up Form */}
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="mb-6">
              <Button variant="ghost" asChild className="mb-4 text-white/80 hover:text-white hover:bg-white/10">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to home
                </Link>
              </Button>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Join the B Corp Movement</CardTitle>
                <CardDescription>
                  Create your account and start building a purpose-driven business
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

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
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
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
                    {isLoading ? 'Creating Account...' : 'Start Your B Corp Journey'}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/auth/signin" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-xs text-white/80">
              <p>
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="hover:underline text-white">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="hover:underline text-white">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;