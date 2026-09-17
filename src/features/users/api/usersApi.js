// features/users/api/usersApi.js — every Users endpoint, matching the
// URLs given exactly. Same pattern as rolesApi.js / permissionsApi.js.
// Note: this endpoint's response wraps its list as { message, data: [...] }
// rather than the { count, results } DRF-pagination shape Roles/Permissions
// use — see usersSlice.js's extractListFromResponse, which already
// handles both shapes.
import api from '../../../api/axios';

// GET /api/auth/users/
export const getUsersApi = () => api.get('/api/auth/users/');

// GET /api/auth/users/:id/
export const getUserApi = (id) => api.get(`/api/auth/users/${id}/`);

// POST /api/auth/users/
export const createUserApi = (data) => api.post('/api/auth/users/', data);

// PATCH /api/auth/users/:id/
export const updateUserApi = (id, data) => api.patch(`/api/auth/users/${id}/`, data);

// DELETE /api/auth/users/:id/
export const deleteUserApi = (id) => api.delete(`/api/auth/users/${id}/`);