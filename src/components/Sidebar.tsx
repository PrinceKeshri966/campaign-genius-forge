
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  ChevronLeft, 
  Home, 
  ListFilter, 
  MailCheck, 
  Settings, 
  Users 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/segments', icon: ListFilter, label: 'Segments' },
    { path: '/campaigns', icon: MailCheck, label: 'Campaigns' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/analytics', icon: BarChart, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  // In mobile view, clicking a link should close the sidebar
  const handleLinkClick = isMobile ? onToggle : undefined;
  
  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen flex-shrink-0 transition-all duration-300 border-r border-sidebar-border flex flex-col",
        open ? "w-64" : "w-[70px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 border-b border-sidebar-border flex items-center px-4">
        {open ? (
          <h1 className="font-bold text-xl text-brand-500">CampaignGenius</h1>
        ) : (
          <h1 className="font-bold text-xl text-brand-500">CG</h1>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path}
            onClick={handleLinkClick}
            className={cn(
              "crm-sidebar-item",
              location.pathname === item.path ? "active" : "",
              !open && "justify-center px-2"
            )}
          >
            <item.icon className="h-5 w-5" />
            {open && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      
      {/* Toggle Button */}
      <div className="p-2 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle} 
          className="w-full flex items-center justify-center h-10 rounded-md hover:bg-sidebar-accent"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-all", !open && "rotate-180")} />
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
