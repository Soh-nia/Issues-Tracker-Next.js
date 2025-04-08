import prisma from '@/lib/prisma';
import IssueSummary from '../IssueSummary';
import LatestIssues from '../LatestIssues';
import IssueChart from '../IssueChart';
import { Metadata } from 'next';
// import getServerSession from 'next-auth';
// import { redirect } from 'next/navigation';
// import authOptions from '@/app/api/auth/[...nextauth]/route';

export default async function Page() {
  const open = await prisma.issue.count({
    where: { status: 'OPEN' },
  });
  const inProgress = await prisma.issue.count({
    where: { status: 'IN_PROGRESS' },
  });
  const closed = await prisma.issue.count({
    where: { status: 'CLOSED' },
  });

  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect('/auth/signin');
  // }

  return (
    <div className="p-5 md:p-10 flex grow flex-col gap-6 md:flex-row">
      <div className="flex flex-col gap-5">
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
      <LatestIssues />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Issue Tracker - Dashboard',
  description: 'View a summary of project issues'
};