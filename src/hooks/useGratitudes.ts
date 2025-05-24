import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface GratitudeEntry {
  _id: string;
  email: string;
  date: string;
  gratitudes: string[];
  createdAt: string;
  updatedAt: string;
}

export function useGratitudes() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGratitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching gratitudes...'); // Debug log
      const response = await fetch('/api/gratitudes');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch gratitudes');
      }
      const data = await response.json();
      console.log('Fetched gratitudes:', data); // Debug log
      return data as GratitudeEntry[];
    } catch (err) {
      console.error('Error in getGratitudes:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveGratitudes = async (date: string, gratitudes: string[]) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Saving gratitudes:', { date, gratitudes }); // Debug log

      const response = await fetch('/api/gratitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, gratitudes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save gratitudes');
      }

      const data = await response.json();
      console.log('Saved gratitudes response:', data); // Debug log
      return data;
    } catch (err) {
      console.error('Error in saveGratitudes:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteGratitudes = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gratitudes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      if (!response.ok) throw new Error('Failed to delete gratitudes');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    getGratitudes,
    saveGratitudes,
    deleteGratitudes,
    loading,
    error,
  };
} 