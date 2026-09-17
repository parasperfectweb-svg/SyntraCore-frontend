// features/permissions/utils/normalizePermission.js
export function normalizePermission(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  return {
    id: raw.id,
    code: raw.code ?? '',
    name: raw.name ?? '',
    description: raw.description ?? '',
  };
}

export function normalizePermissionList(list) {
  return Array.isArray(list) ? list.map(normalizePermission) : [];
}
