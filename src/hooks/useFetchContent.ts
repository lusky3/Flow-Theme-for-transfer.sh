import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Settled {
  url: string;
  data: string | null;
  error: string | null;
}

export function useFetchContent(url: string): FetchState<string> {
  const [settled, setSettled] = useState<Settled | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load file');
        return res.text();
      })
      .then((data) => {
        if (!cancelled) setSettled({ url, data, error: null });
      })
      .catch((err) => {
        if (!cancelled) setSettled({ url, data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Loading is derived: any result for a different url is stale.
  if (!settled || settled.url !== url) return { data: null, loading: true, error: null };
  return { data: settled.data, loading: false, error: settled.error };
}
