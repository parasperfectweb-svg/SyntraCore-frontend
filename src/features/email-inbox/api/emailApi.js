// features/email-inbox/api/emailApi.js
import api from './emailApiClient';
import { mapApiEmailToUiEmail } from './mapEmail';

// Backends commonly wrap a list response instead of returning a bare
// array — most often Django REST Framework's default pagination shape
// ({ count, next, previous, results: [...] }), but a few other common
// wrapper keys are checked too. Silently defaulting to [] here (the
// previous behavior) is exactly what made a wrapped response look like
// "no emails" with no error anywhere — this makes that failure loud
// instead, so a genuinely unexpected shape surfaces as a real error
// through useEmails' error state rather than an empty inbox.
function extractEmailList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results; // DRF pagination
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.emails)) return data.emails;

  console.error('GET /emails returned an unrecognized shape:', data);
  throw new Error(
    "The server's email list response wasn't in a recognized shape — check the console for the raw response."
  );
}

/**
 * GET /emails?skip=&limit=
 * Returns the real inbox — mapped from the API's raw shape (id, sender,
 * recipient, subject, body_plain, body_html, received_at, attachments,
 * ...) into what EmailList/EmailDetail expect. See mapEmail.js for the
 * field-by-field mapping and the fields the API doesn't yet return.
 */
export async function fetchEmails({ skip = 0, limit = 100 } = {}) {
  const response = await api.get('/emails', { params: { skip, limit } });
  const raw = extractEmailList(response.data);
  return raw.map(mapApiEmailToUiEmail);
}

export async function markEmailRead(id) {
  return api.put(`/emails/${id}`, { unread: false });
}

/**
 * DELETE /info?id={id}
 * Deletes a single mail. Named "/info" (not "/emails/{id}") and takes
 * the id as a query param (not a path param) — that's just how this
 * particular endpoint is shaped on the backend, unlike markEmailRead
 * above; not a typo.
 */
export async function deleteEmail(id) {
  return api.delete('/info', { params: { id } });
}