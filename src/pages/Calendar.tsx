
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState('gratitude');

  // Mock data - in a real app, this would come from your database
  const mockData = {
    gratitude: [
      { date: new Date(2025, 4, 22), items: ['Family support', 'Morning coffee', 'Good weather'] },
      { date: new Date(2025, 4, 21), items: ['Career progress', 'Health', 'Friends'] },
      { date: new Date(2025, 4, 20), items: ['Good book', 'Peaceful day', 'Delicious meal'] },
      { date: new Date(), items: ['Beautiful sunrise', 'Good night sleep', 'Productive day'] },
    ],
    wellness: [
      { date: new Date(), meditation: 15, sleep: 7.5, exercise: 30, steps: 8500, water: true, healthy: true },
      { date: new Date(2025, 4, 22), meditation: 20, sleep: 8, exercise: 45, steps: 10200, water: true, healthy: true },
      { date: new Date(2025, 4, 21), meditation: 10, sleep: 6.5, exercise: 0, steps: 5000, water: false, healthy: false },
    ],
    happiness: [
      { date: new Date(), rating: 8, notes: 'Overall a good day with minor stress' },
      { date: new Date(2025, 4, 22), rating: 9, notes: 'Excellent day, everything went well' },
      { date: new Date(2025, 4, 21), rating: 6, notes: 'Felt tired and a bit unmotivated' },
    ],
    mood: [
      { date: new Date(), issues: ['Stress', 'Overthinking'], severity: [3, 2], notes: 'Work deadline approaching' },
      { date: new Date(2025, 4, 22), issues: [], severity: [], notes: 'No mood issues today' },
      { date: new Date(2025, 4, 21), issues: ['Anxiety', 'Burnout'], severity: [4, 3], notes: 'Feeling overwhelmed' },
    ]
  };

  // Helper to convert date objects to string format for comparison
  const formatDateForComparison = (date: Date) => format(date, 'yyyy-MM-dd');
  
  // Find data for selected date
  const selectedDateStr = formatDateForComparison(date);
  const gratitudeData = mockData.gratitude.find(item => 
    formatDateForComparison(item.date) === selectedDateStr
  );
  const wellnessData = mockData.wellness.find(item => 
    formatDateForComparison(item.date) === selectedDateStr
  );
  const happinessData = mockData.happiness.find(item => 
    formatDateForComparison(item.date) === selectedDateStr
  );
  const moodData = mockData.mood.find(item => 
    formatDateForComparison(item.date) === selectedDateStr
  );

  // Function to render highlighted dates on calendar
  const renderHighlightedDates = () => {
    // Collect all dates that have data
    const allDates = new Set<string>();
    
    mockData.gratitude.forEach(item => allDates.add(formatDateForComparison(item.date)));
    mockData.wellness.forEach(item => allDates.add(formatDateForComparison(item.date)));
    mockData.happiness.forEach(item => allDates.add(formatDateForComparison(item.date)));
    mockData.mood.forEach(item => allDates.add(formatDateForComparison(item.date)));
    
    return Array.from(allDates).map(dateStr => new Date(dateStr));
  };

  const highlightedDates = renderHighlightedDates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation activeView="calendar" setActiveView={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Calendar View
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review your wellness journey day by day
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Panel */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-full flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    highlighted: highlightedDates
                  }}
                  modifiersStyles={{
                    highlighted: { backgroundColor: "rgba(99, 102, 241, 0.1)" }
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-1">
                    {format(date, 'EEEE')}
                  </Badge>
                  {format(date, 'MMMM d, yyyy')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Display Panel */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Data for {format(date, 'MMMM d, yyyy')}
              </CardTitle>
              <Tabs
                defaultValue="gratitude"
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="mt-2"
              >
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
                  <TabsTrigger value="wellness">Wellness</TabsTrigger>
                  <TabsTrigger value="happiness">Happiness</TabsTrigger>
                  <TabsTrigger value="mood">Mood</TabsTrigger>
                </TabsList>

                {/* Gratitude Tab */}
                <TabsContent value="gratitude" className="p-4">
                  {gratitudeData ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Gratitude Journal</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {gratitudeData.items.map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No gratitude entries for this date</p>
                    </div>
                  )}
                </TabsContent>

                {/* Wellness Tab */}
                <TabsContent value="wellness" className="p-4">
                  {wellnessData ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Wellness Checklist</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span>Meditation</span>
                          <Badge variant="outline">{wellnessData.meditation} minutes</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sleep</span>
                          <Badge variant="outline">{wellnessData.sleep} hours</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Exercise</span>
                          <Badge variant="outline">{wellnessData.exercise} minutes</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Steps</span>
                          <Badge variant="outline">{wellnessData.steps.toLocaleString()}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Water Intake</span>
                          <Badge variant={wellnessData.water ? "secondary" : "destructive"}>
                            {wellnessData.water ? 'Completed' : 'Incomplete'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Healthy Eating</span>
                          <Badge variant={wellnessData.healthy ? "secondary" : "destructive"}>
                            {wellnessData.healthy ? 'Completed' : 'Incomplete'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No wellness data for this date</p>
                    </div>
                  )}
                </TabsContent>

                {/* Happiness Tab */}
                <TabsContent value="happiness" className="p-4">
                  {happinessData ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Happiness Reflection</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <span>Rating:</span>
                          <div className="flex space-x-1">
                            {[...Array(10)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  i < happinessData.rating 
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="block font-medium mb-1">Notes:</span>
                          <p className="text-gray-700 bg-white/50 p-3 rounded-md">{happinessData.notes}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No happiness data for this date</p>
                    </div>
                  )}
                </TabsContent>

                {/* Mood Tab */}
                <TabsContent value="mood" className="p-4">
                  {moodData && moodData.issues.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Mood Detractors</h3>
                      <div className="space-y-4">
                        {moodData.issues.map((issue, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span>{issue}</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-5 h-5 rounded-sm ${
                                    i < moodData.severity[index] 
                                      ? 'bg-red-500' 
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        {moodData.notes && (
                          <div>
                            <span className="block font-medium mb-1">Notes:</span>
                            <p className="text-gray-700 bg-white/50 p-3 rounded-md">{moodData.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {moodData ? 'No mood issues reported for this date' : 'No mood data for this date'}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
