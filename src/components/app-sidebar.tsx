/**
 * App Sidebar Component
 * 
 * Sidebar for the dashboard with business switcher and navigation.
 */

import React from 'react';
import { Building2, Home, FileText, CheckSquare2, Users, Leaf, Target, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SimpleBusinessSwitcher } from '@/components/simple-business-switcher';
import { CompanyCreationModal } from '@/components/company-creation-modal';
import { useBusinessStore } from '@/store/business';
import { useBusinessContext } from '@/hooks/use-business-context';
import { Business } from '@/domain/data-contracts';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { businesses, selectBusiness } = useBusinessStore();
  const { currentBusiness } = useBusinessContext();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [companyModalOpen, setCompanyModalOpen] = React.useState(false);

  const handleBusinessChange = async (business: Business) => {
    await selectBusiness(business.id);
  };

  const navigationItems = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Company Profile', url: '/company-profile', icon: Building2 },
    { title: 'Documents', url: '/documents', icon: FileText },
    { title: 'Tasks', url: '/tasks', icon: CheckSquare2 },
    { title: 'Progress', url: '/progress', icon: Target },
  ];

  return (
    <Sidebar className={cn(
      isCollapsed ? "w-16" : "w-64"
    )} collapsible="icon" style={{ backgroundColor: '#ffffff' }}>
      <SidebarContent>
        {/* Business Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Business
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-2">
              {!isCollapsed && (
                <SimpleBusinessSwitcher
                  businesses={businesses}
                  currentBusiness={currentBusiness}
                  onBusinessChange={handleBusinessChange}
                />
              )}
              {isCollapsed && currentBusiness && (
                <div className="flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Impact Areas */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Impact Areas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/impact/governance" className="flex items-center gap-3">
                    <Building2 className="h-4 w-4" />
                    {!isCollapsed && <span>Governance</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/impact/workers" className="flex items-center gap-3">
                    <Users className="h-4 w-4" />
                    {!isCollapsed && <span>Workers</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/impact/community" className="flex items-center gap-3">
                    <Target className="h-4 w-4" />
                    {!isCollapsed && <span>Community</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/impact/environment" className="flex items-center gap-3">
                    <Leaf className="h-4 w-4" />
                    {!isCollapsed && <span>Environment</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/impact/customers" className="flex items-center gap-3">
                    <CheckSquare2 className="h-4 w-4" />
                    {!isCollapsed && <span>Customers</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Other Category */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Other
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/impact/other" className="flex items-center gap-3">
                    <Plus className="h-4 w-4" />
                    {!isCollapsed && <span>Other & Extra Benefits</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <CompanyCreationModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
      />
    </Sidebar>
  );
}