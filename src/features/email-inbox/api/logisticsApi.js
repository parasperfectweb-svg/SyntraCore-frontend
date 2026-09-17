// features/email-inbox/api/logisticsApi.js
// First real (non-mocked) endpoint for the Email Inbox — the rest
// (all-mails list, single-mail, delete, etc.) get wired the same way one
// at a time. See emailApiClient.js for the base URL / auth / error-shape
// handling shared by every Email-Intake Engine endpoint.
import api from './emailApiClient';

// Same reasoning as emailApi.js's extractEmailList — confirmed to return
// a bare array today, but silently defaulting to [] on anything else
// (the previous behavior) would hide a future shape change (e.g.
// pagination getting added) as "no logistics data" instead of a real,
// diagnosable error.
function extractLogisticsList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;

  console.error('GET /emails/logistics returned an unrecognized shape:', data);
  throw new Error(
    "The server's logistics list response wasn't in a recognized shape — check the console for the raw response."
  );
}

/**
 * GET /emails/logistics?skip=&limit=
 * Returns the parsed shipment/logistics record extracted from each email
 * (pickup/drop location, cargo lines, incoterm, status, ...), one entry
 * per email that has logistics data, linked back to its email via
 * `email_id`.
 */
export async function fetchLogisticsData({ skip = 0, limit = 100 } = {}) {
  const response = await api.get('/emails/logistics', { params: { skip, limit } });
  return extractLogisticsList(response.data);
}

/**
 * GET /emails/logistics/{emailId}
 * Returns the single parsed shipment/logistics record for one email, by
 * its email id — used instead of fetchLogisticsData's bulk list so the
 * Email Inbox only fetches logistics data for the email currently open.
 * Resolves to `null` (not an error) when the email has no logistics
 * record extracted yet, since a 404 here is an expected, normal state.
 */
export async function fetchLogisticsForEmail(emailId) {
  if (!emailId) return null;
  try {
    const response = await api.get(`/emails/logistics/${emailId}`);
    return response.data ?? null;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}
