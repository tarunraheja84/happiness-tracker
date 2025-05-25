'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TrendingUp, Calendar, Target, Award, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { format } from 'date-fns';

interface Stats {
  averageHappinessScore: number;
  totalEntries: number;
  weeklyHappinessData: Array<{
    date: string;
    score: number;
  }>;
  moodDetractors: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  insights: string[];
  wellnessCompletion: number;
}

interface InsightsDashboardProps {
  stats?: Stats;
  loading?: boolean;
}

const InsightsDashboard = ({ stats, loading }: InsightsDashboardProps) => {
  const { data: session } = useSession();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [moodDetractors, setMoodDetractors] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [weeklyChange, setWeeklyChange] = useState<number>(0);
  const [wellnessCompletion, setWellnessCompletion] = useState<number>(0);

  useEffect(() => {
    const fetchInsightsData = async () => {
      if (!session?.user?.email) return;

      try {
        // Fetch weekly happiness data
        const weeklyResponse = await fetch('/api/happiness/weekly');
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json();
          setWeeklyData(weeklyData);
          
          // Calculate weekly change
          if (weeklyData.length >= 2) {
            const currentWeek = weeklyData.slice(-7);
            const previousWeek = weeklyData.slice(-14, -7);
            
            const currentAvg = currentWeek.reduce((sum: number, day: any) => sum + day.score, 0) / currentWeek.length;
            const previousAvg = previousWeek.reduce((sum: number, day: any) => sum + day.score, 0) / previousWeek.length;
            
            setWeeklyChange(currentAvg - previousAvg);
          }
        }

        // Fetch mood detractors data
        const detractorsResponse = await fetch('/api/happiness/detractors');
        if (detractorsResponse.ok) {
          const detractorsData = await detractorsResponse.json();
          setMoodDetractors(detractorsData);
        }

        // Fetch wellness completion data
        const wellnessResponse = await fetch('/api/wellness/completion');
        if (wellnessResponse.ok) {
          const wellnessData = await wellnessResponse.json();
          setWellnessCompletion(wellnessData.completionPercentage);
        }

        // Generate insights based on the data
        const insightsResponse = await fetch('/api/happiness/insights');
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          setInsights(insightsData);
        }
      } catch (error) {
        console.error('Error fetching insights data:', error);
      }
    };

    fetchInsightsData();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  const weeklyStats = {
    avgHappiness: stats?.averageHappinessScore || 0,
    gratitudeStreak: stats?.totalEntries || 0,
    wellnessCompletion: wellnessCompletion,
    improvedAreas: ['Sleep', 'Exercise', 'Hydration'] // This would need to be calculated from data
  };

  const getWeeklyChangeText = (change: number) => {
    if (change === 0) return 'No change this week';
    if (change > 0) return `+${change.toFixed(1)} this week`;
    return `${change.toFixed(1)} this week`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Wellness Insights
        </h2>
        <p className="text-gray-600">Discover patterns and celebrate your progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{weeklyStats.avgHappiness.toFixed(1)}</div>
            <p className="text-sm text-green-600">Avg Happiness</p>
            <Badge className="mt-2 bg-green-100 text-green-800">
              {weeklyStats.avgHappiness > 0 ? getWeeklyChangeText(weeklyChange) : 'Start tracking!'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{weeklyStats.gratitudeStreak}</div>
            <p className="text-sm text-blue-600">Day Streak</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">
              {weeklyStats.gratitudeStreak > 0 ? 'Keep going!' : 'Start today!'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{weeklyStats.wellnessCompletion}%</div>
            <p className="text-sm text-purple-600">Wellness Goals</p>
            <Progress value={weeklyStats.wellnessCompletion} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700">{weeklyStats.improvedAreas.length}</div>
            <p className="text-sm text-amber-600">Areas Improved</p>
            <Badge className="mt-2 bg-amber-100 text-amber-800">Great progress!</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Happiness Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Weekly Happiness Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'd MMM')}
                  stroke="#64748b"
                />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'EEEE, d MMM yyyy')}
                  formatter={(value: number) => [`${value}/10`, 'Happiness']}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Detractors */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-red-600" />
              Common Mood Detractors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={moodDetractors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moodDetractors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {moodDetractors.map((item) => (
                <Badge key={item.name} variant="outline" className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name} ({item.value}%)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Award className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white/70 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsDashboard;
