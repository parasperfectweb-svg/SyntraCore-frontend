// features/dashboard/DashboardPage.jsx
// A lightweight overview landing page. No distinct visual design was
// provided for this route beyond the Email Inbox — this gives /dashboard
// somewhere real to land, built from the same shared Card/Badge
// primitives as the rest of the app, rather than shipping a dead route.
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';

const SUMMARY = [
  { label: 'Unread Emails', value: 12, variant: 'primary' },
  { label: 'Open Quotes', value: 7, variant: 'success' },
  { label: 'House Jobs Pending', value: 13, variant: 'warning' },
];

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="h3 fw-bold mb-1">Welcome back, Sabina</h1>
      <p className="text-muted mb-4">Here's what's happening across your freight operations today.</p>

      <div className="row g-4">
        {SUMMARY.map((item) => (
          <div className="col-md-3" key={item.label}>
            <Card>
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">{item.label}</span>
                <Badge variant={item.variant}>{item.value}</Badge>
              </div>
              <div className="display-6 fw-bold mt-2">{item.value}</div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
