// redux/slices/rolesSlice.js — CRUD state for the Roles feature. The
// permissions catalog itself now lives in permissionsSlice.js (Permissions
// is its own full CRUD feature) — RoleFormPage reads it from there.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRolesApi,
  getRoleApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
} from '../../features/roles/api/rolesApi';

const asyncErr = (err) =>
  err.response?.data?.message || err.response?.data?.detail || err.message || 'Something went wrong.';

/**
 * Normalizes one role from the API into the shape the UI works with.
 * Matches the confirmed real response: { id, name, description,
 * permissions: [{id, code, name, description}], created_at, updated_at }.
 */
function normalizeRole(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  return {
    id: raw.id ?? raw._id,
    name: raw.name ?? raw.role_name ?? '',
    description: raw.description ?? '',
    permissions: Array.isArray(raw.permissions) ? raw.permissions : [],
    createdAt: raw.created_at ?? raw.createdAt ?? null,
    updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
  };
}

function extractListFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results; // DRF pagination shape (confirmed — see "count"/"next"/"results")
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRolesApi();
      return extractListFromResponse(response.data).map(normalizeRole);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRoleApi(id);
      return normalizeRole(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createRoleApi(payload);
      return normalizeRole(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateRoleApi(id, data);
      return normalizeRole(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await deleteRoleApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

const initialState = {
  items: [],
  currentRole: null,
  status: 'idle',       // list fetch status
  actionStatus: 'idle',  // create/update/delete status
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearCurrentRole(state) {
      state.currentRole = null;
    },
    clearRolesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchRoleById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentRole = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(createRole.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(updateRole.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.currentRole = action.payload;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(deleteRole.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items = state.items.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRole, clearRolesError } = rolesSlice.actions;

export const selectAllRoles = (state) => state.roles.items;
export const selectCurrentRole = (state) => state.roles.currentRole;
export const selectRolesStatus = (state) => state.roles.status;
export const selectRolesActionStatus = (state) => state.roles.actionStatus;
export const selectRolesError = (state) => state.roles.error;

export default rolesSlice.reducer;
