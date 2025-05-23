
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Timer, Droplets, Utensils, Moon, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WellnessItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  hasInput: boolean;
  inputType?: 'number' | 'time';
  inputValue?: string;
  unit?: string;
  placeholder?: string;
}

interface WellnessChecklistProps {
  onProgressUpdate: (progress: number) => void;
}

const WellnessChecklist = ({ onProgressUpdate }: WellnessChecklistProps) => {
  const [wellnessItems, setWellnessItems] = useState<WellnessItem[]>([
    {
      id: 'meditation',
      label: 'Meditated today',
      icon: Circle,
      completed: false,
      hasInput: true,
      inputType: 'number',
      unit: 'minutes',
      placeholder: '10'
    },
    {
      id: 'sleep',
      label: 'Slept 8+ hours',
      icon: Moon,
      completed: false,
      hasInput: true,
      inputType: 'number',
      unit: 'hours',
      placeholder: '8'
    },
    {
      id: 'exercise',
      label: 'Exercised today',
      icon: Activity,
      completed: false,
      hasInput: true,
      inputType: 'number',
      unit: 'minutes',
      placeholder: '30'
    },
    {
      id: 'water',
      label: 'Drank 2+ liters of water',
      icon: Droplets,
      completed: false,
      hasInput: true,
      inputType: 'number',
      unit: 'liters',
      placeholder: '2'
    },
    {
      id: 'healthy_meals',
      label: 'Ate healthy meals',
      icon: Utensils,
      completed: false,
      hasInput: false
    },
    {
      id: 'wake_time',
      label: 'Woke up on time',
      icon: Timer,
      completed: false,
      hasInput: true,
      inputType: 'time',
      placeholder: '07:00'
    }
  ]);

  const toggleItem = (id: string) => {
    setWellnessItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const updateItemInput = (id: string, value: string) => {
    setWellnessItems(items =>
      items.map(item =>
        item.id === id ? { ...item, inputValue: value } : item
      )
    );
  };

  useEffect(() => {
    const completedCount = wellnessItems.filter(item => item.completed).length;
    const progress = (completedCount / wellnessItems.length) * 100;
    onProgressUpdate(progress);
  }, [wellnessItems, onProgressUpdate]);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <CheckCircle2 className="h-5 w-5" />
          Daily Wellness Checklist
        </CardTitle>
        <p className="text-sm text-blue-600">Track your daily wellness habits</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {wellnessItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleItem(item.id)}
              className={`p-1 ${item.completed ? 'text-green-600' : 'text-gray-400'}`}
            >
              {item.completed ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="h-4 w-4 text-blue-600" />
                <Label className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item.label}
                </Label>
              </div>
              
              {item.hasInput && (
                <Input
                  type={item.inputType}
                  placeholder={item.placeholder}
                  value={item.inputValue || ''}
                  onChange={(e) => updateItemInput(item.id, e.target.value)}
                  className="h-8 text-xs border-blue-200 focus:border-blue-400"
                />
              )}
            </div>
            
            {item.hasInput && item.unit && (
              <span className="text-xs text-blue-600 font-medium">{item.unit}</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WellnessChecklist;
