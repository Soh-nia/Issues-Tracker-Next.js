import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IssueForm from '@/app/dashboard/issues/_components/EditIssueForm';
import { cache } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

const fetchIssue = cache((issueId: number) => prisma.issue.findUnique({ where: { id: issueId } }));

const EditIssuePage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const issue = await fetchIssue(parseInt(resolvedParams.id));

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
  const resolvedParams = await params;
  const issue = await fetchIssue(parseInt(resolvedParams.id));

  return {
    title: issue?.title,
    description: 'Details of issue ' + issue?.id,
  };
}

export default EditIssuePage;