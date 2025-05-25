import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface MoodDetractor {
  id: string;
  label: string;
  severity: number;
  notes: string;
}

interface HappinessData {
  email: string;
  date: Date;
  score: number;
  reflection: string;
  moodDetractors: MoodDetractor[];
}

export function useHappiness() {
  const { data: session } = useSession();
  const [happinessData, setHappinessData] = useState<HappinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHappiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/happiness');
      if (!response.ok) {
        throw new Error('Failed to fetch happiness data');
      }
      const data = await response.json();
      setHappinessData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching happiness data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveHappiness = async (data: Partial<HappinessData>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/happiness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to save happiness data');
      }
      const savedData = await response.json();
      setHappinessData(savedData);
      return savedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error saving happiness data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchHappiness();
    }
  }, [session?.user?.email]);

  return {
    happinessData,
    loading,
    error,
    fetchHappiness,
    saveHappiness,
  };
} 