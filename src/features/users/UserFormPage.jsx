import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchUserById,
  createUser,
  updateUser,
  clearCurrentUser,
  selectEditingUser,
  selectUsersActionStatus,
  selectUsersError,
} from '../../redux/slices/usersSlice';
import { fetchRoles, selectAllRoles } from '../../redux/slices/rolesSlice';
import { roleIdsFromUser, serializeSelectedRoleIds } from './utils/normalizeUser';

// ── Small inline icons — kept local to this file since none are reused
// elsewhere yet. If a 3rd form ends up needing the same set, promote
// these into components/ui/icons/ instead of copy-pasting again. ──────
const iconProps = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

const PersonIcon = () => (<svg {...iconProps}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>);
const MailIcon = () => (<svg {...iconProps}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>);
const InfoIcon = () => (<svg {...iconProps} stroke="none" fill="currentColor" width="14" height="14"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>);
const ShieldCheckIcon = () => (<svg {...iconProps}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>);
const PeopleIcon = () => (<svg {...iconProps}><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3 3-5 7-5s7 2 7 5" /><circle cx="17" cy="8" r="2.5" /><path d="M16 13.2c2.5.4 4 1.9 4 3.8" /></svg>);
const CrownIcon = () => (<svg {...iconProps}><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" /></svg>);
const SaveIcon = () => (<svg {...iconProps} width="15" height="15"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>);
const CloseIcon = () => (<svg {...iconProps} width="15" height="15"><path d="M6 6l12 12M18 6L6 18" /></svg>);
const SearchIcon = () => (<svg {...iconProps} width="14" height="14"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
const WarnIcon = () => (<svg {...iconProps} width="12" height="12" stroke="none" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>);

// Cycles a small palette of icon+color combos across role cards, purely
// for visual variety — the API doesn't return an icon/color per role.
const ROLE_BADGE_PALETTE = [
  { Icon: CrownIcon, bg: '#dbeafe', color: '#2563eb' },
  { Icon: PersonIcon, bg: '#f3e8ff', color: '#9333ea' },
  { Icon: ShieldCheckIcon, bg: '#dcfce7', color: '#16a34a' },
  { Icon: PeopleIcon, bg: '#ffedd5', color: '#ea580c' },
];

function SectionHeader({ icon, iconBg, iconColor, title, subtitle, right }) {
  return (
    <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
      <div className="d-flex align-items-start gap-3">
        {/* <span
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 40, height: 40, background: iconBg, color: iconColor }}
        >
          {icon}
        </span> */}
        <div>
          <div className="fw-bold">{title}</div>
          {subtitle && <div className="text-muted small">{subtitle}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

const EMPTY_FORM = { email: '', firstName: '', lastName: '', password: '', isActive: true };

export default function UserFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectEditingUser);
  const actionStatus = useSelector(selectUsersActionStatus);
  const apiError = useSelector(selectUsersError);
  const rolesCatalog = useSelector(selectAllRoles);

  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedRoleIds, setSelectedRoleIds] = useState(new Set());
  const [roleSearch, setRoleSearch] = useState('');

  useEffect(() => {
    dispatch(fetchRoles());
    if (isEditing) {
      dispatch(fetchUserById(id));
    }
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentUser && String(currentUser.id) === String(id)) {
      setForm({
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        password: '',
        isActive: currentUser.isActive,
      });
      setSelectedRoleIds(roleIdsFromUser(currentUser));
    }
  }, [isEditing, currentUser, id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleRole = (roleId) => {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  };

  const allRolesSelected =
    rolesCatalog.length > 0 && rolesCatalog.every((r) => selectedRoleIds.has(r.id));

  const toggleSelectAllRoles = () => {
    setSelectedRoleIds((prev) => {
      if (allRolesSelected) return new Set();
      return new Set(rolesCatalog.map((r) => r.id));
    });
  };

  const filteredRoles = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    const sorted = [...rolesCatalog].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return sorted;
    return sorted.filter((r) => r.name.toLowerCase().includes(q));
  }, [rolesCatalog, roleSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      // Email is immutable after creation on this backend — sending it
      // at all during an edit gets rejected with "Email address cannot
      // be updated", even if the value is unchanged. Only send it when
      // creating a brand-new user.
      ...(!isEditing ? { email: form.email } : {}),
      first_name: form.firstName,
      last_name: form.lastName,
      is_active: form.isActive,
      role_ids: serializeSelectedRoleIds(selectedRoleIds),
      ...(!isEditing && form.password ? { password: form.password } : {}),
    };

    const action = isEditing
      ? updateUser({ id, data: payload })
      : createUser(payload);

    const result = await dispatch(action);
    if (!result.error) {
      navigate('/settings/users');
    }
  };

  const saving = actionStatus === 'loading';
  const goBack = () => navigate('/settings/users');

  return (
    <div className="p-4" style={{ background: '#f8f9fb', minHeight: '100%' }}>
      <div className="bg-white rounded-4 shadow-sm">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="d-flex align-items-start justify-content-between p-4 border-bottom">
          <div className="d-flex align-items-start gap-3">
            <span
              className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 48, height: 48 }}
            >
              <PersonIcon />
            </span>
            <div>
              <h1 className="h4 fw-bold mb-1">{isEditing ? 'Edit User' : 'Add New User'}</h1>
              <p className="text-muted mb-0">
                {isEditing
                  ? 'Update the user details and manage their access roles.'
                  : 'Create a new user account and assign their access roles.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 36, height: 36 }}
            aria-label="Close"
            onClick={goBack}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4">
          {apiError && <div className="alert alert-danger py-2">{apiError}</div>}

          <form onSubmit={handleSubmit}>

            {/* ── Section 1: Basic Information ───────────────────────── */}
            <div className="border rounded-4 p-4 mb-4">
              <div className="">
                <SectionHeader
                  title="Basic Information"
                />
              </div>

              <div className="row g-3">
                <div className={isEditing ? 'col-12' : 'col-md-6'}>
                  <label className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span
                      className={`input-group-text border-end-0 ${isEditing ? 'bg-primary-subtle text-primary' : 'bg-light text-muted'}`}
                    >
                      <MailIcon />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control border-start-0 ps-0 ${isEditing ? 'bg-primary-subtle' : ''}`}
                      value={form.email}
                      onChange={onChange}
                      required
                      disabled={isEditing}
                      title={isEditing ? "Email can't be changed after the account is created" : undefined}
                    />
                  </div>
                  {isEditing && (
                    <div className="d-flex align-items-center gap-1 text-danger small mt-1">
                      <WarnIcon />
                      Email can't be changed after the account is created.
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={onChange}
                      required
                    />
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    First Name {isEditing && <span className="text-danger">*</span>}
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <PersonIcon />
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control border-start-0 ps-0"
                      value={form.firstName}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Last Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <PersonIcon />
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control border-start-0 ps-0"
                      value={form.lastName}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Account Status ───────────────────────────── */}
            <div
              className={`rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3 ${
                form.isActive ? 'bg-success-subtle' : 'bg-light'
              }`}
            >
              <div className="d-flex align-items-start gap-3">
                <span
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40, height: 40,
                    background: form.isActive ? '#16a34a' : '#adb5bd',
                    color: '#fff',
                  }}
                >
                  <ShieldCheckIcon />
                </span>
                <div>
                  <div className={`fw-bold ${form.isActive ? 'text-success' : 'text-secondary'}`}>
                    Account Status
                  </div>
                  <div className="text-muted small">
                    {form.isActive
                      ? 'This user can log in and access the system.'
                      : 'This user cannot log in until reactivated.'}
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch mb-0">
                  <input
                    type="checkbox"
                    role="switch"
                    className="form-check-input"
                    style={{ width: '2.75rem', height: '1.5rem', cursor: 'pointer' }}
                    id="user-is-active"
                    name="isActive"
                    checked={form.isActive}
                    onChange={onChange}
                  />
                </div>
                <label htmlFor="user-is-active" className={`fw-semibold mb-0 ${form.isActive ? 'text-success' : 'text-secondary'}`}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </label>
              </div>
            </div>

            {/* ── Section 3: Assign Roles ─────────────────────────────── */}
            <div className="border rounded-4 p-4 mb-4">
              <SectionHeader
                icon={<PeopleIcon />}
                iconBg="#dbeafe"
                iconColor="#2563eb"
                title="Assign Roles"
                subtitle="Select the roles you want to assign to this user."
                right={
                  rolesCatalog.length > 0 && (
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary-subtle text-primary fw-medium">
                        {selectedRoleIds.size} of {rolesCatalog.length} selected
                      </span>
                      <div className="input-group input-group-sm" style={{ width: 200 }}>
                        <span className="input-group-text bg-white text-muted">
                          <SearchIcon />
                        </span>
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Filter roles..."
                          value={roleSearch}
                          onChange={(e) => setRoleSearch(e.target.value)}
                        />
                      </div>
                    </div>
                  )
                }
              />

              {rolesCatalog.length === 0 ? (
                <div className="text-center text-muted py-4">No roles available.</div>
              ) : (
                <>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="select-all-roles"
                      checked={allRolesSelected}
                      onChange={toggleSelectAllRoles}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="select-all-roles">
                      Select all
                    </label>
                  </div>

                  <div className="row g-3">
                    {filteredRoles.length === 0 ? (
                      <div className="col-12 text-center text-muted py-3 small">
                        No roles match "{roleSearch}".
                      </div>
                    ) : (
                      filteredRoles.map((role, index) => {
                        const checked = selectedRoleIds.has(role.id);
                        const badge = ROLE_BADGE_PALETTE[index % ROLE_BADGE_PALETTE.length];
                        const BadgeIcon = badge.Icon;
                        return (
                          <div className="col-md-6" key={role.id}>
                            <label
                              htmlFor={`role-${role.id}`}
                              className={`d-flex align-items-start gap-2 border rounded-4 p-3 h-100 mb-0 ${
                                checked ? 'border-primary bg-primary-subtle' : 'bg-white'
                              }`}
                              style={{ cursor: 'pointer' }}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input mt-1 flex-shrink-0"
                                id={`role-${role.id}`}
                                checked={checked}
                                onChange={() => toggleRole(role.id)}
                              />
                              <span className="d-block">
                                <span className="d-block fw-bold text-black mb-1">{role.name}</span>
                                {role.description && (
                                  <span className="d-block text-muted fw-medium" style={{ fontSize: '0.8rem' }}>
                                    {role.description}
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
            </div>

            <div className="d-flex gap-2 pt-3 border-top">
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={saving}>
                <SaveIcon />
                {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create User'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={goBack}
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
