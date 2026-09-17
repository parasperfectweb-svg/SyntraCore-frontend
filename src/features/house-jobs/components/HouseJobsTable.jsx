// features/house-jobs/components/HouseJobsTable.jsx
import Badge from '../../../components/ui/Badge/Badge';
import Button from '../../../components/ui/Button/Button';

function badgeVariantFromClass(cls) {
  // badgeVariant is either a raw "bg-x-subtle text-x-emphasis" pair (use
  // as-is) or one of the custom pastel classes like "badge-lavender".
  if (cls.startsWith('badge-')) return { custom: cls.replace('badge-', '') };
  return { raw: cls };
}

export default function HouseJobsTable({ jobs, selectedIds, onToggle, onSelectAll, allSelected }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
        <div>
          <h2 className="h6 fw-bold mb-0">Available House Jobs</h2>
          <small className="text-muted">{jobs.length} jobs available</small>
        </div>
        <Button variant="outlinePrimary" size="sm" onClick={onSelectAll}>
          {allSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" className="form-check-input" checked={allSelected} onChange={onSelectAll} />
              </th>
              <th className="small fw-medium">House Job ID</th>
              <th className="small fw-medium">Job Date</th>
              <th className="small fw-medium">Job Type</th>
              <th className="small fw-medium">Route / Discussion</th>
              <th className="small fw-medium">ETD / Date</th>
              <th className="small text-end">Revenue (£)</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const variant = badgeVariantFromClass(job.badgeVariant);
              return (
                <tr key={job.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.has(job.id)}
                      onChange={() => onToggle(job.id)}
                    />
                  </td>
                  <td className="fw-semibold">{job.jobId}</td>
                  <td className="text-muted">{job.jobDate}</td>
                  <td>
                    {variant.custom
                      ? <Badge variant={variant.custom}>{job.jobType}</Badge>
                      : <span className={`badge rounded-pill ${variant.raw}`}>{job.jobType}</span>}
                  </td>
                  <td className="text-muted small">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
                    </svg>
                    {job.route}
                  </td>
                  <td className="text-muted">{job.etd}</td>
                  <td className="text-end fw-semibold">{job.revenue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
