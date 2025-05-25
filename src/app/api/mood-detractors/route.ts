import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { Happiness } from '@/models/Happiness';
import { authOptions } from '@/lib/auth';
import { format, startOfDay, endOfDay } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const today = new Date();
    const happiness = await Happiness.findOne({
      email: session.user.email,
      date: {
        $gte: startOfDay(today),
        $lt: endOfDay(today)
      }
    });

    if (!happiness) {
      return NextResponse.json([]);
    }

    return NextResponse.json(happiness.moodDetractors || []);
  } catch (error) {
    console.error('Error fetching mood detractors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received body:', body);

    // Ensure we have an array of mood detractors
    const moodDetractors = body;

    if (!Array.isArray(moodDetractors)) {
      console.error('Invalid data format:', moodDetractors);
      return NextResponse.json(
        { error: 'Invalid mood detractors data' },
        { status: 400 }
      );
    }

    // Validate each mood detractor
    for (const detractor of moodDetractors) {
      if (!detractor.id || !detractor.label || typeof detractor.severity !== 'number' || detractor.severity < 1 || detractor.severity > 5) {
        console.error('Invalid detractor data:', detractor);
        return NextResponse.json(
          { error: 'Invalid mood detractor data' },
          { status: 400 }
        );
      }
    }

    await connectDB();
    const today = new Date();

    // First, try to find the existing document
    let happiness = await Happiness.findOne({
      email: session.user.email,
      date: {
        $gte: startOfDay(today),
        $lt: endOfDay(today)
      }
    });

    if (happiness) {
      // Update existing document
      happiness.moodDetractors = moodDetractors;
      await happiness.save();
    } else {
      // Create new document
      happiness = await Happiness.create({
        email: session.user.email,
        date: today,
        score: 0,
        reflection: '',
        moodDetractors: moodDetractors
      });
    }

    return NextResponse.json(happiness.moodDetractors || []);
  } catch (error) {
    console.error('Error saving mood detractors:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 