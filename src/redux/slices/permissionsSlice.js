// redux/slices/permissionsSlice.js — CRUD state for the Permissions
// feature. Same shape/pattern as rolesSlice.js. This is now the single
// source of truth for the permissions list — RoleFormPage reads the
// catalog from here too (via fetchPermissions/selectAllPermissions),
// rather than roles owning its own separate copy of the same data.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPermissionsApi,
  getPermissionApi,
  createPermissionApi,
  updatePermissionApi,
  deletePermissionApi,
} from '../../features/permissions/api/permissionsApi';
import { normalizePermission, normalizePermissionList } from '../../features/permissions/utils/normalizePermission';

const asyncErr = (err) =>
  err.response?.data?.message || err.response?.data?.detail || err.message || 'Something went wrong.';

function extractListFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results; // DRF pagination shape (confirmed)
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPermissionsApi();
      return normalizePermissionList(extractListFromResponse(response.data));
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const fetchPermissionById = createAsyncThunk(
  'permissions/fetchPermissionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPermissionApi(id);
      return normalizePermission(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createPermissionApi(payload);
      return normalizePermission(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updatePermissionApi(id, data);
      return normalizePermission(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const deletePermission = createAsyncThunk(
  'permissions/deletePermission',
  async (id, { rejectWithValue }) => {
    try {
      await deletePermissionApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

const initialState = {
  items: [],
  currentPermission: null,
  status: 'idle',
  actionStatus: 'idle',
  error: null,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearCurrentPermission(state) {
      state.currentPermission = null;
    },
    clearPermissionsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchPermissionById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentPermission = null;
      })
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPermission = action.payload;
      })
      .addCase(fetchPermissionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(createPermission.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(updatePermission.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.currentPermission = action.payload;
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(deletePermission.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPermission, clearPermissionsError } = permissionsSlice.actions;

export const selectAllPermissions = (state) => state.permissions.items;
export const selectCurrentPermission = (state) => state.permissions.currentPermission;
export const selectPermissionsStatus = (state) => state.permissions.status;
export const selectPermissionsActionStatus = (state) => state.permissions.actionStatus;
export const selectPermissionsError = (state) => state.permissions.error;

export default permissionsSlice.reducer;
