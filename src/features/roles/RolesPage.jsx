// features/roles/RolesPage.jsx — "All Roles" list. Uses the shared Table
// component (components/ui/Table/Table.jsx) and the shared Modal
// component (components/ui/Modal/Modal.jsx) — the same wrappers every
// other data table/dialog in this project uses — so styling stays
// consistent app-wide instead of being redeclared per page.
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table/Table';
import Modal from '../../components/ui/Modal/Modal';
import { fetchRoles, deleteRole, selectAllRoles, selectRolesStatus } from '../../redux/slices/rolesSlice';
import { permissionsSummaryLabel } from './utils/permissions';
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DESCRIPTION_MAX_WIDTH = 400;
const PAGE_WINDOW = 5; // how many numbered page buttons to show at once
import EditImage from "../../images/edit-icon.webp";
import TrashImage from "../../images/trash-icon.webp";

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  );
}


/** Builds a compact, centered window of page numbers (e.g. 3 4 [5] 6 7) with first/prev/next/last controls. */
function buildPageWindow(current, total, windowSize = PAGE_WINDOW) {
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let p = start; p <= end; p += 1) pages.push(p);
  return pages;
}

export default function RolesPage() {
  const dispatch = useDispatch();
  const roles = useSelector(selectAllRoles);
  const status = useSelector(selectRolesStatus);

  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null); // holds the role object while the confirm modal is open
  const [roleToView, setRoleToView] = useState(null); // holds the role object while the "view permissions" modal is open

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((role) => role.name.toLowerCase().includes(q));
  }, [roles, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);
  const pageWindow = buildPageWindow(currentPage, totalPages);

  const requestDelete = (role) => setRoleToDelete(role);
  const cancelDelete = () => {
    if (deletingId) return; // don't allow closing mid-delete
    setRoleToDelete(null);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    setDeletingId(roleToDelete.id);
    await dispatch(deleteRole(roleToDelete.id));
    setDeletingId(null);
    setRoleToDelete(null);
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 fw-bold mb-0">All Roles</h1>
        <Link to="/settings/roles/new" className="btn btn-primary d-flex align-items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New Role
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
                placeholder="Search roles..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {status === 'loading' && roles.length === 0 ? (
            <div className="text-center text-muted py-5">Loading roles…</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th className="small fw-medium">S.No.</th>
                  <th className="small fw-medium">Role Name</th>
                  <th className="small fw-medium">Description</th>
                  <th className="small fw-medium">Permissions</th>
                  <th className="small fw-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((role, i) => (
                    <tr key={role.id}>
                      <td>{startIndex + i + 1}.</td>
                      <td className="">{role.name}</td>
                      <td>
                        <span
                          className="d-inline-block align-middle"
                          style={{
                            maxWidth: DESCRIPTION_MAX_WIDTH,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={role.description || ''}
                        >
                          {role.description || '—'}
                        </span>
                      </td>
                      <td className="text-success fw-medium">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-success fw-medium text-decoration-none"
                          onClick={() => setRoleToView(role)}
                          title="View assigned permissions"
                        >
                          {permissionsSummaryLabel(role)}
                        </button>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/settings/roles/${role.id}/edit`}
                            className="btn btn-sm border d-inline-flex align-items-center justify-content-center text-primary"
                            style={{ width: 32, height: 32 }}
                            title={`Edit ${role.name}`}
                            aria-label={`Edit ${role.name}`}
                          >
                                                      <img src={EditImage} alt="edit icon" width={14} height={14} />
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm border d-inline-flex align-items-center justify-content-center text-danger"
                            style={{ width: 32, height: 32 }}
                            title={`Delete ${role.name}`}
                            aria-label={`Delete ${role.name}`}
                            disabled={deletingId === role.id}
                            onClick={() => requestDelete(role)}
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

            <nav aria-label="Roles pagination">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(1)} aria-label="First page">
                      «
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Previous page">
                      ‹
                    </button>
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
                    <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-label="Next page">
                      ›
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(totalPages)} aria-label="Last page">
                      »
                    </button>
                  </li>
                </ul>
            </nav>
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(roleToDelete)}
        onClose={cancelDelete}
        title="Delete Role"
        footer={
          <>
            <button type="button" className="btn btn-outline-secondary" onClick={cancelDelete} disabled={Boolean(deletingId)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={Boolean(deletingId)}>
              {deletingId ? 'Deleting…' : 'Delete Role'}
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to delete <strong>{roleToDelete?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>

      <Modal
        open={Boolean(roleToView)}
        onClose={() => setRoleToView(null)}
        title={`Permissions — ${roleToView?.name || ''}`}
        footer={
          <button type="button" className="btn btn-outline-secondary" onClick={() => setRoleToView(null)}>
            Close
          </button>
        }
      >
        {!roleToView?.permissions?.length ? (
          <p className="text-muted mb-0">This role has no permissions assigned.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {roleToView.permissions.map((perm) => (
              <li key={perm.id} className="list-group-item px-0">
                <div className="fw-semibold">{perm.name}</div>
                {perm.description && (
                  <div className="text-muted small">{perm.description}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
