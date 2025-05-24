import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Stats {
  totalEntries: number;
  averageHappinessScore: number;
  totalGratitudeEntries: number;
  completedWellnessActivities: number;
  totalWellnessActivities: number;
  moodDetractors: number;
  averageMoodImpact: number;
}

export function useStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
} 