// layout/Sidebar/Sidebar.jsx
// The main app sidebar. Static/always-visible at ≥1024px; below that it's
// an off-canvas drawer controlled by uiSlice (toggled from Topbar's
// hamburger or MobileBar). See styles/global.css for the responsive
// off-canvas rules (`.sc-sidebar` + `.sc-open`).
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectSidebarOpen, closeSidebar } from '../../redux/slices/uiSlice';
import NavSection from './NavSection';
import { NAV_SECTIONS } from './navConfig';

export default function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);

  return (
    <aside
      className={`sc-sidebar d-flex flex-column flex-shrink-0 text-white p-3${sidebarOpen ? ' sc-open' : ''}`}
      id="scSidebar"
    >
      <Link className="d-flex align-items-center gap-2 mb-4 text-white text-decoration-none" to="/dashboard">
        <span className="brand-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l2-2 4 4 8-8 4 4" />
          </svg>
        </span>
        <span className="fs-5 fw-bold">SyntraCore</span>
      </Link>

      {NAV_SECTIONS.map((section) => (
        <NavSection
          key={section.label}
          label={section.label}
          items={section.items}
          onNavigate={() => dispatch(closeSidebar())}
        />
      ))}
    </aside>
  );
}
