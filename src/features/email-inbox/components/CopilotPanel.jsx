// features/email-inbox/components/CopilotPanel.jsx
// The AI Advanced Data / Missing Information / Reply Draft / Client
// Response cards. Each card collapses independently (local state) —
// content here is the same illustrative "captured from this email"
// demo data as the approved static design; wire it to a real
// extraction API later without changing the card shell.
import { useState } from 'react';
import { COPILOT_DRAFT_TEXT } from '../api/copilotDraft';

function CopilotCard({ icon, title, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sc-copilot-card mt-2">
      <div
        className="sc-copilot-card-head d-flex align-items-center justify-content-between fw-bold sc-cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sc-left d-flex align-items-center gap-7px">
          {icon}
          {title}
          {badge != null && (
            <span className="sc-count-badge fw-bold d-flex justify-content-center align-items-center icon-14">
              {badge}
            </span>
          )}
        </span>
        <svg
          className="sc-chev text-body-tertiary icon-13"
          style={{ transform: open ? 'none' : 'rotate(180deg)' }}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="M6 15l6-6 6 6" />
        </svg>
      </div>
      {open && children}
    </div>
  );
}

const MISSING_ITEMS = ['HS Code / Commodity Code', "Shipper's complete address", 'Insurance requirement'];

// Formats a pickup/drop_location object from the /emails/logistics
// response into a single display string, e.g. "Port Freight India Pvt.
// Ltd. — Koper, Slovenia".
function formatLocation(location) {
  if (!location) return null;
  const place = location.raw_address || [location.city, location.country].filter(Boolean).join(', ');
  if (location.name_or_company && place) return `${location.name_or_company} — ${place}`;
  return location.name_or_company || place || null;
}

// Builds the [label, value] rows for the AI Advanced Data card straight
// from the real logistics record (see hooks/useLogisticsForEmail.js), skipping
// any field the API didn't return for this email instead of showing a
// blank/placeholder row.
function buildDataRows(logistics) {
  if (!logistics) return [];
  const rows = [
    ['Origin', formatLocation(logistics.pickup_location)],
    ['Destination', formatLocation(logistics.drop_location)],
    ['Incoterm', logistics.incoterm],
    ['Transport Mode', logistics.transport_mode],
    ['Reference', logistics.reference_id],
    ['Status', logistics.status],
  ];
  return rows.filter(([, v]) => v != null && v !== '');
}

function buildCargoRows(logistics) {
  return logistics?.cargo?.length ? logistics.cargo : [];
}

