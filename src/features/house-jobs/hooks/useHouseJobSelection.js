// features/house-jobs/hooks/useHouseJobSelection.js
import { useState, useMemo, useCallback } from 'react';
import { HOUSE_JOBS } from '../api/houseJobsData';

function parseRevenue(str) {
  return Number(str.replace(/[^0-9.]/g, '')) || 0;
}

export function useHouseJobSelection() {
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const toggle = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === HOUSE_JOBS.length ? new Set() : new Set(HOUSE_JOBS.map((j) => j.id))
    );
  }, []);

  const selectedJobs = useMemo(
    () => HOUSE_JOBS.filter((j) => selectedIds.has(j.id)),
    [selectedIds]
  );

  const totals = useMemo(() => {
    const totalRevenue = selectedJobs.reduce((sum, j) => sum + parseRevenue(j.revenue), 0);
    const totalCost = totalRevenue * 0.7; // illustrative estimate, matches the design's 0-state
    const margin = 10;
    const expectedProfit = totalRevenue - totalCost;
    return { totalRevenue, totalCost, expectedProfit, margin };
  }, [selectedJobs]);

  return {
    jobs: HOUSE_JOBS,
    selectedIds,
    selectedJobs,
    toggle,
    selectAll,
    allSelected: selectedIds.size === HOUSE_JOBS.length,
    totals,
  };
}
