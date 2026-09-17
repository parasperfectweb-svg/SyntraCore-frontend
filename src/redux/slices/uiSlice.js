// redux/slices/uiSlice.js — replaces the old store/uiStore.js (zustand).
// Small global UI state (sidebar, off-canvas panels) that more than one
// layout piece needs to read/write. Feature-local state (form values,
// table selection, etc.) stays in that feature's own hooks — this slice
// is only for things the *shell* (Sidebar/Topbar/MobileBar) coordinates
// across components.
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { openSidebar, closeSidebar, toggleSidebar } = uiSlice.actions;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;

export default uiSlice.reducer;
