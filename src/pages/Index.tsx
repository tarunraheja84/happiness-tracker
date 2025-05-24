import { useState, useEffect } from 'react';
import { Calendar, Heart, Sun, Moon, TrendingUp, Smile, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GratitudeJournal from '@/components/GratitudeJournal';
import WellnessChecklist from '@/components/WellnessChecklist';
import HappinessReflection from '@/components/HappinessReflection';
import MoodDetractors from '@/components/MoodDetractors';
import InsightsDashboard from '@/components/InsightsDashboard';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';

const Index = () => {
  const [activeView, setActiveView] = useState('today');
  const [todayProgress, setTodayProgress] = useState(0);
  const router=useRouter();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun };
    if (hour < 18) return { text: 'Good Afternoon', icon: Sun };
    return { text: 'Good Evening', icon: Moon };
  };

  useEffect(() => {
    if (activeView === 'calendar') {
      router.push('/calendar');
    }
  }, [activeView, router]);

  const greeting = getCurrentGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <greeting.icon className="h-8 w-8 text-orange-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {greeting.text}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to Happiness Tracker - your personal space for wellness, gratitude, and happiness tracking
          </p>
        </div>

        {/* Today's Progress */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Today's Wellness Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-semibold text-gray-800">{Math.round(todayProgress)}%</span>
              </div>
              <Progress value={todayProgress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                  <Heart className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700">Gratitude</p>
                  <p className="text-xs text-green-600">3 entries</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-700">Wellness</p>
                  <p className="text-xs text-blue-600">5/8 completed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100">
                  <Smile className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-700">Happiness</p>
                  <p className="text-xs text-purple-600">8/10 today</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
                  <Plus className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-amber-700">Insights</p>
                  <p className="text-xs text-amber-600">Available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {activeView === 'today' && (
            <div className="grid gap-8 md:grid-cols-2">
              <GratitudeJournal />
              <WellnessChecklist onProgressUpdate={setTodayProgress} />
              <HappinessReflection />
              <MoodDetractors />
            </div>
          )}
          
          {activeView === 'insights' && <InsightsDashboard />}
        </div>
      </main>
    </div>
  );
};

export default Index;
