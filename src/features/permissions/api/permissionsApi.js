// features/permissions/api/permissionsApi.js — every Permissions
// endpoint, matching the URLs given exactly. Same pattern as
// features/roles/api/rolesApi.js.
import api from '../../../api/axios';

// GET /api/permissions/
export const getPermissionsApi = () => api.get('/api/permissions/');

// GET /api/permissions/:id/
export const getPermissionApi = (id) => api.get(`/api/permissions/${id}/`);

// POST /api/permissions/
export const createPermissionApi = (data) => api.post('/api/permissions/', data);

// PATCH /api/permissions/:id/
export const updatePermissionApi = (id, data) => api.patch(`/api/permissions/${id}/`, data);

// DELETE /api/permissions/:id/
export const deletePermissionApi = (id) => api.delete(`/api/permissions/${id}/`);

