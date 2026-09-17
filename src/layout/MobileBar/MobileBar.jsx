// layout/MobileBar/MobileBar.jsx
// The floating hamburger button + full-screen scrim that opens/closes the
// main Sidebar below the 1024px breakpoint. Rendered once by AppShell so
// every page gets the same responsive sidebar behavior for free.
import { useSelector, useDispatch } from 'react-redux';
import { selectSidebarOpen, openSidebar, closeSidebar } from '../../redux/slices/uiSlice';

export default function MobileBar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);

  return (
    <>
      <div
        className={`sc-scrim d-none${sidebarOpen ? ' sc-show' : ''}`}
        onClick={() => dispatch(closeSidebar())}
      />
      <button
        type="button"
        aria-label="Open menu"
        className="sc-menu-fab d-none rounded-circle border align-items-center justify-content-center text-body-secondary"
        onClick={() => dispatch(openSidebar())}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
    </>
  );
}
