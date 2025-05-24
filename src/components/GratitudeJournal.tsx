import { useState } from 'react';
import { Heart, Save, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const GratitudeJournal = () => {
  const [gratitudeEntries, setGratitudeEntries] = useState(['', '', '']);
  const [savedEntries, setSavedEntries] = useState<string[]>([]);

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...gratitudeEntries];
    newEntries[index] = value;
    setGratitudeEntries(newEntries);
  };

  const saveGratitude = () => {
    const validEntries = gratitudeEntries.filter(entry => entry.trim());
    if (validEntries.length > 0) {
      setSavedEntries(validEntries);
      // Here you would typically save to a database
      console.log('Saving gratitude entries:', validEntries);
    }
  };

  const addNewEntry = () => {
    if (gratitudeEntries.length < 5) {
      setGratitudeEntries([...gratitudeEntries, '']);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Heart className="h-5 w-5" />
          Morning Gratitude
        </CardTitle>
        <p className="text-sm text-green-600">What are you grateful for today?</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {gratitudeEntries.map((entry, index) => (
          <div key={index} className="space-y-2">
            <label className="text-sm font-medium text-green-700">
              Gratitude #{index + 1}
            </label>
            <Textarea
              placeholder="I am grateful for..."
              value={entry}
              onChange={(e) => handleEntryChange(index, e.target.value)}
              className="min-h-[80px] border-green-200 focus:border-green-400 bg-white/70"
            />
          </div>
        ))}

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={saveGratitude}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Gratitude
          </Button>
          {gratitudeEntries.length < 5 && (
            <Button
              variant="outline"
              onClick={addNewEntry}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {savedEntries.length > 0 && (
          <div className="mt-6 p-4 bg-white/70 rounded-lg">
            <h4 className="text-sm font-semibold text-green-700 mb-2">Today's Gratitude:</h4>
            <div className="space-y-2">
              {savedEntries.map((entry, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 block w-full text-left p-2 h-auto">
                  {entry}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GratitudeJournal;
