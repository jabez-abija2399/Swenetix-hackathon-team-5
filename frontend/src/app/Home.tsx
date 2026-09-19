import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchReports } from '../store/slices/reportSlice';
import ReportCard from '../components/reports/ReportCard';
import ReportFilters from '../components/reports/ReportFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import type { ReportFilterParams } from '../types/report.types';

const emptyFilters: ReportFilterParams = {};

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<ReportFilterParams>(emptyFilters);

  const { items: reports = [], loading = false, error = null } = useAppSelector(
    (state) => state.reports || {}
  );

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const filteredReports = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();

    return reports.filter((report) => {
      if (filters.type && report.type !== filters.type) return false;
      if (filters.status && report.status !== filters.status) return false;
      if (filters.category && report.category !== filters.category) return false;
      if (!search) return true;

      return (
        report.title.toLowerCase().includes(search) ||
        report.description.toLowerCase().includes(search) ||
        report.location.toLowerCase().includes(search) ||
        report.category.toLowerCase().includes(search)
      );
    });
  }, [reports, filters]);

  if (loading && reports.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="report-page">
      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
        resultCount={filteredReports.length}
      />

      {filteredReports.length === 0 ? (
        <EmptyState
          message={
            reports.length === 0
              ? 'No reports found.'
              : 'No reports match your search.'
          }
        />
      ) : (
        <div className="report-list">
          {filteredReports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onClick={() => navigate(`/reports/${report._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}