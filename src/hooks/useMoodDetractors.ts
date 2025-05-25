import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface MoodDetractor {
  id: string;
  label: string;
  severity: number;
  notes: string;
}

export function useMoodDetractors() {
  const { data: session } = useSession();
  const [moodDetractors, setMoodDetractors] = useState<MoodDetractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoodDetractors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/mood-detractors');
      if (!response.ok) {
        throw new Error('Failed to fetch mood detractors');
      }
      const data = await response.json();
      setMoodDetractors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching mood detractors:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodDetractors = async (detractors: MoodDetractor[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/mood-detractors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(detractors),
      });
      if (!response.ok) {
        throw new Error('Failed to save mood detractors');
      }
      const savedData = await response.json();
      setMoodDetractors(savedData);
      return savedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error saving mood detractors:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchMoodDetractors();
    }
  }, [session?.user?.email]);

  return {
    moodDetractors,
    loading,
    error,
    fetchMoodDetractors,
    saveMoodDetractors,
  };
} 