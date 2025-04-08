import IssuesTableSkeleton from '@/app/dashboard/issues/_components/IssuesTableSkeleton';
import IssueActions from './IssueActions';

export default function Loading() {
  return (
    <div className="flex flex-col gap-3 md:p-10 p-5 min-h-screen">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <IssueActions />
          <IssuesTableSkeleton />
        </div>
      </div>
    </div>
  );
}