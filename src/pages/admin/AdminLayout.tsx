import { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Settings,
  PanelBottom,
  Calendar,
  ClipboardList,
  Newspaper,
  Megaphone,
  Image as ImageIcon,
  UserCheck,
  MessageSquare,
  Users,
  User as UserIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";

const groups = [
  {
    label: "Dashboard",
    items: [{ to: "/admin", label: "Overview", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Site content",
    items: [
      { to: "/admin/homepage", label: "Homepage", icon: HomeIcon },
      { to: "/admin/settings", label: "Site Settings", icon: Settings },
      { to: "/admin/footer", label: "Footer", icon: PanelBottom },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/admin/events", label: "Events", icon: Calendar },
      { to: "/admin/rsvps", label: "RSVPs", icon: ClipboardList },
      { to: "/admin/news", label: "News", icon: Newspaper },
      { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/admin/memberships", label: "Memberships", icon: UserCheck },
      { to: "/admin/contacts", label: "Messages", icon: MessageSquare },
      { to: "/admin/users", label: "Users & Roles", icon: Users },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/admin/profile", label: "My Profile", icon: UserIcon }],
  },
];

export const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-3 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <Logo variant="navbar" className="h-10 w-auto" />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {groups.map((g) => (
              <SidebarGroup key={g.label}>
                <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {g.items.map((item) => (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.to}
                            end={(item as any).end}
                            className={({ isActive }) =>
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                : ""
                            }
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-background border-b border-border flex items-center px-4 gap-3 sticky top-0 z-20">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="font-display font-bold text-primary text-lg">Admin</h1>
            </div>
            <span className="hidden md:inline text-sm text-muted-foreground">{user?.email}</span>
            <Button asChild variant="outline" size="sm">
              <Link to="/"><ExternalLink className="h-4 w-4 mr-1" /> View site</Link>
            </Button>
            <Button onClick={signOut} size="sm" variant="destructive">
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
