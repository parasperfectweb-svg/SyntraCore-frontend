// layout/Sidebar/NavSection.jsx
import { NavLink } from 'react-router-dom';

export default function NavSection({ label, items, onNavigate }) {
  return (
    <>
      <div className="mb-2 nav-header text-uppercase px-2">{label}</div>
      <ul className="nav nav-pills flex-column mb-3">
        {items.map((item) => (
          <li className="nav-item" key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) => `nav-link d-flex align-items-center gap-2${isActive ? ' active' : ''}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
              <span className="flex-grow-1">{item.label}</span>
              {item.badge != null && <span className="badge bg-primary rounded-pill">{item.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}
