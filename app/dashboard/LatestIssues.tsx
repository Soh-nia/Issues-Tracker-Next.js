import prisma from '@/lib/prisma';
import IssueStatusBadge from '../components/IssueStatusBadge';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  userId: string;
}

const LatestIssues = async ({ userId }: Props) => {
  const issues = await prisma.issue.findMany({
    where: {
      createdByUserId: userId,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h4 className="text-3xl font-bold">Latest Issues</h4>
        {issues.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Image
              src="/auth.png"
              width={200}
              height={200}
              alt="No issues illustration"
              className="opacity-80"
            />
            <p className="text-center text-neutral text-lg">
              No issues yet. Create one by clicking on the Create Issue button.
            </p>
            <Link
              href="/dashboard/issues/new"
              className="btn bg-accent text-white px-6 py-2"
            >
              Create Issue
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <Link
                            href={`/dashboard/issues/${issue.id}`}
                            className="font-medium text-lg"
                          >
                            {issue.title}
                          </Link>
                          <IssueStatusBadge status={issue.status} />
                        </div>
                        {issue.assignedToUser && (
                          <div className="avatar">
                            <div className="mask mask-circle h-10 w-10">
                              <Image
                                src={issue.assignedToUser.image ?? '/default.png'}
                                width={40}
                                height={40}
                                alt={`${issue.assignedToUser.name ?? 'User'}'s avatar`}
                                className="rounded-full"
                                unoptimized={issue.assignedToUser.image?.startsWith('https://lh3.googleusercontent.com')}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestIssues;