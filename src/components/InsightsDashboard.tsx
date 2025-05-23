
import { TrendingUp, Calendar, Target, Award, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const InsightsDashboard = () => {
  // Sample data - in a real app, this would come from your database
  const happinessData = [
    { day: 'Mon', happiness: 7, gratitude: 3, wellness: 6 },
    { day: 'Tue', happiness: 8, gratitude: 3, wellness: 7 },
    { day: 'Wed', happiness: 6, gratitude: 2, wellness: 5 },
    { day: 'Thu', happiness: 9, gratitude: 3, wellness: 8 },
    { day: 'Fri', happiness: 8, gratitude: 3, wellness: 7 },
    { day: 'Sat', happiness: 9, gratitude: 3, wellness: 8 },
    { day: 'Sun', happiness: 7, gratitude: 3, wellness: 6 }
  ];

  const moodDetractorsData = [
    { name: 'Stress', value: 35, color: '#ef4444' },
    { name: 'Anxiety', value: 25, color: '#f97316' },
    { name: 'Overthinking', value: 20, color: '#eab308' },
    { name: 'Anger', value: 15, color: '#dc2626' },
    { name: 'Burnout', value: 5, color: '#7c2d12' }
  ];

  const insights = [
    "You're happiest on days you exercise 🏃‍♀️",
    "Gratitude journaling improves your mood by 23% 📝",
    "Your stress levels are lowest on weekends 🌅",
    "Meditation helps reduce overthinking significantly 🧘‍♀️"
  ];

  const weeklyStats = {
    avgHappiness: 7.7,
    gratitudeStreak: 12,
    wellnessCompletion: 78,
    improvedAreas: ['Sleep', 'Exercise', 'Hydration']
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
            <div className="text-2xl font-bold text-green-700">{weeklyStats.avgHappiness}</div>
            <p className="text-sm text-green-600">Avg Happiness</p>
            <Badge className="mt-2 bg-green-100 text-green-800">+0.5 this week</Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{weeklyStats.gratitudeStreak}</div>
            <p className="text-sm text-blue-600">Day Gratitude Streak</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">Keep going!</Badge>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <LineChart data={happinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="happiness" 
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
                  data={moodDetractorsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moodDetractorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {moodDetractorsData.map((item) => (
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

      {/* Wellness Completion */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Weekly Wellness Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={happinessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="wellness" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
