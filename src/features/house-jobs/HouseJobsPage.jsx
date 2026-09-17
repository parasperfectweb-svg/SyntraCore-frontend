// features/house-jobs/HouseJobsPage.jsx
import { Link } from 'react-router-dom';
import HouseJobsTable from './components/HouseJobsTable';
import MasterJobSummary from './components/MasterJobSummary';
import { useHouseJobSelection } from './hooks/useHouseJobSelection';

export default function HouseJobsPage() {
  const { jobs, selectedIds, selectedJobs, toggle, selectAll, allSelected, totals } = useHouseJobSelection();

  return (
    <div>
      <nav className="bg-white border-bottom px-4 py-2" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0 small">
          <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/quotes" className="text-decoration-none">Quotes</Link></li>
          <li className="breadcrumb-item"><span className="text-decoration-none">Quote Approval</span></li>
          <li className="breadcrumb-item active fw-semibold" aria-current="page">House Jobs</li>
        </ol>
      </nav>

      <div className="p-4">
        <h1 className="h3 fw-bold mb-1">House Jobs</h1>
        <p className="text-muted mb-4">Select one or more House Jobs to group under a Master Job.</p>

        <div className="row g-4">
          <div className="col-lg-8">
            <HouseJobsTable
              jobs={jobs}
              selectedIds={selectedIds}
              onToggle={toggle}
              onSelectAll={selectAll}
              allSelected={allSelected}
            />
          </div>
          <div className="col-lg-4">
            <MasterJobSummary selectedJobs={selectedJobs} totals={totals} />
          </div>
        </div>
      </div>
    </div>
  );
}
