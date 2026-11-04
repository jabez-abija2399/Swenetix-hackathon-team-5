import type { Report } from '../../types/report.types';
import StatusBadge from './statusBadge';

interface Props {
  report: Report;
  onClick: () => void;
}

export default function ReportCard({ report, onClick }: Props) {
  const accentColor = report.type === 'LOST' ? 'border-l-[#B54834]' : 'border-l-[#4A6B57]';

  return (
    <div
      onClick={onClick}
      className={`group flex cursor-pointer flex-col gap-3 rounded-md border border-[#E3DCCB] border-l-[3px] ${accentColor} bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-[#9A927F]`}
    >
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={report.type} />
        <StatusBadge status={report.status} />
      </div>

      {report.imagePath && (
        <div className="overflow-hidden rounded-sm">
          <img
            src={report.imagePath}
            alt={report.title}
            className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <h3 className="font-serif text-lg font-semibold text-[#2B2A28]">
        {report.title}
      </h3>
      <p className="text-sm text-[#6B6459]">
        {report.category} • {report.location}
      </p>
    </div>
  );
}