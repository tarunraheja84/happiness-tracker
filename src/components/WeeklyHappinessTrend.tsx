'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Smile, Loader2 } from 'lucide-react';

interface HappinessData {
  date: string;
  score: number;
}

export default function WeeklyHappinessTrend() {
  const { data: session } = useSession();
  const [happinessData, setHappinessData] = useState<HappinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyHappiness = async () => {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        const response = await fetch('/api/happiness/weekly');
        if (!response.ok) {
          throw new Error('Failed to fetch weekly happiness data');
        }
        const data = await response.json();
        console.log('Fetched happiness data:', data); // Debug log
        setHappinessData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching weekly happiness:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyHappiness();
  }, [session?.user?.email]);

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
          Weekly Happiness Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={happinessData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'EEE')}
                  stroke="#64748b"
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [`${value}/10`, 'Happiness']}
                  labelFormatter={(date) => format(new Date(date), 'EEEE, MMM d')}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 