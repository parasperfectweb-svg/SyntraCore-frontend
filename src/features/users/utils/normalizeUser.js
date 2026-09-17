// features/users/utils/normalizeUser.js
export function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  return {
    id: raw.id,
    email: raw.email ?? '',
    username: raw.username ?? '',
    firstName: raw.first_name ?? raw.firstName ?? '',
    lastName: raw.last_name ?? raw.lastName ?? '',
    roles: Array.isArray(raw.roles) ? raw.roles : [],
    isActive: Boolean(raw.is_active ?? raw.isActive),
    permissions: Array.isArray(raw.permissions) ? raw.permissions : [],
  };
}

export function normalizeUserList(list) {
  return Array.isArray(list) ? list.map(normalizeUser) : [];
}

/** Full name if either part exists, otherwise the part of the email before "@". */
export function userDisplayName(user) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (name) return name;
  return user.email ? user.email.split('@')[0] : '—';
}

/** Turns a user's `roles` array (of full objects, as the API returns) into a Set of ids for the form. */
export function roleIdsFromUser(user) {
  const list = Array.isArray(user?.roles) ? user.roles : [];
  return new Set(list.map((r) => (typeof r === 'object' ? r.id : r)));
}

export function serializeSelectedRoleIds(selectedIds) {
  return Array.from(selectedIds);
}
