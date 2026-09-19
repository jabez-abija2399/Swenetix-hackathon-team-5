import type { ReportFilterParams } from '../../types/report.types';
import { LostItemCategory } from '../../types/report.types';

interface ReportFiltersProps {
  filters: ReportFilterParams;
  onChange: (filters: ReportFilterParams) => void;
  onReset: () => void;
  resultCount: number;
}

export default function ReportFilters({
  filters,
  onChange,
  onReset,
  resultCount,
}: ReportFiltersProps) {
  const update = (patch: Partial<ReportFilterParams>) => {
    onChange({ ...filters, ...patch });
  };

  const hasActiveFilters =
    Boolean(filters.search) || Boolean(filters.type) || Boolean(filters.status) || Boolean(filters.category);

  return (
    <section className="report-filters">
      <div className="report-filters__search">
        <label htmlFor="report-search" className="sr-only">
          Search reports
        </label>
        <input
          id="report-search"
          type="search"
          className="report-filters__input"
          placeholder="Search by title, description, or location..."
          value={filters.search || ''}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>

      <div className="report-filters__group">
        <label htmlFor="filter-type" className="sr-only">
          Type
        </label>
        <select
          id="filter-type"
          className="report-filters__select"
          value={filters.type || ''}
          onChange={(e) =>
            update({ type: (e.target.value || undefined) as ReportFilterParams['type'] })
          }
        >
          <option value="">All types</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>

        <label htmlFor="filter-status" className="sr-only">
          Status
        </label>
        <select
          id="filter-status"
          className="report-filters__select"
          value={filters.status || ''}
          onChange={(e) =>
            update({ status: (e.target.value || undefined) as ReportFilterParams['status'] })
          }
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <label htmlFor="filter-category" className="sr-only">
          Category
        </label>
        <select
          id="filter-category"
          className="report-filters__select"
          value={filters.category || ''}
          onChange={(e) =>
            update({
              category: (e.target.value || undefined) as ReportFilterParams['category'],
            })
          }
        >
          <option value="">All categories</option>
          {Object.values(LostItemCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="report-filters__meta">
        <span className="report-filters__count">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </span>
        {hasActiveFilters && (
          <button type="button" className="report-filters__reset" onClick={onReset}>
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}