import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Happiness } from '@/models/Happiness';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';

// GET /api/happiness - Get happiness reflection for today
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), 'yyyy-MM-dd');

    // Get today's happiness reflection
    const happiness = await Happiness.findOne({
      email: session.user.email,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1))
      }
    });

    return NextResponse.json(happiness || {
      email: session.user.email,
      date: new Date(today),
      score: 0,
      reflection: '',
      moodDetractors: []
    });
  } catch (error) {
    console.error('Error in GET /api/happiness:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/happiness - Save happiness reflection
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { score, reflection, moodDetractors } = body;

    if (!score || !reflection) {
      return NextResponse.json({ error: 'Score and reflection are required' }, { status: 400 });
    }

    await connectDB();

    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), 'yyyy-MM-dd');

    // Try to update existing entry or create new one
    const happiness = await Happiness.findOneAndUpdate(
      {
        email: session.user.email,
        date: {
          $gte: new Date(today),
          $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1))
        }
      },
      {
        email: session.user.email,
        date: new Date(today),
        score,
        reflection,
        moodDetractors: moodDetractors || [],
        updatedAt: new Date()
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json(happiness);
  } catch (error) {
    console.error('Error in POST /api/happiness:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 