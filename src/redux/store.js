// redux/store.js — the single Redux store for the whole app. Every
// slice's reducer is registered here; nothing else creates a store.
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import rolesReducer from './slices/rolesSlice';
import permissionsReducer from './slices/permissionsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    users: usersReducer,
  },
});
