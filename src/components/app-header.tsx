/**
 * App Header Component
 * 
 * Handles both public and authenticated header states.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BusinessSwitcher } from '@/components/business-switcher';
import { Upload, Copy, User, LogOut, Settings, Building } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth';
import { useBusinessStore } from '@/store/business';
import { Business } from '@/domain/data-contracts';

interface AppHeaderProps {
  mode: 'public' | 'auth';
  onUpload?: () => void;
  onCopyText?: () => void;
}

export function AppHeader({ mode, onUpload, onCopyText }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { currentBusiness, businesses } = useBusinessStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleBusinessChange = (business: Business) => {
    // Navigate to dashboard with new business
    navigate(`/dashboard`);
  };

  if (mode === 'public') {
    return (
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">bcstart.ai</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Button asChild>
              <Link to="/auth/signup">Sign up</Link>
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">bcstart.ai</span>
          </Link>

          {currentBusiness && (
            <BusinessSwitcher 
              businesses={businesses}
              currentBusiness={currentBusiness}
              onBusinessChange={handleBusinessChange}
            />
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Upload and Copy buttons for dataroom pages */}
          {onUpload && (
            <Button variant="outline" size="sm" onClick={onUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          )}
          
          {onCopyText && (
            <Button variant="outline" size="sm" onClick={onCopyText}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
          )}

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

/**
 * Mission Snippet Component
 * 
 * Shows beneath the authenticated header to reinforce B Corp mission.
 */
export function MissionSnippet() {
  return (
    <div className="mission-snippet">
      <p>
        <strong>B Corps</strong> are companies that meet high standards of social and environmental performance, 
        accountability, and transparency. This workspace helps your UK business build those practices step by step — 
        document-first, with clear actions across Governance, Workers, Community, Environment, and Customers.
      </p>
    </div>
  );
}