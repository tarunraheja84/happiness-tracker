import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface GratitudeEntry {
  text: string;
  createdAt: Date;
}

interface WellnessActivity {
  activity: string;
  completed: boolean;
  createdAt: Date;
}

interface MoodDetractor {
  text: string;
  impact: number;
  createdAt: Date;
}

interface Entry {
  _id: string;
  date: Date;
  gratitudeEntries: GratitudeEntry[];
  wellnessChecklist: WellnessActivity[];
  happinessScore: number;
  moodDetractors: MoodDetractor[];
  reflection: {
    text: string;
    createdAt: Date;
  };
}

export function useEntries() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entryData: Partial<Entry>) => {
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      if (!response.ok) throw new Error('Failed to create entry');
      const newEntry = await response.json();
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateEntry = async (id: string, entryData: Partial<Entry>) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      if (!response.ok) throw new Error('Failed to update entry');
      const updatedEntry = await response.json();
      setEntries(prev => prev.map(entry => 
        entry._id === id ? updatedEntry : entry
      ));
      return updatedEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    if (session) {
      fetchEntries();
    }
  }, [session]);

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    refreshEntries: fetchEntries,
  };
} 