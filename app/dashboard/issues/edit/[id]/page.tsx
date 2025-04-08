import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IssueForm from '@/app/dashboard/issues/_components/EditIssueForm';

interface Props {
  params: { id: string };
}

const EditIssuePage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  return (
    <div className="hero bg-base-200">
      <div className="hero-content">
        <IssueForm issue={issue} id={params.id} />
      </div>
    </div>
  )
};

export default EditIssuePage;