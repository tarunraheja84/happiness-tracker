import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Gratitude } from '@/models/Gratitude';
import { authOptions } from '@/lib/auth';

// GET /api/gratitudes - Get all gratitudes for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in GET:', session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const gratitudes = await Gratitude.find({ email: session.user.email })
      .sort({ date: -1 })
      .limit(30);

    console.log('Found gratitudes:', gratitudes); // Debug log
    return NextResponse.json(gratitudes);
  } catch (error) {
    console.error('Error in GET /api/gratitudes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/gratitudes - Save new gratitudes
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in POST:', session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Request body:', body); // Debug log

    const { date, gratitudes } = body;
    if (!date || !gratitudes || !Array.isArray(gratitudes)) {
      console.log('Invalid input:', { date, gratitudes }); // Debug log
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await connectDB();
    console.log('Connected to DB'); // Debug log

    // Try to update existing entry or create new one
    const gratitude = await Gratitude.findOneAndUpdate(
      { 
        email: session.user.email,
        date: new Date(date)
      },
      { 
        email: session.user.email,
        date: new Date(date),
        gratitudes,
        updatedAt: new Date()
      },
      { 
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log('Saved gratitude:', gratitude); // Debug log
    return NextResponse.json(gratitude);
  } catch (error) {
    console.error('Error in POST /api/gratitudes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/gratitudes - Delete gratitudes for a specific date
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = await req.json();

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    await connectDB();
    await Gratitude.deleteOne({ email, date: new Date(date) });

    return NextResponse.json({ message: 'Gratitudes deleted successfully' });
  } catch (error) {
    console.error('Error deleting gratitudes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 