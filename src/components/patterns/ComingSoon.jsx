// components/patterns/ComingSoon.jsx
// Placeholder for nav destinations that don't have a real feature page
// yet (Task Engine, Transport, Warehouse, Customs, Finance, Reports,
// Settings...). Swap for a real <FeaturePage/> as each one gets built.
export default function ComingSoon({ label }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-5" style={{ minHeight: '60vh' }}>
      <div className="bg-light border rounded-3 d-flex align-items-center justify-content-center mb-3"
        style={{ width: 56, height: 56 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
          <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" />
        </svg>
      </div>
      <h2 className="h5 fw-bold mb-1">{label}</h2>
      <p className="text-muted mb-0">This page hasn't been built yet.</p>
    </div>
  );
}
