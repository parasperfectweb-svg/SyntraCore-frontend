// features/email-inbox/components/FavoritesPanel.jsx
import { FAVORITES } from '../api/favoritesData';

export function FavIcon({ item, className }) {
  return (
    <svg
      className={className}
      {...item.iconAttrs}
      dangerouslySetInnerHTML={{ __html: item.iconInner }}
    />
  );
}

export default function FavoritesPanel() {
  return (
    <aside className="sc-favorites flex-shrink-0 d-flex flex-column">
      <div className="sc-favorites-header d-flex align-items-center gap-7px fw-bold text-muted">
        <svg className="icon-13" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
        </svg>
        FAVORITES
      </div>
      <ul className='p-0'>
        {FAVORITES.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              className={`sc-fav-item d-flex align-items-center gap-10px w-100 text-body-secondary fw-medium bg-transparent border-0${item.active ? ' sc-active' : ''}`}
            >
              <FavIcon item={item} className="flex-shrink-0 text-muted icon-15" />
              <span className="sc-name flex-grow-1">{item.label}</span>
              {item.count != null && <span className="sc-count fw-medium">{item.count}</span>}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
