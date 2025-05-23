
import { useState } from 'react';
import { Smile, Star, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

const HappinessReflection = () => {
  const [happinessRating, setHappinessRating] = useState([7]);
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const saveReflection = () => {
    // Here you would typically save to a database
    console.log('Saving happiness reflection:', {
      rating: happinessRating[0],
      reflection
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getEmoji = (rating: number) => {
    if (rating >= 9) return '😄';
    if (rating >= 7) return '😊';
    if (rating >= 5) return '🙂';
    if (rating >= 3) return '😐';
    return '😢';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Smile className="h-5 w-5" />
          Happiness Reflection
        </CardTitle>
        <p className="text-sm text-purple-600">How are you feeling today?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-2">{getEmoji(happinessRating[0])}</div>
            <div className={`text-2xl font-bold ${getRatingColor(happinessRating[0])}`}>
              {happinessRating[0]}/10
            </div>
            <p className="text-sm text-purple-600">Your happiness today</p>
          </div>
          
          <div className="px-4">
            <Slider
              value={happinessRating}
              onValueChange={setHappinessRating}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-purple-500 mt-2">
              <span>Very Low</span>
              <span>Amazing</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-700">
            Daily Reflection (Optional)
          </label>
          <Textarea
            placeholder="What made you happy today? Any thoughts or feelings you'd like to capture..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[100px] border-purple-200 focus:border-purple-400 bg-white/70"
          />
        </div>

        <Button
          onClick={saveReflection}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
          disabled={saved}
        >
          {saved ? (
            <>
              <Star className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Reflection
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HappinessReflection;
