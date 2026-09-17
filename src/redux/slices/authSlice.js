// redux/slices/authSlice.js — replaces the old store/authStore.js
// (zustand). Same responsibility: hold the logged-in user + auth flag,
// and persist tokens to localStorage under the same keys api/axios.js
// reads from (rename here => rename there too).
//
// Login/Register/VerifyOtp/ForgotPassword/ResetPassword pages still call
// the plain async functions in api/authApi.js directly and manage their
// own submitting/error state locally (unchanged) — this slice only
// stores the *result* of a successful login via setCredentials.
import { createSlice } from '@reduxjs/toolkit';

const ACCESS_TOKEN_KEY = 'syntracore_access_token';
const REFRESH_TOKEN_KEY = 'syntracore_refresh_token';
const USER_KEY = 'syntracore_user';

function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

const initialState = {
  user: loadStoredUser(),
  isAuthenticated: Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Call after a successful /api/auth/token/ (or signup+verify) response.
    // `user` is optional — the token endpoint in this API doesn't return a
    // profile object, so it'll just be null until a /me-style endpoint exists.
    setCredentials(state, action) {
      const { access, refresh, user = null } = action.payload;
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      state.user = user;
      state.isAuthenticated = true;
    },
    logout(state) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
