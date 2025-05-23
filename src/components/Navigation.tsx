
import { Home, BarChart3, Calendar, Settings, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Navigation = ({ activeView, setActiveView }: NavigationProps) => {
  const navItems = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Serenity
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 ${
                  activeView === item.id 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
