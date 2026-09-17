// features/quotes/api/quotesApi.js
import api from '../../../api/axios';

// Every other main-backend endpoint in this app (authApi.js, rolesApi.js,
// permissionsApi.js, usersApi.js) is consistently under /api/... — these
// two were the only ones NOT following that pattern, which is exactly
// the kind of mismatch that silently 404s (see emailApi.js's history).
// Flagging this rather than asserting it with full confidence: unlike
// the auth/roles/permissions/users routes, there's no Postman example
// confirming the real quotes path — verify against the actual backend
// route and adjust if it turns out these never had /api/ to begin with.
export async function saveDraftQuote(formState) {
  return api.post('/api/quotes/draft', formState);
}

export async function generateQuote(formState) {
  return api.post('/api/quotes/generate', formState);
}