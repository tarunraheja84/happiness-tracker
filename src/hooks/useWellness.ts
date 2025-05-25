import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface WellnessData {
  email: string;
  date: Date;
  meditation: number;
  sleep: number;
  exercise: number;
  water: number;
  healthyMeals: boolean;
  wakeTime: string;
  completed: boolean;
}

export function useWellness() {
  const { data: session } = useSession();
  const [wellness, setWellness] = useState<WellnessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWellness = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/wellness');
      if (!response.ok) {
        throw new Error('Failed to fetch wellness data');
      }
      const data = await response.json();
      setWellness(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching wellness data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveWellness = async (data: Partial<WellnessData>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/wellness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to save wellness data');
      }
      const savedData = await response.json();
      setWellness(savedData);
      return savedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error saving wellness data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchWellness();
    }
  }, [session?.user?.email]);

  return {
    wellness,
    loading,
    error,
    fetchWellness,
    saveWellness,
  };
} 