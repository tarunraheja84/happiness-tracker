'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { Heart, Moon, Dumbbell, Droplets, Apple, BookOpen, PenTool, Stretch, Users, Monitor } from 'lucide-react';

interface WellnessData {
  meditation: number;
  sleep: number;
  exercise: number;
  steps: number;
  water: boolean;
  healthy: boolean;
  reading: boolean;
  journaling: boolean;
  stretching: boolean;
  socialConnection: boolean;
  screenTime: number;
}

const initialWellnessData: WellnessData = {
  meditation: 0,
  sleep: 0,
  exercise: 0,
  steps: 0,
  water: false,
  healthy: false,
  reading: false,
  journaling: false,
  stretching: false,
  socialConnection: false,
  screenTime: 0
};

export default function Wellness() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [wellnessData, setWellnessData] = useState<WellnessData>(initialWellnessData);

  useEffect(() => {
    const fetchWellnessData = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/wellness');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            // Merge the fetched data with initial state to ensure all fields exist
            setWellnessData({
              ...initialWellnessData,
              ...data
            });
          }
        }
      } catch (error) {
        console.error('Error fetching wellness data:', error);
      }
    };

    fetchWellnessData();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/wellness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...wellnessData,
          email: session.user.email,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Wellness data saved successfully!',
        });
      } else {
        throw new Error('Failed to save wellness data');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save wellness data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberChange = (field: keyof WellnessData, value: string) => {
    const numValue = parseInt(value) || 0;
    setWellnessData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCheckboxChange = (field: keyof WellnessData) => {
    setWellnessData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Daily Wellness Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meditation */}
            <div className="flex items-center gap-4">
              <Heart className="h-5 w-5 text-pink-500" />
              <Label htmlFor="meditation" className="flex-1">Meditation (minutes)</Label>
              <Input
                id="meditation"
                type="number"
                min="0"
                value={wellnessData.meditation}
                onChange={(e) => handleNumberChange('meditation', e.target.value)}
                className="w-24"
              />
            </div>

            {/* Sleep */}
            <div className="flex items-center gap-4">
              <Moon className="h-5 w-5 text-indigo-500" />
              <Label htmlFor="sleep" className="flex-1">Sleep (hours)</Label>
              <Input
                id="sleep"
                type="number"
                min="0"
                max="24"
                value={wellnessData.sleep}
                onChange={(e) => handleNumberChange('sleep', e.target.value)}
                className="w-24"
              />
            </div>

            {/* Exercise */}
            <div className="flex items-center gap-4">
              <Dumbbell className="h-5 w-5 text-green-500" />
              <Label htmlFor="exercise" className="flex-1">Exercise (minutes)</Label>
              <Input
                id="exercise"
                type="number"
                min="0"
                value={wellnessData.exercise}
                onChange={(e) => handleNumberChange('exercise', e.target.value)}
                className="w-24"
              />
            </div>

            {/* Steps */}
            <div className="flex items-center gap-4">
              <Dumbbell className="h-5 w-5 text-blue-500" />
              <Label htmlFor="steps" className="flex-1">Steps taken today</Label>
              <Input
                id="steps"
                type="number"
                min="0"
                value={wellnessData.steps}
                onChange={(e) => handleNumberChange('steps', e.target.value)}
                className="w-24"
              />
            </div>

            {/* Water */}
            <div className="flex items-center gap-4">
              <Droplets className="h-5 w-5 text-blue-500" />
              <Label htmlFor="water" className="flex-1">Drank enough water</Label>
              <Checkbox
                id="water"
                checked={wellnessData.water}
                onCheckedChange={() => handleCheckboxChange('water')}
              />
            </div>

            {/* Healthy Meals */}
            <div className="flex items-center gap-4">
              <Apple className="h-5 w-5 text-red-500" />
              <Label htmlFor="healthy" className="flex-1">Ate healthy meals</Label>
              <Checkbox
                id="healthy"
                checked={wellnessData.healthy}
                onCheckedChange={() => handleCheckboxChange('healthy')}
              />
            </div>

            {/* Reading */}
            <div className="flex items-center gap-4">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <Label htmlFor="reading" className="flex-1">Read for pleasure</Label>
              <Checkbox
                id="reading"
                checked={wellnessData.reading}
                onCheckedChange={() => handleCheckboxChange('reading')}
              />
            </div>

            {/* Journaling */}
            <div className="flex items-center gap-4">
              <PenTool className="h-5 w-5 text-yellow-500" />
              <Label htmlFor="journaling" className="flex-1">Journaled today</Label>
              <Checkbox
                id="journaling"
                checked={wellnessData.journaling}
                onCheckedChange={() => handleCheckboxChange('journaling')}
              />
            </div>

            {/* Stretching */}
            <div className="flex items-center gap-4">
              <Stretch className="h-5 w-5 text-orange-500" />
              <Label htmlFor="stretching" className="flex-1">Did stretching</Label>
              <Checkbox
                id="stretching"
                checked={wellnessData.stretching}
                onCheckedChange={() => handleCheckboxChange('stretching')}
              />
            </div>

            {/* Social Connection */}
            <div className="flex items-center gap-4">
              <Users className="h-5 w-5 text-green-500" />
              <Label htmlFor="socialConnection" className="flex-1">Social connection</Label>
              <Checkbox
                id="socialConnection"
                checked={wellnessData.socialConnection}
                onCheckedChange={() => handleCheckboxChange('socialConnection')}
              />
            </div>

            {/* Screen Time */}
            <div className="flex items-center gap-4">
              <Monitor className="h-5 w-5 text-gray-500" />
              <Label htmlFor="screenTime" className="flex-1">Screen time (hours)</Label>
              <Input
                id="screenTime"
                type="number"
                min="0"
                max="24"
                value={wellnessData.screenTime}
                onChange={(e) => handleNumberChange('screenTime', e.target.value)}
                className="w-24"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Wellness Data'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 