/**
 * App Sidebar Component
 * 
 * Sidebar for the dashboard with business switcher and navigation.
 */

import React from 'react';
import { Building2, Home, FileText, CheckSquare2, Users, Leaf, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessSwitcher } from '@/components/business-switcher';
import { useBusinessStore } from '@/store/business';
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
  const { businesses, currentBusiness, selectBusiness } = useBusinessStore();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const navigationItems = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Documents', url: '/documents', icon: FileText },
    { title: 'Tasks', url: '/tasks', icon: CheckSquare2 },
    { title: 'Progress', url: '/progress', icon: Target },
  ];

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Business Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Business
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-2">
              {!isCollapsed && (
                <BusinessSwitcher
                  businesses={businesses}
                  currentBusiness={currentBusiness}
                  onBusinessChange={(business) => selectBusiness(business.id)}
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
                <SidebarMenuButton>
                  <Building2 className="h-4 w-4" />
                  {!isCollapsed && <span>Governance</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users className="h-4 w-4" />
                  {!isCollapsed && <span>Workers</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Target className="h-4 w-4" />
                  {!isCollapsed && <span>Community</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Leaf className="h-4 w-4" />
                  {!isCollapsed && <span>Environment</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CheckSquare2 className="h-4 w-4" />
                  {!isCollapsed && <span>Customers</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}