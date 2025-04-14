import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import DeleteIssueButton from './DeleteIssueButton';
import AssigneeSelect from './AssigneeSelect';
import { cache } from 'react';
import { Suspense } from 'react';
import { IssueDetailSkeleton } from '../_components/IssueDetailSkeleton';
import { auth } from '@/auth';

interface Props {
  params: Promise<{ id: string }>;
}

const fetchIssue = cache(async (issueId: number, userId: string) => {
  return prisma.issue.findFirst({
    where: { 
      id: issueId,
      createdByUserId: userId,
    },
  });
});

const IssueDetailPage = async ({ params }: Props) => {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to view this issue.</div>;
  }

  const resolvedParams = await params;
  const issueId = parseInt(resolvedParams.id);
  const issue = await fetchIssue(issueId, session.user.id);

  if (!issue) notFound();

  return (
    <Suspense fallback={<IssueDetailSkeleton />}>
      <div className="card bg-base-100 shadow-md m-10 p-10">
        <div className="card-body">
          <div className="p-5 flex grow flex-col gap-6 md:flex-row">
            <div className="md:w-5/6">
              <IssueDetails issue={issue} />
            </div>
            <div className="flex flex-col gap-4 md:w-1/6">
              <AssigneeSelect issue={issue} />
              <EditIssueButton issueId={issue.id} />
              <DeleteIssueButton issueId={issue.id} />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export async function generateMetadata({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      title: 'Issue Tracker - Access Denied',
      description: 'Please sign in to view this issue.',
    };
  }

  const resolvedParams = await params;
  const issueId = parseInt(resolvedParams.id);
  const issue = await fetchIssue(issueId, session.user.id);

  return {
    title: issue?.title || 'Issue Not Found',
    description: issue ? `Details of issue ${issue.id}` : 'Issue not found or access denied.',
  };
}

export default IssueDetailPage;