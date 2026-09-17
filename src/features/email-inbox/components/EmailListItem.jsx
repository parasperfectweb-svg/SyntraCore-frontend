// features/email-inbox/components/EmailListItem.jsx
export default function EmailListItem({ email, selected, onSelect }) {
  return (
    <div
      className={`sc-email-row${selected ? ' sc-selected' : ''}`}
      onClick={() => onSelect(email.id)}
      role="button"
    >
      <div className="sc-avatar" style={{ background: email.color }}>{email.initials}</div>
      <div className="sc-email-row-body">
        <div className="sc-email-row-top">
          <span className="sc-email-sender">{email.name}</span>
          <span className="sc-email-time">{email.time}</span>
        </div>
        <div className="sc-email-subject">{email.subject}</div>
        <div className="sc-email-preview">{email.preview}</div>
        {email.tag && (
          <span className={`sc-email-tag sc-tag-${email.tag.type}`}>{email.tag.text}</span>
        )}
      </div>
      {email.unread && <span className="sc-unread-dot" />}
    </div>
  );
}
