import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import DeleteIssueButton from './DeleteIssueButton';
import AssigneeSelect from './AssigneeSelect';
import { cache } from 'react';
import { Suspense } from 'react';
import { IssueDetailSkeleton } from '../_components/IssueDetailSkeleton';

interface Props {
  params: { id: string };
}

const fetchUser = cache((issueId: number) => prisma.issue.findUnique({ where: { id: issueId } }));

const IssueDetailPage = async ({ params }: Props) => {
  const issue = await fetchUser(parseInt(params.id));

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
  const issue = await fetchUser(parseInt(params.id));

  return {
    title: issue?.title,
    description: 'Details of issue ' + issue?.id,
  };
}

export default IssueDetailPage;