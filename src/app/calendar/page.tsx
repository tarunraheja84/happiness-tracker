'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navigation from '@/components/Navigation';
import CalendarDay from '@/components/calendar/CalendarDay';
import DataPanel from '@/components/calendar/DataPanel';
import { getDateData, getHighlightedDates } from '@/components/calendar/CalendarData';
import type { CalendarData } from '@/components/calendar/CalendarData';

export default function CalendarPage() {
  const { data: session } = useSession();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState('gratitude');
  const [calendarData, setCalendarData] = useState<CalendarData>({
    gratitude: [],
    wellness: [],
    happiness: [],
    mood: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/calendar/data');
        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }
        const data = await response.json();
        console.log('Fetched Calendar Data:', data); // Debug log
        setCalendarData(data);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setError('Failed to load calendar data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [session?.user?.email]);

  // Get highlighted dates for the calendar
  const highlightedDates = getHighlightedDates(calendarData);
  
  // Get data for the selected date
  const { gratitudeData, wellnessData, happinessData, moodData } = getDateData(date, calendarData);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation activeView="calendar" setActiveView={() => {}} />
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation activeView="calendar" setActiveView={() => {}} />
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation activeView="calendar" setActiveView={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Calendar View
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review your wellness journey day by day
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Panel */}
          <CalendarDay 
            date={date}
            setDate={setDate}
            highlightedDates={highlightedDates}
          />

          {/* Data Display Panel */}
          <DataPanel
            date={date}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            gratitudeData={gratitudeData}
            wellnessData={wellnessData}
            happinessData={happinessData}
            moodData={moodData}
          />
        </div>
      </main>
    </div>
  );
} 