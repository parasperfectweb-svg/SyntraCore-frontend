// api/axios.js — the ONE configured axios instance for the whole app.
// Every api/*.js file (auth, email, quotes, house-jobs, ...) imports this
// directly and calls its native .get()/.post()/.put()/.delete() methods.
// There is no separate wrapper — this IS the client.
import axios from 'axios';

// The main SyntraCore backend (auth, roles, permissions, quotes,
// house-jobs, ...). This is a DIFFERENT service from the Email-Intake
// Engine (see features/email-inbox/api/emailApiClient.js) — don't point
// this one at the email service's ngrok URL, or the reverse.
//
// In dev, goes through the Vite proxy (vite.config.js, '/backend-api')
// so the browser only ever talks to the Vite dev server — same-origin,
// so no CORS preflight is ever sent, and the backend's own CORS config
// doesn't matter for local dev. In a production build there's no
// dev-server proxy, so this falls back to hitting the backend directly,
// which DOES require that backend's CORS config to allow the deployed
// frontend's origin.
const BASE_URL = import.meta.env.DEV
  ? '/backend-api'
  : (import.meta.env.VITE_API_BASE_URL || '');

const ACCESS_TOKEN_KEY = 'syntracore_access_token';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Required for ngrok's free-tier URLs — without this header, ngrok
    // returns an HTML "you're about to visit..." interstitial page
    // instead of forwarding the request to your API, and axios fails
    // trying to parse that HTML as JSON.
    'ngrok-skip-browser-warning': 'true',
  },
});

// Attach the access token to every request, if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so every catch block in the app can just do
// `catch (err) { setError(err.message) }` regardless of the backend's
// error response shape (DRF commonly returns { detail: "..." } or
// { field: ["message"] }).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      (data && typeof data === 'object' ? Object.values(data).flat().join(' ') : null) ||
      error.message ||
      'Something went wrong. Please try again.';
    const wrappedError = new Error(message);
    // Preserved so callers can branch on status (e.g. treating a 404 as
    // "no record yet" instead of a real failure) without needing the
    // original axios error, which this interceptor otherwise discards.
    wrappedError.status = error.response?.status;
    return Promise.reject(wrappedError);
  }
);

export default api;
