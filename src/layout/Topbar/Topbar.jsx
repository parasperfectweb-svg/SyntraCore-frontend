// layout/Topbar/Topbar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../../redux/slices/authSlice';
import { openSidebar } from '../../redux/slices/uiSlice';

export default function Topbar({ notificationCount = 3 }) {
  const [query, setQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  // Read user state directly from Redux
  const user = useSelector(selectCurrentUser);

  // Helper to extract display name from email or user object
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    if (user?.email) {
      const namePart = user.email.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'User';
  };

  // Helper to derive initials dynamically
  const getInitials = () => {
    if (user?.initials) return user.initials;
    const name = getDisplayName();
    const parts = name.split(/[\s._-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = getDisplayName();
  const initials = getInitials();
  const role = user?.role || 'Operations';

  const handleSignOut = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="sc-topbar d-flex align-items-center gap-3 bg-white px-4 py-3 sticky-top">
      <button
        type="button"
        aria-label="Open menu"
        className="sc-topbar-menu-btn sc-icon-btn d-none align-items-center justify-content-center flex-shrink-0"
        onClick={() => dispatch(openSidebar())}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div className={`sc-search-pill sc-topbar-search d-flex align-items-center${mobileSearchOpen ? ' sc-search-open' : ''}`} style={{ maxWidth: 420 }}>
        <span
          className="sc-topbar-search-icon d-flex align-items-center justify-content-center flex-shrink-0"
          role="button"
          tabIndex={0}
          aria-label="Search"
          onClick={() => setMobileSearchOpen((o) => !o)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
        </span>
        <input
          type="text"
          className="sc-search-pill-input"
          placeholder="Search jobs, customers, containers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setMobileSearchOpen(false)}
        />
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-auto">
        <button className="sc-icon-btn position-relative" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 003.4 0" />
          </svg>
          {notificationCount > 0 && (
            <span className="sc-notif-dot position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '.6rem' }}>
              {notificationCount}
            </span>
          )}
        </button>

        <button className="sc-icon-btn" aria-label="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2 1.8-2.3 3.2" />
            <path d="M12 17h.01" />
          </svg>
        </button>

        <span className="sc-topbar-divider d-none d-sm-block" />

        <div className="dropdown">
          <a className="d-flex align-items-center gap-2 text-decoration-none text-dark dropdown-toggle"
            href="#" role="button" data-bs-toggle="dropdown">
            <span className="sc-avatar-ring flex-shrink-0">
              <span className="avatar-circle rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
                {initials}
              </span>
            </span>
            <span className="d-none d-md-block text-start">
              <span className="d-block fw-semibold small lh-sm">{displayName}</span>
              <span className="d-block text-muted lh-sm" style={{ fontSize: '.7rem' }}>{role}</span>
            </span>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#" onClick={handleSignOut}>Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}