// features/email-inbox/components/EmailList.jsx
// The inbox header (title + All/Unread tabs) plus the scrollable list of
// EmailListItem rows. FavoritesMenu (the 3-dot dropdown) is the
// mid-breakpoint stand-in for the Favorites rail (see EmailInbox.css).
import EmailListItem from './EmailListItem';
import FavoritesMenu from './FavoritesMenu';

export default function EmailList({ emails, selectedId, onSelect, filter, onFilterChange, loading, error }) {
  return (
    <section className="sc-inbox-list-panel flex-shrink-0 d-flex flex-column overflow-hidden">
      <div className="sc-inbox-header d-flex align-items-center justify-content-between">
        <h1 className="fw-medium">Inbox</h1>
        <div className="sc-inbox-header-icons d-flex gap-14px">
          <svg className="text-muted icon-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 4h16l-6 8v6l-4 2v-8z" />
          </svg>
          <svg className="text-muted icon-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
        </div>
      </div>

      <div className="sc-inbox-tabs d-flex align-items-center justify-content-between border-bottom">
        <div className="d-flex gap-2">
          <span
            className={`sc-inbox-tab text-muted${filter === 'all' ? ' sc-active' : ''}`}
            role="button"
            onClick={() => onFilterChange('all')}
          >
            All
          </span>
          <span
            className={`sc-inbox-tab text-muted${filter === 'unread' ? ' sc-active' : ''}`}
            role="button"
            onClick={() => onFilterChange('unread')}
          >
            Unread
          </span>
        </div>
        <FavoritesMenu />
      </div>

      <div className="flex-grow-1 overflow-auto">
        {error && (
          <div className="p-3 text-danger small">Couldn't load emails: {error}</div>
        )}
        {!error && loading && (
          <div className="p-3 text-muted small">Loading emails...</div>
        )}
        {!error && !loading && emails.length === 0 && (
          <div className="p-3 text-muted small">No emails found.</div>
        )}
        {emails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            selected={email.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
