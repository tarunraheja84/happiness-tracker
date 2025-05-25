import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HappinessReflection from '@/components/HappinessReflection';
import WeeklyHappinessTrend from '@/components/WeeklyHappinessTrend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, TrendingUp, Loader2 } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Suspense fallback={
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </CardContent>
            </Card>
          }>
            <HappinessReflection />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </CardContent>
            </Card>
          }>
            <WeeklyHappinessTrend />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 