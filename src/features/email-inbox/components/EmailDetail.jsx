// features/email-inbox/components/EmailDetail.jsx
// Note: the parsed /emails/logistics data is rendered in the sidebar's
// "AI Advanced Data" card (see CopilotPanel.jsx) — not here. This
// component only needs `email` for the raw message; the `logistics` prop
// has been removed accordingly.

export default function EmailDetail({ email, onBack, onDelete, deleting = false, replyValue = '', onReplyChange, onSend, onOpenCopilot }) {
  if (!email) {
    return (
      <section className="sc-email-view flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="sc-email-content d-flex align-items-center justify-content-center h-100 text-muted">
          Select an email to read it.
        </div>
      </section>
    );
  }

  return (
    <section className="sc-email-view flex-grow-1 d-flex flex-column overflow-hidden">
      <div className="sc-email-toolbar d-flex align-items-center justify-content-between">
        <div className="sc-toolbar-actions d-flex align-items-center gap-16px">
          <button className="sc-back-to-list d-none border-0 p-0 bg-transparent align-items-center" onClick={onBack} aria-label="Back to inbox">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <button className="sc-toolbar-btn d-flex align-items-center gap-6px text-body-secondary">
            <svg className="icon-15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 17l-5-5 5-5M4 12h13a4 4 0 010 8h-1" />
            </svg>
            <span>Reply</span>
          </button>
          <button className="sc-toolbar-btn d-flex align-items-center gap-6px text-body-secondary">
            <svg className="icon-15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 17l-5-5 5-5M4 12h13a4 4 0 010 8h-1" />
              <path d="M9 17l-5-5 5-5" />
            </svg>
            <span>Reply All</span>
          </button>
          <button className="sc-toolbar-btn d-flex align-items-center gap-6px text-body-secondary">
            <svg className="icon-15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 17l5-5-5-5M20 12H7a4 4 0 000 8h1" />
            </svg>
            <span>Forward</span>
          </button>
        </div>
        <div className="sc-toolbar-icons d-flex gap-3 flex-shrink-0">
          <button
            type="button"
            className="border-0 bg-transparent p-0 d-flex"
            aria-label="Delete email"
            title="Delete email"
            disabled={deleting}
            onClick={() => onDelete?.()}
          >
            <svg className={`icon-16 ${deleting ? 'text-body-tertiary' : 'text-muted'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
            </svg>
          </button>
          <svg className="icon-16 text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <svg className="icon-16 text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      </div>

      <div className="sc-email-content flex-grow-1 overflow-auto">
        <h1 className="sc-email-title fw-bold">{email.fullSubject}</h1>

        <div className="sc-email-from-row d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="sc-avatar" style={{ background: email.color }}>{email.initials}</div>
            <div>
              <div>
                <span className="fw-semibold">{email.name}</span>{' '}
                <span className="text-muted small">&lt;{email.email}&gt;</span>
              </div>
              <div className="text-muted small">To: {email.to}</div>
            </div>
          </div>
          <div className="sc-from-time text-muted small">{email.fullTime}</div>
        </div>

        <div dangerouslySetInnerHTML={{ __html: email.bodyHtml }} />

        {email.signature && (
          <p className="text-muted">
            {email.signature.lines.map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
        )}

        <button
          type="button"
          className="sc-copilot-banner d-flex align-items-center gap-10px w-100"
          onClick={onOpenCopilot}
        >
          <span className="sc-copilot-banner-icon d-flex align-items-center justify-content-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.17l1.05 4.1c.1.36.29.68.56.95.27.27.6.46.95.56l4.1 1.05-4.1 1.05c-.36.1-.68.29-.95.56-.27.27-.46.6-.56.95L8 14.83l-1.05-4.1a2 2 0 00-.56-.95 2 2 0 00-.95-.56L1.34 8.17l4.1-1.05c.36-.1.68-.29.95-.56.27-.27.46-.6.56-.95L8 1.17z"
              stroke="var(--sc-purple)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
            </svg>
          </span>
          <span className="flex-grow-1 text-start">
            <span className="sc-copilot-banner-title d-block fw-semibold">Reply with Copilot</span>
            <span className="sc-copilot-banner-sub d-block">Draft a reply based on this email's details</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-muted">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="sc-reply-box mt-3">
          <textarea
            placeholder="Write a reply..."
            value={replyValue}
            onChange={(e) => onReplyChange?.(e.target.value)}
          />
          <button type="button" className="submit-msg" onClick={onSend}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
