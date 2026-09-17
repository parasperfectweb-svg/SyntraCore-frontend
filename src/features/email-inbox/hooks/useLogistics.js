// features/email-inbox/hooks/useLogistics.js
// Fetches every logistics record once (skip=0, limit=100 — the same page
// size the API is currently called with in Postman) and indexes it by
// email_id, so EmailInboxPage can hand EmailDetail whichever record
// belongs to the currently-open email with a plain object lookup instead
// of a fresh request per email.
import { useEffect, useMemo, useState } from 'react';
import { fetchLogisticsData } from '../api/logisticsApi';

export function useLogistics() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchLogisticsData({ skip: 0, limit: 100 })
      .then((data) => {
        if (cancelled) return;
        setRecords(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const byEmailId = useMemo(() => {
    const map = new Map();
    records.forEach((record) => {
      if (record.email_id) map.set(record.email_id, record);
    });
    return map;
  }, [records]);

  const getLogisticsForEmail = (emailId) => byEmailId.get(emailId) ?? null;

  return { loading, error, getLogisticsForEmail };
}
