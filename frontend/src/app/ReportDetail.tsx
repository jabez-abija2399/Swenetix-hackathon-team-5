import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import {
  fetchReportById,
  fetchReportMatches,
  removeReport,
  clearSelectedReport,
  clearMatches,
} from '../store/slices/reportSlice';
import ReportDetailView from '../components/reports/ReportDetailView';
import ReportCard from '../components/reports/ReportCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { selectedReport: report, matches = [], loading, error } = useAppSelector(
    (state) => state.reports
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchReportById(id));
      dispatch(fetchReportMatches(id));
    }
    return () => {
      dispatch(clearSelectedReport());
      dispatch(clearMatches());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!id) return;
    await dispatch(removeReport(id));
    navigate('/');
  };

  if (loading) return <LoadingSpinner />;
  if (error || !report) return <ErrorMessage message={error || 'Report not found'} />;

  return (
    <div className="report-page report-page--narrow">
      <ReportDetailView report={report} />

      <div className="report-actions">
        <button type="button" className="btn btn--ghost" onClick={() => navigate('/')}>
          Back
        </button>
        <button
          type="button"
          className="btn btn--brand"
          onClick={() => navigate(`/reports/${id}/edit`)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => setConfirmOpen(true)}
        >
          Delete
        </button>
      </div>

      {matches.length > 0 && (
        <section className="report-matches">
          <h2 className="report-section-title">Possible matches</h2>
          <div className="report-list report-list--compact">
            {matches.map((match) => (
              <ReportCard
                key={match._id}
                report={match}
                onClick={() => navigate(`/reports/${match._id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this report?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
