// features/email-inbox/hooks/useEmails.js
// Owns the Email Inbox page's data + selection state: fetching the list,
// which email is selected, read/unread status, and the All/Unread filter.
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchEmails, markEmailRead, deleteEmail } from '../api/emailApi';

export function useEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchEmails()
      .then((data) => {
        if (cancelled) return;
        setEmails(data);
        setSelectedId(data[0]?.id ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        // Previously swallowed silently — a failed request left the
        // inbox stuck on its empty initial state with no indication
        // anything had gone wrong. Surface it instead.
        console.error('fetchEmails failed:', err);
        setError(err.message || 'Failed to load emails');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const selectEmail = useCallback((id) => {
    setSelectedId(id);
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, unread: false } : e)));
    markEmailRead(id);
  }, []);

  // Optimistically removes the email from the list first (deleting is a
  // rare, deliberate action — the person already confirmed it in the UI
  // before this runs), then calls the real API. On failure, puts it back
  // and surfaces why, rather than leaving the inbox looking like it
  // silently succeeded when it didn't.
  const removeEmail = useCallback(async (id) => {
    const previous = emails;
    const deletedEmail = previous.find((e) => e.id === id);
    if (!deletedEmail) return;

    setDeletingId(id);
    setEmails((prev) => prev.filter((e) => e.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));

    try {
      await deleteEmail(id);
    } catch (err) {
      console.error('deleteEmail failed:', err);
      setEmails(previous);
      setSelectedId(id);
      // Deliberately NOT setError() here — that state drives EmailList's
      // "couldn't load emails" / empty-inbox branches, and reusing it for
      // a delete failure would incorrectly hide the (still-populated)
      // list behind that banner. The caller (EmailInboxPage) surfaces
      // this failure itself from the thrown error instead.
      throw err;
    } finally {
      setDeletingId((prev) => (prev === id ? null : prev));
    }
  }, [emails]);

  const visibleEmails = useMemo(
    () => (filter === 'unread' ? emails.filter((e) => e.unread) : emails),
    [emails, filter]
  );

  const selectedEmail = useMemo(
    () => emails.find((e) => e.id === selectedId) ?? null,
    [emails, selectedId]
  );

  const unreadCount = useMemo(() => emails.filter((e) => e.unread).length, [emails]);

  return {
    emails: visibleEmails,
    loading,
    error,
    selectedEmail,
    selectedId,
    selectEmail,
    removeEmail,
    deletingId,
    filter,
    setFilter,
    unreadCount,
  };
}
