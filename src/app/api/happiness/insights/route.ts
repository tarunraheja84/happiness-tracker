import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { Happiness } from '@/models/Happiness';
import { authOptions } from '@/lib/auth';
import { subDays, format, isWeekend } from 'date-fns';

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
    }).sort({ date: 1 });

    if (happinessData.length === 0) {
      return NextResponse.json([
        "Start tracking your happiness to get personalized insights! 📈",
        "Add your first happiness reflection to begin your journey 🌟",
        "Your insights will appear here as you track your mood 📊",
        "The more you track, the better insights you'll get! 🎯"
      ]);
    }

    const insights: string[] = [];

    // Calculate average happiness scores
    const weekdayScores = happinessData.filter(entry => !isWeekend(entry.date));
    const weekendScores = happinessData.filter(entry => isWeekend(entry.date));
    
    const avgWeekdayScore = weekdayScores.reduce((sum, entry) => sum + entry.score, 0) / weekdayScores.length;
    const avgWeekendScore = weekendScores.reduce((sum, entry) => sum + entry.score, 0) / weekendScores.length;

    if (avgWeekendScore > avgWeekdayScore) {
      insights.push(`You're ${Math.round((avgWeekendScore - avgWeekdayScore) * 10)}% happier on weekends! 🌅`);
    }

    // Analyze mood detractors
    const detractorsCount = new Map<string, number>();
    happinessData.forEach(entry => {
      entry.moodDetractors.forEach(detractor => {
        const count = detractorsCount.get(detractor.label) || 0;
        detractorsCount.set(detractor.label, count + 1);
      });
    });

    const mostCommonDetractor = Array.from(detractorsCount.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (mostCommonDetractor) {
      insights.push(`${mostCommonDetractor[0]} affects your mood ${Math.round((mostCommonDetractor[1] / happinessData.length) * 100)}% of the time 🎯`);
    }

    // Analyze happiness trends
    const recentScores = happinessData.slice(-7);
    const avgRecentScore = recentScores.reduce((sum, entry) => sum + entry.score, 0) / recentScores.length;
    const avgOverallScore = happinessData.reduce((sum, entry) => sum + entry.score, 0) / happinessData.length;

    if (avgRecentScore > avgOverallScore) {
      insights.push(`Your happiness has improved by ${Math.round((avgRecentScore - avgOverallScore) * 10)}% in the last week! 📈`);
    }

    // Add streak information
    const streak = happinessData.length;
    if (streak > 0) {
      insights.push(`You've tracked your happiness for ${streak} days in a row! Keep up the great work! 🎉`);
    }

    // If we don't have enough insights, add some general ones
    while (insights.length < 4) {
      const generalInsights = [
        "Regular tracking helps identify patterns in your mood 📊",
        "Try to maintain a consistent sleep schedule for better mood 🌙",
        "Exercise can significantly improve your happiness levels 🏃‍♀️",
        "Practicing gratitude daily can boost your overall happiness 🙏",
        "Social connections are key to long-term happiness 👥",
        "Mindfulness can help manage stress and improve mood 🧘‍♀️"
      ];
      insights.push(generalInsights[insights.length]);
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 