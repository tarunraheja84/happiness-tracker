import { useState, useEffect } from 'react';
import { Heart, Save, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useGratitudes } from '@/hooks/useGratitudes';
import { format } from 'date-fns';

const GratitudeJournal = () => {
  const [gratitudeEntries, setGratitudeEntries] = useState(['', '', '']);
  const { getGratitudes, saveGratitudes, loading, error } = useGratitudes();

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...gratitudeEntries];
    newEntries[index] = value;
    setGratitudeEntries(newEntries);
  };

  const saveGratitude = async () => {
    const validEntries = gratitudeEntries.filter(entry => entry.trim());
    if (validEntries.length > 0) {
      const today = format(new Date(), 'yyyy-MM-dd');
      await saveGratitudes(today, validEntries);
      // Refresh the gratitudes after saving
      loadTodayGratitudes();
    }
  };

  const addNewEntry = () => {
    if (gratitudeEntries.length < 5) {
      setGratitudeEntries([...gratitudeEntries, '']);
    }
  };

  const loadTodayGratitudes = async () => {
    const gratitudes = await getGratitudes();
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayGratitude = gratitudes.find(g => format(new Date(g.date), 'yyyy-MM-dd') === today);
    
    if (todayGratitude) {
      setGratitudeEntries(todayGratitude.gratitudes);
    } else {
      setGratitudeEntries(['', '', '']);
    }
  };

  useEffect(() => {
    loadTodayGratitudes();
  }, []);

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
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

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
              disabled={loading}
            />
          </div>
        ))}

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={saveGratitude}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Gratitude'}
          </Button>
          {gratitudeEntries.length < 5 && (
            <Button
              variant="outline"
              onClick={addNewEntry}
              className="border-green-300 text-green-700 hover:bg-green-50"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {gratitudeEntries.some(entry => entry.trim()) && (
          <div className="mt-6 p-4 bg-white/70 rounded-lg">
            <h4 className="text-sm font-semibold text-green-700 mb-2">Today's Gratitude:</h4>
            <div className="space-y-2">
              {gratitudeEntries
                .filter(entry => entry.trim())
                .map((entry, index) => (
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
