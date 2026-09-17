// redux/slices/usersSlice.js — CRUD state for the Users feature. Same
// shape/pattern as rolesSlice.js and permissionsSlice.js.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUsersApi,
  getUserApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from '../../features/users/api/usersApi';
import { normalizeUser, normalizeUserList } from '../../features/users/utils/normalizeUser';

// Surfaces field-level validation errors (e.g. { errors: { email: ["Email
// address cannot be updated"] } }) instead of just the generic top-level
// "message" — otherwise a real, specific backend rejection reason (like
// this API's "email is immutable after creation" rule) never reaches
// the screen, only a vague "Validation Error" banner.
const asyncErr = (err) => {
  const data = err.response?.data;
  const fieldErrors =
    data?.errors && typeof data.errors === 'object'
      ? Object.values(data.errors).flat().join(' ')
      : null;
  return fieldErrors || data?.message || data?.detail || err.message || 'Something went wrong.';
};

// Handles both response shapes seen across this API: the DRF-pagination
// { count, results } shape (Roles/Permissions) and this endpoint's own
// { message, data } shape.
function extractListFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsersApi();
      return normalizeUserList(extractListFromResponse(response.data));
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUserApi(id);
      return normalizeUser(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createUserApi(payload);
      return normalizeUser(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(id, data);
      return normalizeUser(response.data?.data ?? response.data);
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await deleteUserApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(asyncErr(err));
    }
  }
);

const initialState = {
  items: [],
  currentUser: null,
  status: 'idle',
  actionStatus: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCurrentUser(state) {
      state.currentUser = null;
    },
    clearUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentUser = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(createUser.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items = state.items.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentUser, clearUsersError } = usersSlice.actions;

export const selectAllUsers = (state) => state.users.items;
export const selectEditingUser = (state) => state.users.currentUser; // the user being viewed/edited on this page — not authSlice's logged-in user
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersActionStatus = (state) => state.users.actionStatus;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
