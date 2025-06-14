'use client';

import { Home, BarChart3, Calendar, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Navigation = ({ activeView, setActiveView }: NavigationProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    { id: 'today', label: 'Today', icon: Home, path: '/' },
    { id: 'insights', label: 'Insights', icon: BarChart3, path: '/' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const handleNavigation = (item: { id: string; path: string }) => {
    if (item.path === '/') {
      setActiveView(item.id);
      if (pathname !== '/') {
        router.push('/');
      }
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Happiness Tracker</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = 
                (pathname === item.path && activeView === item.id) || 
                (item.path === '/calendar' && pathname === '/calendar') ||
                (item.path === '/profile' && pathname === '/profile') ||
                (item.id === activeView && pathname === '/');
                
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className={`flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Link href={item.path} onClick={() => handleNavigation(item)}>
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
