import { LayoutDashboard, Car, Settings, LogOut, UserCircle, Users, ChevronDown, Shield, Lock } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function AppSidebar() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [adminOpen, setAdminOpen] = useState(
    location.pathname === '/users' || location.pathname === '/roles' || location.pathname === '/permissions'
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { title: t.nav.dashboard, url: '/', icon: LayoutDashboard },
    { title: t.nav.vehicles, url: '/vehicles', icon: Car },
    { title: t.profile.title, url: '/profile', icon: UserCircle },
    { title: t.nav.settings, url: '/settings', icon: Settings },
  ];

  const adminSubItems = [
    { title: t.users.title, url: '/users', icon: Users },
    { title: t.roles.title, url: '/roles', icon: Shield },
    { title: t.perms.title, url: '/permissions', icon: Lock },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">FleetManager</h1>
            <p className="text-xs text-sidebar-foreground/60">Pro Edition</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Admin submenu */}
              <SidebarMenuItem>
                <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      <div className="flex items-center gap-3 px-3 py-2">
                        <Settings className="w-5 h-5" />
                        <span>{t.users.permissions}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="pl-4">
                      {adminSubItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === item.url}
                            className="w-full"
                          >
                            <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                              <item.icon className="w-5 h-5" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenuButton className="w-full" onClick={handleLogout}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span>{t.nav.logout}</span>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
