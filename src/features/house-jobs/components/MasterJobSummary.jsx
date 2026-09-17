// features/house-jobs/components/MasterJobSummary.jsx
import { formatCurrency } from '../../../lib/formatCurrency';
import StatRow from '../../../components/patterns/StatRow';
import Button from '../../../components/ui/Button/Button';

export default function MasterJobSummary({ selectedJobs, totals }) {
  const hasSelection = selectedJobs.length > 0;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h6 fw-bold mb-3">Master Job Summary</h2>

        {!hasSelection ? (
          <div className="border border-dashed rounded-3 bg-light text-center p-4 mb-3">
            <div className="bg-white border rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 44, height: 44 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />
              </svg>
            </div>
            <p className="fw-semibold mb-1">No House Jobs Selected</p>
            <p className="text-muted small mb-0">Select one or more House Jobs<br />to create a Master Job.</p>
          </div>
        ) : (
          <div className="border rounded-3 p-3 mb-3">
            <p className="fw-semibold mb-2">{selectedJobs.length} House Job{selectedJobs.length > 1 ? 's' : ''} selected</p>
            <ul className="small text-muted mb-0 ps-3">
              {selectedJobs.map((job) => <li key={job.id}>{job.jobId} — {job.route}</li>)}
            </ul>
          </div>
        )}

        <ul className="list-group list-group-flush mb-3">
          <StatRow label="Total Revenue" value={formatCurrency(totals.totalRevenue, 'EUR')} valueClassName="fw-bold text-primary" />
          <StatRow label="Total Cost (Est.)" value={formatCurrency(totals.totalCost, 'EUR')} valueClassName="fw-bold text-danger" />
          <StatRow label="Expected Profit" value={formatCurrency(totals.expectedProfit, 'EUR')} valueClassName="fw-bold text-success" />
          <StatRow label="Margin" value={`${totals.margin}%`} valueClassName="fw-bold text-purple" bordered={false} />
        </ul>

        <div className="alert alert-primary d-flex gap-2 small mb-3" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-1">
            <circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" />
          </svg>
          <span>Selected House Jobs will be grouped and managed under a single Master Job.</span>
        </div>

        <div className="d-grid gap-2">
          <Button variant="secondary">Create New House Job</Button>
          <Button variant="primary" disabled={!hasSelection}>Create Master Job</Button>
        </div>
      </div>
    </div>
  );
}
