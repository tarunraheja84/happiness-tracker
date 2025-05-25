'use client';

import { useState, useEffect } from 'react';
import { useMoodDetractors } from '@/hooks/useMoodDetractors';
import { AlertTriangle, Brain, Zap, Flame, Frown, Battery, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MoodDetractor {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  selected: boolean;
  severity: number[];
  notes: string;
}

interface MoodDetractorsProps {
  entries?: any[];
  loading?: boolean;
}

const defaultDetractors: MoodDetractor[] = [
  { id: 'overthinking', label: 'Overthinking', icon: Brain, selected: false, severity: [3], notes: '' },
  { id: 'stress', label: 'Stress', icon: Zap, selected: false, severity: [3], notes: '' },
  { id: 'anger', label: 'Anger', icon: Flame, selected: false, severity: [3], notes: '' },
  { id: 'anxiety', label: 'Anxiety', icon: Frown, selected: false, severity: [3], notes: '' },
  { id: 'burnout', label: 'Burnout', icon: Battery, selected: false, severity: [3], notes: '' }
];

export default function MoodDetractors({ entries, loading: entriesLoading }: MoodDetractorsProps) {
  const { moodDetractors, loading: moodDetractorsLoading, error, saveMoodDetractors } = useMoodDetractors();
  const [detractors, setDetractors] = useState<MoodDetractor[]>(defaultDetractors);
  const [saving, setSaving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (moodDetractors.length > 0 && !isDataLoaded) {
      setDetractors(prevDetractors => 
        prevDetractors.map(detractor => ({
          ...detractor,
          selected: moodDetractors.some((md: any) => md.id === detractor.id),
          severity: [moodDetractors.find((md: any) => md.id === detractor.id)?.severity || 3],
          notes: moodDetractors.find((md: any) => md.id === detractor.id)?.notes || ''
        }))
      );
      setIsDataLoaded(true);
    }
  }, [moodDetractors, isDataLoaded]);

  const toggleDetractor = (id: string) => {
    setDetractors(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateSeverity = (id: string, severity: number[]) => {
    setDetractors(items =>
      items.map(item =>
        item.id === id ? { ...item, severity } : item
      )
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setDetractors(items =>
      items.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const selectedDetractors = detractors
        .filter(d => d.selected)
        .map(d => ({
          id: d.id,
          label: d.label,
          severity: d.severity[0],
          notes: d.notes
        }));

      console.log('Saving mood detractors:', selectedDetractors);
      const response = await saveMoodDetractors(selectedDetractors);
      console.log('Save response:', response);
      
      if (response) {
        toast.success('Mood detractors saved successfully');
      } else {
        throw new Error('No response from server');
      }
    } catch (error) {
      console.error('Error saving mood detractors:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save mood detractors');
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  const selectedDetractors = detractors.filter(d => d.selected);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
          Mood Detractors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {detractors.map((detractor) => (
            <Button
              key={detractor.id}
              variant={detractor.selected ? 'default' : 'outline'}
              onClick={() => toggleDetractor(detractor.id)}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                detractor.selected 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                  : 'border-orange-200 text-orange-700 hover:bg-orange-50'
              }`}
            >
              <detractor.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{detractor.label}</span>
            </Button>
          ))}
        </div>

        {selectedDetractors.length > 0 && (
          <div className="space-y-4">
            {selectedDetractors.map((detractor) => (
              <div key={detractor.id} className="p-4 bg-white/70 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <detractor.icon className="h-4 w-4 text-orange-600" />
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {detractor.label}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Severity</span>
                    <span className="text-sm font-semibold text-orange-700">
                      {detractor.severity[0]}/5
                    </span>
                  </div>
                  <Slider
                    value={detractor.severity}
                    onValueChange={(value) => updateSeverity(detractor.id, value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-orange-500">
                    <span>Mild</span>
                    <span>Severe</span>
                  </div>
                </div>

                <Textarea
                  placeholder="Add notes about this feeling..."
                  value={detractor.notes}
                  onChange={(e) => updateNotes(detractor.id, e.target.value)}
                  className="min-h-[60px] border-orange-200 focus:border-orange-400 bg-white/70"
                />
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Mood Detractors
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
