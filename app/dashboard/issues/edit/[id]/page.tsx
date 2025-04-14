import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IssueForm from '@/app/dashboard/issues/_components/EditIssueForm';
import { cache } from 'react';
import { auth } from '@/auth';

interface Props {
  params: Promise<{ id: string }>;
}

const fetchIssue = cache((issueId: number, userId: string) =>
  prisma.issue.findFirst({
    where: { 
      id: issueId,
      createdByUserId: userId,
    },
  })
);

const EditIssuePage = async ({ params }: Props) => {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to edit this issue.</div>;
  }

  const resolvedParams = await params;
  const issueId = parseInt(resolvedParams.id);
  const issue = await fetchIssue(issueId, session.user.id);

  if (!issue) notFound();

  return (
    <div className="hero bg-base-200">
      <div className="hero-content">
        <IssueForm issue={issue} id={issue.id.toString()} />
      </div>
    </div>
  );
};

export async function generateMetadata({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      title: 'Issue Tracker - Access Denied',
      description: 'Please sign in to edit this issue.',
    };
  }

  const resolvedParams = await params;
  const issueId = parseInt(resolvedParams.id);
  const issue = await fetchIssue(issueId, session.user.id);

  return {
    title: issue?.title || 'Issue Not Found',
    description: issue ? `Edit issue ${issue.id}` : 'Issue not found or access denied.',
  };
}

export default EditIssuePage;