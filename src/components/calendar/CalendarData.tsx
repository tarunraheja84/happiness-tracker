import { format, startOfDay, isSameDay } from 'date-fns';

// Mock data types
export interface GratitudeItem {
  date: Date;
  items: string[];
}

export interface WellnessItem {
  date: Date;
  meditation: number;
  sleep: number;
  exercise: number;
  steps: number;
  water: boolean;
  healthy: boolean;
}

export interface HappinessItem {
  date: Date;
  rating: number;
  notes: string;
}

export interface MoodItem {
  date: Date;
  issues: string[];
  severity: number[];
  notes: string;
}

export interface CalendarData {
  gratitude: GratitudeItem[];
  wellness: WellnessItem[];
  happiness: HappinessItem[];
  mood: MoodItem[];
}

// Mock data - in a real app, this would come from a database
export const mockData: CalendarData = {
  gratitude: [
    { date: new Date(2025, 4, 22), items: ['Family support', 'Morning coffee', 'Good weather'] },
    { date: new Date(2025, 4, 21), items: ['Career progress', 'Health', 'Friends'] },
    { date: new Date(2025, 4, 20), items: ['Good book', 'Peaceful day', 'Delicious meal'] },
    { date: new Date(), items: ['Beautiful sunrise', 'Good night sleep', 'Productive day'] },
  ],
  wellness: [
    { date: new Date(), meditation: 15, sleep: 7.5, exercise: 30, steps: 8500, water: true, healthy: true },
    { date: new Date(2025, 4, 22), meditation: 20, sleep: 8, exercise: 45, steps: 10200, water: true, healthy: true },
    { date: new Date(2025, 4, 21), meditation: 10, sleep: 6.5, exercise: 0, steps: 5000, water: false, healthy: false },
  ],
  happiness: [
    { date: new Date(), rating: 8, notes: 'Overall a good day with minor stress' },
    { date: new Date(2025, 4, 22), rating: 9, notes: 'Excellent day, everything went well' },
    { date: new Date(2025, 4, 21), rating: 6, notes: 'Felt tired and a bit unmotivated' },
  ],
  mood: [
    { date: new Date(), issues: ['Stress', 'Overthinking'], severity: [3, 2], notes: 'Work deadline approaching' },
    { date: new Date(2025, 4, 22), issues: [], severity: [], notes: 'No mood issues today' },
    { date: new Date(2025, 4, 21), issues: ['Anxiety', 'Burnout'], severity: [4, 3], notes: 'Feeling overwhelmed' },
  ]
};

// Helper to convert date objects to string format for comparison
export const formatDateForComparison = (date: Date) => format(date, 'yyyy-MM-dd');

// Function to get data for a selected date
export const getDateData = (date: Date, data: CalendarData) => {
  const selectedDate = startOfDay(date);
  
  return {
    gratitudeData: data.gratitude.find(item => 
      isSameDay(item.date, selectedDate)
    ),
    wellnessData: data.wellness.find(item => 
      isSameDay(item.date, selectedDate)
    ),
    happinessData: data.happiness.find(item => 
      isSameDay(item.date, selectedDate)
    ),
    moodData: data.mood.find(item => 
      isSameDay(item.date, selectedDate)
    )
  };
};

// Get all dates with data for highlighting on calendar
export const getHighlightedDates = (data: CalendarData) => {
  const allDates = new Set<string>();
  
  data.gratitude.forEach(item => allDates.add(format(startOfDay(item.date), 'yyyy-MM-dd')));
  data.wellness.forEach(item => allDates.add(format(startOfDay(item.date), 'yyyy-MM-dd')));
  data.happiness.forEach(item => allDates.add(format(startOfDay(item.date), 'yyyy-MM-dd')));
  data.mood.forEach(item => allDates.add(format(startOfDay(item.date), 'yyyy-MM-dd')));
  
  return Array.from(allDates).map(dateStr => new Date(dateStr));
};