export default function CopilotPanel({ open, onClose, onUseDraft, logistics, logisticsLoading }) {
  const [copied, setCopied] = useState(false);

  const dataRows = buildDataRows(logistics);
  const cargoRows = buildCargoRows(logistics);
  const draftText = COPILOT_DRAFT_TEXT;

  function handleCopy() {
    navigator.clipboard.writeText(draftText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <aside className={`sc-copilot flex-shrink-0 d-flex flex-column${open ? ' sc-open' : ''}`} id="scCopilot">
      <div className="sc-copilot-header d-flex align-items-center gap-2">
        <svg className="icon-16" fill="none" stroke="#0078D4" strokeWidth="1.5" viewBox="0 0 16 16">
          <path d="M8 1.17l1.05 4.1c.1.36.29.68.56.95.27.27.6.46.95.56l4.1 1.05-4.1 1.05c-.36.1-.68.29-.95.56-.27.27-.46.6-.56.95L8 14.83l-1.05-4.1a2 2 0 00-.56-.95 2 2 0 00-.95-.56L1.34 8.17l4.1-1.05c.36-.1.68-.29.95-.56.27-.27.46-.6.56-.95L8 1.17z" />
        </svg>
        Copilot AI Assistant
        <button
          aria-label="Close Copilot panel"
          className="sc-copilot-close d-none align-items-center justify-content-center border"
          onClick={onClose}
        >
          <svg className="icon-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <CopilotCard
        title="AI Advanced Data"
        icon={
          <svg className="sc-type-icon icon-14" fill="none" stroke="var(--sc-blue)" strokeWidth="2" viewBox="0 0 24 24">
            <rect height="18" rx="2" width="18" x="3" y="3" /><path d="M3 9h18M9 21V9" />
          </svg>
        }
      >
        <div className="sc-data-rows">
          {logisticsLoading && (
            <div className="sc-data-row text-muted">Loading shipment data...</div>
          )}
          {!logisticsLoading && dataRows.length === 0 && (
            <div className="sc-data-row text-muted">No shipment data extracted for this email yet.</div>
          )}
          {dataRows.map(([k, v]) => (
            <div className="sc-data-row d-flex justify-content-between gap-10px" key={k}>
              <span className="sc-k text-muted flex-shrink-0">{k}</span>
              <span className="sc-v text-dark fw-medium">{v}</span>
            </div>
          ))}
          {cargoRows.length > 0 && (
            <>
              <div className="sc-data-divider" />
              {cargoRows.map((line) => (
                <div className="sc-data-row d-flex justify-content-between gap-10px" key={line.id}>
                  <span className="sc-k text-muted flex-shrink-0">{line.name_or_description || 'Cargo'}</span>
                  <span className="sc-v text-dark fw-medium">
                    {[line.quantity && `${line.quantity} pcs`, line.weight_kg && `${line.weight_kg} kg`, line.volume_cbm && `${line.volume_cbm} m³`]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </CopilotCard>

      <CopilotCard
        title="Missing Information"
        badge={MISSING_ITEMS.length}
        icon={
          <svg className="sc-type-icon icon-14" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v4M12 17h.01M10.3 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.7 3.86a1 1 0 00-1.72 0z" />
          </svg>
        }
      >
        <div className="sc-missing-list d-flex flex-column">
          {MISSING_ITEMS.map((item) => (
            <div className="sc-missing-item d-flex align-items-center gap-2 rounded-1" key={item}>
              <svg className="flex-shrink-0 icon-13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v4M12 17h.01M10.3 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.7 3.86a1 1 0 00-1.72 0z" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </CopilotCard>

      <CopilotCard
        title="A Reply Draft"
        icon={
          <svg className="sc-type-icon icon-14" fill="none" stroke="var(--sc-purple)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 17l-5-5 5-5M4 12h13a4 4 0 010 8h-1" />
          </svg>
        }
      >
        <div className="sc-draft-body rounded-1 text-body-secondary">
          <p>Dear Priya,</p>
          <p>We will need the following additional details to finalize the quotation:</p>
          <ol>
            <li>HS Code / Commodity Code</li>
            <li>Complete shipper's address</li>
            <li>Insurance requirements</li>
          </ol>
          <p>Our team will send the formal quotation within 24 hours upon receipt.</p>
        </div>
        <div className="d-flex gap-6px mb-2" style={{ margin: '0 14px 5px' }}>
          <button className="sc-copy-btn d-flex align-items-center gap-6px text-body-secondary rounded-1" onClick={handleCopy}>
            <svg className="icon-13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="12" rx="2" width="12" x="9" y="9" /><path d="M5 15V5a2 2 0 012-2h10" />
            </svg>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            className="sc-copy-btn sc-use-draft-btn d-flex align-items-center gap-6px rounded-1"
            onClick={() => onUseDraft?.(draftText)}
          >
            <svg className="icon-13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 17l-5-5 5-5M4 12h13a4 4 0 010 8h-1" />
            </svg>
            Use in Reply
          </button>
        </div>
      </CopilotCard>

      <CopilotCard
        title="Client Response"
        icon={
          <svg className="sc-type-icon icon-14" fill="none" stroke="var(--sc-blue)" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" />
          </svg>
        }
      >
        <div className="d-flex align-items-center gap-2 text-success small mb-3 px-3">
          <svg className="flex-shrink-0 icon-15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" />
          </svg>
          AI data captured successfully!
        </div>
        <button className="primary-btn w-100 d-flex align-items-center justify-content-center gap-2 text-white">
          Generate Quote
        </button>
      </CopilotCard>
    </aside>
  );
}
