// features/roles/api/rolesApi.js — every Roles endpoint, matching the
// URLs given exactly. Goes through the one shared axios instance
// (api/axios.js), same pattern as authApi.js.
import api from '../../../api/axios';

// GET /api/roles/
export const getRolesApi = () => api.get('/api/roles/');

// GET /api/roles/:id
export const getRoleApi = (id) => api.get(`/api/roles/${id}`);

// POST /api/roles/
export const createRoleApi = (data) => api.post('/api/roles/', data);

// PATCH /api/roles/:id/
export const updateRoleApi = (id, data) => api.patch(`/api/roles/${id}/`, data);

// DELETE /api/roles/:id/
export const deleteRoleApi = (id) => api.delete(`/api/roles/${id}/`);
