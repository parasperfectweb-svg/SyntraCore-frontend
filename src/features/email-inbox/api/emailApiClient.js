// features/email-inbox/api/emailApiClient.js — dedicated axios instance
// for the Email-Intake Engine. This is a SEPARATE backend service from
// the main SyntraCore API (src/api/axios.js, which talks to
// VITE_API_BASE_URL — your local backend on :8000 for auth/roles/quotes/
// etc.). Pointing email-inbox requests at that same client was the bug:
// whatever VITE_API_BASE_URL is set to for the main app always won,
// so /emails kept 404ing against a backend that's never had that route.
// Every email-inbox api/*.js file (emailApi.js, logisticsApi.js, ...)
// should import THIS client, not '../../../api/axios'.
import axios from 'axios';

// Override with VITE_EMAIL_API_BASE_URL in .env if the ngrok tunnel URL
// changes (free-tier ngrok URLs rotate on restart) or for a different
// environment.
//
// In dev, goes through the Vite proxy (vite.config.js, '/email-api') for
// the same reason as the main client (src/api/axios.js): same-origin to
// the Vite dev server means no CORS preflight is ever sent, regardless
// of whether the ngrok backend's own CORS config allows this origin. In
// a production build there's no dev-server proxy, so this falls back to
// calling the ngrok URL (or VITE_EMAIL_API_BASE_URL) directly, which
// does require that backend to allow the deployed frontend's origin.
const EMAIL_API_BASE_URL = import.meta.env.DEV
  ? '/email-api'
  : (import.meta.env.VITE_EMAIL_API_BASE_URL || 'https://confider-atom-resonate.ngrok-free.dev');

const ACCESS_TOKEN_KEY = 'syntracore_access_token';

const emailApiClient = axios.create({
  baseURL: EMAIL_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Required for ngrok's free-tier URLs — without this header, ngrok
    // returns an HTML "you're about to visit..." interstitial page
    // instead of forwarding the request to the API, and axios fails
    // trying to parse that HTML as JSON.
    'ngrok-skip-browser-warning': 'true',
  },
});

// Same auth token as the main app — the Email-Intake Engine is a
// different service, but it's still SyntraCore's own backend, so it's
// reasonable to expect it to accept the same bearer token. Drop this if
// it turns out to need its own separate auth.
emailApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Same error-shape normalization as the main app's client (src/api/axios.js)
// so every catch block here can do `catch (err) { setError(err.message) }`
// too, regardless of which of the two backends it's talking to.
emailApiClient.interceptors.response.use(
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
    wrappedError.status = error.response?.status;
    return Promise.reject(wrappedError);
  }
);

export default emailApiClient;
