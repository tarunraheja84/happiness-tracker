import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { Wellness } from '@/models/Wellness';
import { authOptions } from '@/lib/auth';
import { format, startOfDay, endOfDay } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get today's date range
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Get today's wellness data with more specific date range
    const wellnessData = await Wellness.findOne({
      email: session.user.email,
      date: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    console.log('Wellness Data:', wellnessData); // Debug log

    // Calculate completion percentage
    let completionPercentage = 0;
    if (wellnessData && wellnessData.tasks && wellnessData.tasks.length > 0) {
      const totalTasks = wellnessData.tasks.length;
      const completedTasks = wellnessData.tasks.filter(task => task.completed).length;
      completionPercentage = Math.round((completedTasks / totalTasks) * 100);
      console.log('Total Tasks:', totalTasks, 'Completed:', completedTasks, 'Percentage:', completionPercentage); // Debug log
    } else {
      console.log('No wellness data found for today'); // Debug log
    }

    return NextResponse.json({ completionPercentage });
  } catch (error) {
    console.error('Error fetching wellness completion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 