// features/email-inbox/hooks/useLogisticsForEmail.js
// Fetches the single /emails/logistics/{emailId} record for whichever
// email is currently open, re-fetching whenever emailId changes.
// Replaces the older useLogistics.js, which fetched all 100 logistics
// records up front and matched them client-side — that was a workaround
// for not having a single-record endpoint yet.
import { useEffect, useState } from 'react';
import { fetchLogisticsForEmail } from '../api/logisticsApi';

export function useLogisticsForEmail(emailId) {
  const [logistics, setLogistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!emailId) {
      setLogistics(null);
      setLoading(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchLogisticsForEmail(emailId)
      .then((data) => {
        if (cancelled) return;
        setLogistics(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('fetchLogisticsForEmail failed:', err);
        setError(err.message || 'Failed to load shipment data');
        setLogistics(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [emailId]);

  return { logistics, loading, error };
}
