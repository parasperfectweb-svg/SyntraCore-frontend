// features/permissions/PermissionFormPage.jsx — "Add New Permission" /
// "Edit Permission". A permission is just { code, name, description }.
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchPermissionById,
  createPermission,
  updatePermission,
  clearCurrentPermission,
  selectCurrentPermission,
  selectPermissionsActionStatus,
  selectPermissionsError,
} from '../../redux/slices/permissionsSlice';

const EMPTY_FORM = { code: '', name: '', description: '' };

export default function PermissionFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentPermission = useSelector(selectCurrentPermission);
  const actionStatus = useSelector(selectPermissionsActionStatus);
  const apiError = useSelector(selectPermissionsError);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchPermissionById(id));
    }
    return () => {
      dispatch(clearCurrentPermission());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentPermission && String(currentPermission.id) === String(id)) {
      setForm({
        code: currentPermission.code || '',
        name: currentPermission.name || '',
        description: currentPermission.description || '',
      });
    }
  }, [isEditing, currentPermission, id]);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = isEditing
      ? updatePermission({ id, data: form })
      : createPermission(form);

    const result = await dispatch(action);
    if (!result.error) {
      navigate('/settings/permissions');
    }
  };

  const saving = actionStatus === 'loading';

  return (
    <div className="p-4">
      <h1 className="h4 fw-bold mb-3">{isEditing ? 'Edit Permission' : 'Add New Permission'}</h1>

      <div className="card shadow-sm" style={{ maxWidth: 640 }}>
        <div className="card-body">
          {apiError && <div className="alert alert-danger py-2">{apiError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Code</label>
              <input
                type="text"
                name="code"
                className="form-control font-monospace"
                value={form.code}
                onChange={onChange}
                placeholder="e.g. create_quote"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={3}
                value={form.description}
                onChange={onChange}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Permission'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/settings/permissions')}
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
