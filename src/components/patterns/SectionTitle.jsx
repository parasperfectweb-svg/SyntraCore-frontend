// components/patterns/SectionTitle.jsx
// The numbered section header used throughout the Quotes page
// ("1. Parties Information", "2. Cargo Information", ...). The number
// renders as a small colored badge matching the section's accent
// (set by the parent via the qb-card--* class), not plain "N." text.

export default function SectionTitle({ number, children, className = '' }) {
  return (
    <h2 className={`qb-section-title ${className}`.trim()}>
      {number != null && <span className="qb-section-num">{number}</span>}
      {children}
    </h2>
  );
}
