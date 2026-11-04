import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchReports, searchReports } from '../store/slices/reportSlice';
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

  const { user } = useAppSelector((state) => state.auth || {});

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = filters.search?.trim();
      if (query) {
        dispatch(searchReports(query));
      } else {
        dispatch(fetchReports(filters));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  const visibleReports = useMemo(() => {
    return reports.filter((report) => {
      const reporterId = typeof report.reporter === 'string' ? report.reporter : report.reporter?._id;
      if (user?._id && reporterId && reporterId !== user._id) return false;
      if (filters.type && report.type !== filters.type) return false;
      if (filters.status && report.status !== filters.status) return false;
      if (filters.category && report.category !== filters.category) return false;
      if (filters.location && !report.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [reports, filters, user]);

  if (loading && reports.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-[#2B2A28]">
          {user ? `Your reports` : 'Community reports'}
        </h1>
        <p className="mt-1.5 text-[#6B6459]">
          {user ? 'Items you have reported on the platform.' : 'Lost and found items reported by people around you.'}
        </p>
      </header>

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
        resultCount={visibleReports.length}
      />

      {visibleReports.length === 0 ? (
        <EmptyState
          message={
            reports.length === 0
              ? 'No reports found.'
              : 'No reports match your search.'
          }
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReports.map((report) => (
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