import prisma from '@/lib/prisma';
import IssueSummary from '../IssueSummary';
import LatestIssues from '../LatestIssues';
import IssueChart from '../IssueChart';
import { Metadata } from 'next';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  const open = await prisma.issue.count({
    where: { 
      status: 'OPEN',
      createdByUserId: session.user.id,
    },
  });
  const inProgress = await prisma.issue.count({
    where: { 
      status: 'IN_PROGRESS',
      createdByUserId: session.user.id,
    },
  });
  const closed = await prisma.issue.count({
    where: { 
      status: 'CLOSED',
      createdByUserId: session.user.id,
    },
  });

  return (
    <div className="p-5 flex flex-col gap-6 md:flex-row md:p-10">
      <div className="flex flex-col gap-5 md:w-3/6">
        <IssueSummary
          open={open}
          inProgress={inProgress}
          closed={closed}
        />
        <IssueChart
          open={open}
          inProgress={inProgress}
          closed={closed}
        />
      </div>
      <div className='md:w-3/6'>
        <LatestIssues userId={session.user.id} />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Issue Tracker - Dashboard',
  description: 'View a summary of your project issues'
};