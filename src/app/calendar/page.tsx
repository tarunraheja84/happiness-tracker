'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import CalendarDay from '@/components/calendar/CalendarDay';
import DataPanel from '@/components/calendar/DataPanel';
import { mockData, getDateData, getHighlightedDates } from '@/components/calendar/CalendarData';

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState('gratitude');

  // Get highlighted dates for the calendar
  const highlightedDates = getHighlightedDates(mockData);
  
  // Get data for the selected date
  const { gratitudeData, wellnessData, happinessData, moodData } = getDateData(date, mockData);

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