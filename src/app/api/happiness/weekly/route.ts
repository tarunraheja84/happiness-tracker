import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { Happiness } from '@/models/Happiness';
import { authOptions } from '@/lib/auth';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get the start and end dates for the past week
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(new Date(), 6));

    // Fetch happiness data for the past week
    const happinessData = await Happiness.find({
      email: session.user.email,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    // Create a map of dates to happiness scores
    const dateMap = new Map();
    for (let i = 0; i < 7; i++) {
      const date = subDays(new Date(), 6 - i);
      dateMap.set(format(date, 'yyyy-MM-dd'), {
        date: format(date, 'yyyy-MM-dd'),
        score: 0
      });
    }

    // Fill in the actual happiness scores
    happinessData.forEach(entry => {
      const date = format(new Date(entry.date), 'yyyy-MM-dd');
      if (dateMap.has(date)) {
        dateMap.set(date, {
          date,
          score: entry.score
        });
      }
    });

    // Convert map to array and sort by date
    const weeklyData = Array.from(dateMap.values());

    return NextResponse.json(weeklyData);
  } catch (error) {
    console.error('Error fetching weekly happiness data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 