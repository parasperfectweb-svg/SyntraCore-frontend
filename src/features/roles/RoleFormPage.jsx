// features/roles/RoleFormPage.jsx — the "Add New Role" / "Edit Role"
// screen. Renders one selectable card per permission from the real
// permissions catalog (permissionsSlice.js -> GET /api/permissions/).
// Each card highlights clearly when assigned, shows its description
// inline (not just on hover), and there's a live "X of Y selected"
// count plus a filter box so this scales as the catalog grows.
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchRoleById,
  createRole,
  updateRole,
  clearCurrentRole,
  selectCurrentRole,
  selectRolesActionStatus,
  selectRolesError,
} from '../../redux/slices/rolesSlice';
import {
  fetchPermissions,
  selectAllPermissions,
  selectPermissionsStatus,
} from '../../redux/slices/permissionsSlice';
import { permissionIdsFromRole, serializeSelectedPermissionIds } from './utils/permissions';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export default function RoleFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentRole = useSelector(selectCurrentRole);
  const actionStatus = useSelector(selectRolesActionStatus);
  const apiError = useSelector(selectRolesError);
  const permissionsCatalog = useSelector(selectAllPermissions);
  const permissionsCatalogStatus = useSelector(selectPermissionsStatus);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [permSearch, setPermSearch] = useState('');

  useEffect(() => {
    dispatch(fetchPermissions());
    if (isEditing) {
      dispatch(fetchRoleById(id));
    }
    return () => {
      dispatch(clearCurrentRole());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentRole && String(currentRole.id) === String(id)) {
      setRoleName(currentRole.name);
      setDescription(currentRole.description || '');
      setSelectedIds(permissionIdsFromRole(currentRole));
    }
  }, [isEditing, currentRole, id]);

  const togglePermission = (permId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return next;
    });
  };

  const allSelected =
    permissionsCatalog.length > 0 && permissionsCatalog.every((p) => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (allSelected) return new Set();
      return new Set(permissionsCatalog.map((p) => p.id));
    });
  };

  const filteredCatalog = useMemo(() => {
    const q = permSearch.trim().toLowerCase();
    const sorted = [...permissionsCatalog].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return sorted;
    return sorted.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
  }, [permissionsCatalog, permSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: roleName,
      description,
      // Backend serializer treats `permissions` as read_only (it's the
      // full-object field returned on GET). The writable field is
      // `permission_ids`, sent as a flat array of IDs — using
      // `permissions` here was being silently discarded by DRF before
      // validation, which is why saves succeeded but permissions never
      // actually changed.
      permission_ids: serializeSelectedPermissionIds(selectedIds),
    };

    const action = isEditing
      ? updateRole({ id, data: payload })
      : createRole(payload);

    const result = await dispatch(action);
    if (!result.error) {
      navigate('/settings/roles');
    }
  };

  const saving = actionStatus === 'loading';
  const loadingPermissions = permissionsCatalogStatus === 'loading';

  return (
    <div className="p-4">
      <h1 className="h4 fw-bold mb-3">{isEditing ? 'Edit Role' : 'Add New Role'}</h1>

      <div className="card shadow-sm">
        <div className="card-body">
          {apiError && (
            <div className="alert alert-danger py-2">{apiError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Role Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="bg-light rounded text-center py-2 fw-semibold mb-3">
              Assign Permissions
            </div>

            {loadingPermissions ? (
              <div className="text-center text-muted py-4">Loading permissions…</div>
            ) : permissionsCatalog.length === 0 ? (
              <div className="text-center text-muted py-4">No permissions available.</div>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <div className="form-check mb-0">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="select-all-permissions"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="select-all-permissions">
                      Select all
                    </label>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary-subtle text-primary fw-medium">
                      {selectedIds.size} of {permissionsCatalog.length} selected
                    </span>
                    <div className="input-group input-group-sm" style={{ width: 220 }}>
                      <span className="input-group-text bg-white text-muted">
                        <SearchIcon />
                      </span>
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Filter permissions..."
                        value={permSearch}
                        onChange={(e) => setPermSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-2 mb-4">
                  {filteredCatalog.length === 0 ? (
                    <div className="col-12 text-center text-muted py-3 small">
                      No permissions match "{permSearch}".
                    </div>
                  ) : (
                    filteredCatalog.map((perm) => {
                      const checked = selectedIds.has(perm.id);
                      return (
                        <div className="col-md-4" key={perm.id}>
                          <label
                            htmlFor={`perm-${perm.id}`}
                            className={`d-flex align-items-start gap-2 border rounded p-2 h-100 mb-0 ${
                              checked ? 'border-primary bg-primary-subtle' : 'bg-white'
                            }`}
                            style={{ cursor: 'pointer' }}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input mt-1 flex-shrink-0"
                              id={`perm-${perm.id}`}
                              checked={checked}
                              onChange={() => togglePermission(perm.id)}
                            />
                            <span className="d-block">
                              <span className="d-block fw-semibold mb-1">{perm.name}</span>
                              {perm.description && (
                                <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                                  {perm.description}
                                </span>
                              )}
                            </span>
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Role'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/settings/roles')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
