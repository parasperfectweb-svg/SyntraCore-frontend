// features/roles/utils/permissions.js
// The real API returns permissions as a flat, arbitrary list of
// { id, code, name, description } records — not fixed modules with
// View/Create/Edit/Delete actions. A role just holds an array of the
// permission objects/IDs it has. These helpers work with that shape.
// The permission record's own normalizer now lives in
// features/permissions/utils/normalizePermission.js (single source of
// truth, since Permissions is its own full CRUD feature now too).
export { normalizePermission, normalizePermissionList } from '../../permissions/utils/normalizePermission';

/** Turns a role's `permissions` array (of full objects, as the API returns) into a Set of ids for fast lookup in the form. */
export function permissionIdsFromRole(role) {
  const list = Array.isArray(role?.permissions) ? role.permissions : [];
  return new Set(list.map((p) => (typeof p === 'object' ? p.id : p)));
}

/** Builds the request body's permissions field from the form's selected-id Set. Adjust here if the API expects full objects instead of bare IDs. */
export function serializeSelectedPermissionIds(selectedIds) {
  return Array.from(selectedIds);
}

/** Short display label for the roles list table, e.g. "2 Permissions" or "No Permissions". */
export function permissionsSummaryLabel(role) {
  const count = Array.isArray(role?.permissions) ? role.permissions.length : 0;
  if (count === 0) return 'No Permissions';
  return `${count} Permission${count === 1 ? '' : 's'}`;
}
