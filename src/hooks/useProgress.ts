import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        setProgress(data);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();
  }, []);

  const updateProgress = async (newProgress: Partial<UserProgress>) => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgress)
      });
      const data = await res.json();
      setProgress(data);
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  return { progress, updateProgress };
};
