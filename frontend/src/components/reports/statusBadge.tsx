// export type BadgeStatus = 'LOST' | 'FOUND' | 'OPEN' | 'RESOLVED';

// export default function StatusBadge({ status }: { status: BadgeStatus }) {
//   return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
// }


export type BadgeStatus = 'LOST' | 'FOUND' | 'OPEN' | 'RESOLVED';

const badgeStyles: Record<BadgeStatus, string> = {
  LOST: 'bg-[#B54834]/10 text-[#B54834] border-[#B54834]/30',
  FOUND: 'bg-[#4A6B57]/10 text-[#4A6B57] border-[#4A6B57]/30',
  OPEN: 'bg-[#B54834]/10 text-[#B54834] border-[#B54834]/30',
  RESOLVED: 'bg-[#4A6B57]/10 text-[#4A6B57] border-[#4A6B57]/30',
};

export default function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={`inline-flex items-center self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}