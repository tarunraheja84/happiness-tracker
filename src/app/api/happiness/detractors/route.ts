import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { Happiness } from '@/models/Happiness';
import { authOptions } from '@/lib/auth';
import { subDays } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get happiness data for the last 30 days
    const thirtyDaysAgo = subDays(new Date(), 30);
    const happinessData = await Happiness.find({
      email: session.user.email,
      date: { $gte: thirtyDaysAgo }
    });

    // Count mood detractors
    const detractorsCount = new Map<string, number>();
    let totalDetractors = 0;

    happinessData.forEach(entry => {
      entry.moodDetractors.forEach((detractor:any) => {
        const count = detractorsCount.get(detractor.label) || 0;
        detractorsCount.set(detractor.label, count + 1);
        totalDetractors++;
      });
    });

    // Calculate percentages and create color mapping
    const colorMap = {
      'Stress': '#ef4444',
      'Anxiety': '#f97316',
      'Overthinking': '#eab308',
      'Anger': '#dc2626',
      'Burnout': '#7c2d12',
      'Loneliness': '#6366f1',
      'Work Pressure': '#8b5cf6',
      'Health Issues': '#ec4899',
      'Financial Worries': '#14b8a6',
      'Relationship Issues': '#f43f5e'
    };

    // Convert to array and calculate percentages based on total detractors
    const detractorsData = Array.from(detractorsCount.entries()).map(([name, count]) => ({
      name,
      value: Math.round((count / totalDetractors) * 100),
      color: colorMap[name as keyof typeof colorMap] || '#94a3b8'
    }));

    // Sort by value in descending order
    detractorsData.sort((a, b) => b.value - a.value);

    return NextResponse.json(detractorsData);
  } catch (error) {
    console.error('Error fetching mood detractors data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 