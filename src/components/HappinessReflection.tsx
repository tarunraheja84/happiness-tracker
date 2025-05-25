'use client';

import { useState, useEffect } from 'react';
import { useHappiness } from '@/hooks/useHappiness';
import { Smile, Star, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface HappinessReflectionProps {
  entries?: any[];
  loading?: boolean;
}

export default function HappinessReflection({ entries, loading: entriesLoading }: HappinessReflectionProps) {
  const { happinessData, loading: happinessLoading, error, saveHappiness } = useHappiness();
  const [happinessRating, setHappinessRating] = useState(5);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (happinessData && !isDataLoaded) {
      setHappinessRating(happinessData.score);
      setReflection(happinessData.reflection || '');
      setIsDataLoaded(true);
    }
  }, [happinessData, isDataLoaded]);

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      toast.error('Please add a reflection');
      return;
    }

    try {
      setSaving(true);
      await saveHappiness({
        score: happinessRating,
        reflection,
      });
      toast.success('Happiness reflection saved successfully');
    } catch (error) {
      console.error('Error saving happiness reflection:', error);
      toast.error('Failed to save happiness reflection');
    } finally {
      setSaving(false);
    }
  };

  const getEmoji = (rating: number) => {
    if (rating >= 9) return '😄';
    if (rating >= 7) return '🙂';
    if (rating >= 5) return '😐';
    if (rating >= 3) return '😕';
    return '😢';
  };

  const getColor = (rating: number) => {
    if (rating >= 9) return 'text-green-500';
    if (rating >= 7) return 'text-green-400';
    if (rating >= 5) return 'text-yellow-500';
    if (rating >= 3) return 'text-orange-500';
    return 'text-red-500';
  };

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Smile className="h-5 w-5" />
          Happiness Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-2">{getEmoji(happinessRating)}</div>
          <div className={`text-2xl font-bold ${getColor(happinessRating)}`}>
            {happinessRating}/10
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Not Happy</span>
            <span>Very Happy</span>
          </div>
          <Slider
            value={[happinessRating]}
            onValueChange={(value) => setHappinessRating(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <Textarea
          placeholder="How are you feeling today? What made you happy or sad?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="min-h-[100px] border-purple-200 focus:border-purple-400"
        />

        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Reflection
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
