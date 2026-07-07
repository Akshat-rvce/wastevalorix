import { useState, useCallback, useEffect } from 'react';

const API_URL = '/api/analyses';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAnalysis = async (results) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results)
      });
      if (res.ok) {
        getHistory(); // Refresh history
      }
    } catch (err) {
      console.error('Failed to save analysis:', err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  const clearAll = async () => {
    try {
      const res = await fetch(API_URL, { method: 'DELETE' });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const getTotalStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      return data && data.totalKg !== undefined ? data : { totalKg: 0, totalKwh: 0, totalCo2: 0, totalValue: 0, count: 0 };
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      return { totalKg: 0, totalKwh: 0, totalCo2: 0, totalValue: 0, count: 0 };
    }
  };

  // Pre-fetch on mount
  useEffect(() => {
    getHistory();
  }, [getHistory]);

  return { history, loading, error, getHistory, saveAnalysis, deleteEntry, clearAll, getTotalStats };
};
