// features/email-inbox/components/FavoritesMenu.jsx
// The Favorites rail collapses into this 3-dot dropdown, anchored next to
// the All/Unread tabs, below the 1200px breakpoint (see EmailInbox.css).
// Reuses the same FAVORITES data + icon renderer as the full rail so the
// two stay in sync automatically.
import { FAVORITES } from '../api/favoritesData';
import { FavIcon } from './FavoritesPanel';

export default function FavoritesMenu() {
  return (
    <div className="sc-fav-kebab dropdown">
      <button
        type="button"
        aria-label="Favorites"
        className="sc-fav-kebab-btn d-flex align-items-center justify-content-center"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="12" cy="19" r="1.75" />
        </svg>
      </button>
      <ul className="dropdown-menu dropdown-menu-end sc-fav-menu">
        {FAVORITES.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              className={`sc-fav-menu-item${item.active ? ' sc-active' : ''}`}
            >
              <FavIcon item={item} className="flex-shrink-0 icon-15" />
              <span className="sc-name">{item.label}</span>
              {item.count != null && <span className="sc-count">{item.count}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
