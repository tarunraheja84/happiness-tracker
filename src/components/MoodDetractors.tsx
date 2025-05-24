
import { useState } from 'react';
import { AlertTriangle, Brain, Zap, Flame, Frown, Battery, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface MoodDetractor {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  selected: boolean;
  severity: number[];
  notes: string;
}

const MoodDetractors = () => {
  const [detractors, setDetractors] = useState<MoodDetractor[]>([
    { id: 'overthinking', label: 'Overthinking', icon: Brain, selected: false, severity: [3], notes: '' },
    { id: 'stress', label: 'Stress', icon: Zap, selected: false, severity: [3], notes: '' },
    { id: 'anger', label: 'Anger', icon: Flame, selected: false, severity: [3], notes: '' },
    { id: 'anxiety', label: 'Anxiety', icon: Frown, selected: false, severity: [3], notes: '' },
    { id: 'burnout', label: 'Burnout', icon: Battery, selected: false, severity: [3], notes: '' }
  ]);

  const { toast } = useToast();

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

  const handleSave = () => {
    const selectedDetractors = detractors.filter(d => d.selected);
    console.log('Saving mood detractors:', selectedDetractors);
    
    toast({
      title: "Mood detractors saved",
      description: "Your mood tracking has been saved successfully.",
    });
  };

  const selectedDetractors = detractors.filter(d => d.selected);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 md:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
          Mood Detractors
        </CardTitle>
        <p className="text-sm text-orange-600">What affected your mood today?</p>
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
            <h4 className="text-sm font-semibold text-orange-700">Severity & Notes:</h4>
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
            
            <Button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Mood Detractors
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodDetractors;
