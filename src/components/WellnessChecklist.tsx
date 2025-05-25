'use client';

import { useState, useEffect } from 'react';
import { useWellness } from '@/hooks/useWellness';
import { CheckCircle2, Circle, Timer, Droplets, Utensils, Moon, Activity, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

const defaultWellnessItems: WellnessItem[] = [
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
];

export default function WellnessChecklist({ onProgressUpdate }: WellnessChecklistProps) {
  const { wellness, loading: initialLoading, error, saveWellness } = useWellness();
  const [isSaving, setIsSaving] = useState(false);
  const [wellnessItems, setWellnessItems] = useState<WellnessItem[]>(defaultWellnessItems);

  useEffect(() => {
    if (wellness) {
      setWellnessItems(items =>
        items.map(item => {
          switch (item.id) {
            case 'meditation':
              return { ...item, completed: Boolean(wellness.meditation > 0), inputValue: wellness.meditation?.toString() || '0' };
            case 'sleep':
              return { ...item, completed: Boolean(wellness.sleep >= 8), inputValue: wellness.sleep?.toString() || '0' };
            case 'exercise':
              return { 
                ...item, 
                completed: Boolean(wellness.exercise > 0), 
                inputValue: wellness.exercise?.toString() || '0' 
              };
            case 'water':
              return { 
                ...item, 
                completed: Boolean(wellness.water), 
                inputValue: wellness.water ? '2' : '0' 
              };
            case 'healthy_meals':
              return { ...item, completed: Boolean(wellness.healthyMeals) };
            case 'wake_time':
              return { ...item, completed: Boolean(wellness.wakeTime), inputValue: wellness.wakeTime || '' };
            default:
              return item;
          }
        })
      );
    }
  }, [wellness]);

  const toggleItem = (id: string) => {
    setWellnessItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newCompleted = !item.completed;
          if (item.hasInput) {
            return { 
              ...item, 
              completed: newCompleted,
              inputValue: newCompleted ? item.placeholder || '0' : '0'
            };
          }
          return { ...item, completed: newCompleted };
        }
        return item;
      })
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

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const formData = {
        meditation: parseInt(wellnessItems.find(item => item.id === 'meditation')?.inputValue || '0'),
        sleep: parseInt(wellnessItems.find(item => item.id === 'sleep')?.inputValue || '0'),
        exercise: parseInt(wellnessItems.find(item => item.id === 'exercise')?.inputValue || '0'),
        water: parseFloat(wellnessItems.find(item => item.id === 'water')?.inputValue || '0') >= 2,
        healthyMeals: wellnessItems.find(item => item.id === 'healthy_meals')?.completed || false,
        wakeTime: wellnessItems.find(item => item.id === 'wake_time')?.inputValue || '',
      };

      await saveWellness(formData);
      toast.success('Wellness checklist saved successfully!');
    } catch (err) {
      toast.error('Failed to save wellness checklist');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <CheckCircle2 className="h-5 w-5" />
          Daily Wellness Checklist
          {initialLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
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

        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          {isSaving ? (
            <div className="flex items-center justify-center w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Checklist
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
