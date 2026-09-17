// features/users/UsersPage.jsx — "All Users" list. Same pattern as
// RolesPage.jsx / PermissionsPage.jsx.
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table/Table';
import Modal from '../../components/ui/Modal/Modal';
import EditImage from "../../images/edit-icon.webp";
import TrashImage from "../../images/trash-icon.webp";
import { fetchUsers, deleteUser, selectAllUsers, selectUsersStatus } from '../../redux/slices/usersSlice';
import { userDisplayName } from './utils/normalizeUser';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const PAGE_WINDOW = 5;

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  );
}


function buildPageWindow(current, total, windowSize = PAGE_WINDOW) {
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let p = start; p <= end; p += 1) pages.push(p);
  return pages;
}

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUsersStatus);

  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToView, setUserToView] = useState(null); // holds the user object while the "view roles" modal is open

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || userDisplayName(u).toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);
  const pageWindow = buildPageWindow(currentPage, totalPages);

  const requestDelete = (user) => setUserToDelete(user);
  const cancelDelete = () => {
    if (deletingId) return;
    setUserToDelete(null);
  };
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete.id);
    await dispatch(deleteUser(userToDelete.id));
    setDeletingId(null);
    setUserToDelete(null);
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 fw-bold mb-0">All Users</h1>
        <Link to="/settings/users/new" className="btn btn-primary d-flex align-items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New User
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                style={{ width: 80 }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-muted small">entries per page</span>
            </div>

            <div className="input-group search-bar" style={{ width: 260 }}>
              <span className="input-group-text bg-white text-muted">
                <SearchIcon />
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {status === 'loading' && users.length === 0 ? (
            <div className="text-center text-muted py-5">Loading users…</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th className="small fw-medium">S.No.</th>
                  <th className="small fw-medium">Name</th>
                  <th className="small fw-medium">Email</th>
                  <th className="small fw-medium">Roles</th>
                  <th className="small fw-medium">Status</th>
                  <th className="small fw-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((user, i) => (
                    <tr key={user.id}>
                      <td>{startIndex + i + 1}.</td>
                      <td className="">{userDisplayName(user)}</td>
                      <td className="">{user.email}</td>
                      <td>
                        {user.roles.length === 0 ? (
                          <span className="">No roles</span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-link p-0 text-primary fw-medium text-decoration-none small"
                            onClick={() => setUserToView(user)}
                          >
                            {user.roles.map((r) => r.name).join(', ')}
                          </button>
                        )}
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${user.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/settings/users/${user.id}/edit`}
                            className="btn btn-sm border d-inline-flex align-items-center justify-content-center text-primary"
                            style={{ width: 32, height: 32 }}
                            title={`Edit ${userDisplayName(user)}`}
                            aria-label={`Edit ${userDisplayName(user)}`}
                          >
                            <img src={EditImage} alt="edit icon" width={14} height={14} />
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm border d-inline-flex align-items-center justify-content-center text-danger"
                            style={{ width: 32, height: 32 }}
                            title={`Delete ${userDisplayName(user)}`}
                            aria-label={`Delete ${userDisplayName(user)}`}
                            disabled={deletingId === user.id}
                            onClick={() => requestDelete(user)}
                          >
                            <img src={TrashImage} alt="delete icon" width={14} height={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}

          <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
            <span className="text-muted small">
              {filtered.length === 0
                ? 'Showing 0 entries'
                : `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, filtered.length)} of ${filtered.length} entr${filtered.length === 1 ? 'y' : 'ies'}`}
            </span>

            <nav aria-label="Users pagination">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(1)} aria-label="First page">«</button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Previous page">‹</button>
                </li>

                {pageWindow[0] > 1 && (
                  <li className="page-item disabled d-none d-sm-block">
                    <span className="page-link">…</span>
                  </li>
                )}

                {pageWindow.map((p) => (
                  <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}

                {pageWindow[pageWindow.length - 1] < totalPages && (
                  <li className="page-item disabled d-none d-sm-block">
                    <span className="page-link">…</span>
                  </li>
                )}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-label="Next page">›</button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(totalPages)} aria-label="Last page">»</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(userToDelete)}
        onClose={cancelDelete}
        title="Delete User"
        footer={
          <>
            <button type="button" className="btn btn-outline-secondary" onClick={cancelDelete} disabled={Boolean(deletingId)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={Boolean(deletingId)}>
              {deletingId ? 'Deleting…' : 'Delete User'}
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to delete <strong>{userToDelete ? userDisplayName(userToDelete) : ''}</strong> ({userToDelete?.email})? This action cannot be undone.
        </p>
      </Modal>

      <Modal
        open={Boolean(userToView)}
        onClose={() => setUserToView(null)}
        title={`Roles — ${userToView ? userDisplayName(userToView) : ''}`}
        footer={
          <button type="button" className="btn btn-outline-secondary" onClick={() => setUserToView(null)}>
            Close
          </button>
        }
      >
        {!userToView?.roles?.length ? (
          <p className="text-muted mb-0">This user has no roles assigned.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {userToView.roles.map((role) => (
              <li key={role.id} className="list-group-item px-0 fw-semibold">
                {role.name}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
