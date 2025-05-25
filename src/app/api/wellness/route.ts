import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { Wellness } from '@/models/Wellness';
import { authOptions } from '@/lib/auth';
import { startOfDay, endOfDay } from 'date-fns';

// GET /api/wellness - Get wellness checklist for today
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const wellnessData = await Wellness.findOne({
      email: session.user.email,
      date: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    return NextResponse.json(wellnessData || {});
  } catch (error) {
    console.error('Error fetching wellness data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/wellness - Save wellness checklist
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Update or create wellness data for today
    const wellnessData = await Wellness.findOneAndUpdate(
      {
        email: session.user.email,
        date: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      },
      {
        email: session.user.email,
        date: today,
        meditation: data.meditation || 0,
        sleep: data.sleep || 0,
        exercise: data.exercise || 0,
        steps: data.steps || 0,
        water: data.water || false,
        healthy: data.healthy || false,
        reading: data.reading || false,
        journaling: data.journaling || false,
        stretching: data.stretching || false,
        socialConnection: data.socialConnection || false,
        screenTime: data.screenTime || 0
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(wellnessData);
  } catch (error) {
    console.error('Error saving wellness data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 