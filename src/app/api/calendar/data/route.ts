import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { Gratitude } from '@/models/Gratitude';
import { Wellness } from '@/models/Wellness';
import { Happiness } from '@/models/Happiness';
import { authOptions } from '@/lib/auth';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';

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

    console.log('Date Range:', {
      startOfToday: startOfToday.toISOString(),
      endOfToday: endOfToday.toISOString()
    });

    // Fetch all data for the user
    const [gratitudeData, wellnessData, happinessData] = await Promise.all([
      Gratitude.find({ 
        email: session.user.email,
        date: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      }).sort({ date: -1 }),
      Wellness.find({ 
        email: session.user.email,
        date: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      }).sort({ date: -1 }),
      Happiness.find({ 
        email: session.user.email,
        date: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      }).sort({ date: -1 })
    ]);

    console.log('Raw Gratitude Data:', gratitudeData); // Debug log
    console.log('Raw Happiness Data:', happinessData); // Debug log

    // Transform the data to match the calendar format
    const calendarData = {
      gratitude: gratitudeData.map(item => {
        // Ensure we're working with a proper Date object
        const date = item.date instanceof Date ? item.date : new Date(item.date);
        return {
          date: startOfDay(date), // Normalize to start of day for consistent comparison
          items: item.gratitudes || [] // Use gratitudes field instead of items
        };
      }),
      wellness: wellnessData.map(item => {
        const date = item.date instanceof Date ? item.date : new Date(item.date);
        return {
          date: startOfDay(date),
          meditation: item.meditation || 0,
          sleep: item.sleep || 0,
          exercise: item.exercise || 0,
          steps: item.steps || 0,
          water: item.water || false,
          healthy: item.healthyMeals || false,
          reading: item.reading || false,
          journaling: item.journaling || false,
          stretching: item.stretching || false,
          socialConnection: item.socialConnection || false,
          screenTime: item.screenTime || 0
        };
      }),
      happiness: happinessData.map(item => {
        const date = item.date instanceof Date ? item.date : new Date(item.date);
        return {
          date: startOfDay(date),
          rating: Number(item.score) || 0, // Map 'score' to 'rating' for calendar view
          notes: item.reflection || '' // Map 'reflection' to 'notes' for calendar view
        };
      }),
      mood: happinessData.map(item => {
        const date = item.date instanceof Date ? item.date : new Date(item.date);
        return {
          date: startOfDay(date),
          moodDetractors: item.moodDetractors?.map(d => ({
            label: d.label,
            severity: d.severity,
            notes: d.notes
          })) || []
        };
      })
    };

    console.log('Processed Calendar Data:', calendarData); // Debug log

    return NextResponse.json(calendarData);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 