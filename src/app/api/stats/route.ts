import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Gratitude } from '@/models/Gratitude';
import { Wellness } from '@/models/Wellness';
import { Happiness } from '@/models/Happiness';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), 'yyyy-MM-dd');

    // Get today's gratitudes
    const todayGratitude = await Gratitude.findOne({
      email: session.user.email,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1))
      }
    });

    // Calculate total gratitude entries for today
    const totalGratitudeEntries = todayGratitude ? todayGratitude.gratitudes.length : 0;

    // Get all gratitudes for the last 30 days
    const recentGratitudes = await Gratitude.find({
      email: session.user.email,
      date: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    }).sort({ date: -1 });

    // Calculate total entries
    const totalEntries = recentGratitudes.length;

    // Get today's happiness data
    const todayHappiness = await Happiness.findOne({
      email: session.user.email,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1))
      }
    });

    // Calculate average happiness score
    const averageHappinessScore = todayHappiness?.score || 0;

    // Get today's wellness data
    const todayWellness = await Wellness.findOne({
      email: session.user.email,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1))
      }
    });

    // Calculate completed wellness activities
    let completedWellnessActivities = 0;
    const totalWellnessActivities = 6; // Total number of wellness activities

    if (todayWellness) {
      if (todayWellness.meditation > 0) completedWellnessActivities++;
      if (todayWellness.sleep >= 8) completedWellnessActivities++;
      if (todayWellness.exercise > 0) completedWellnessActivities++;
      if (todayWellness.water >= 2) completedWellnessActivities++;
      if (todayWellness.healthyMeals) completedWellnessActivities++;
      if (todayWellness.wakeTime) completedWellnessActivities++;
    }

    // Calculate mood detractors (placeholder for now)
    const moodDetractors = 2;
    const averageMoodImpact = 3.5;

    return NextResponse.json({
      totalEntries,
      averageHappinessScore,
      totalGratitudeEntries,
      completedWellnessActivities,
      totalWellnessActivities,
      moodDetractors,
      averageMoodImpact
    });
  } catch (error) {
    console.error('Error in GET /api/stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 