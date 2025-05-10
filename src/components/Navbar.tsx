
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <header className="bg-white border-b border-border py-2 px-4 flex items-center justify-between">
      {/* Left Section - Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-1 bg-muted/50 rounded-md focus:outline-none focus:ring-1 focus:ring-ring w-48 lg:w-64"
          />
        </div>
      </div>
      
      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative rounded-full" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-brand-500 text-white">UM</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">User Manager</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
                <div className="mt-4 border-t pt-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button variant="default" className="bg-brand-500 hover:bg-brand-600" onClick={handleLogin}>
            <User className="h-4 w-4 mr-2" /> Log In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
