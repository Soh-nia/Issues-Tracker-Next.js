import prisma from '@/lib/prisma';
import React from 'react';
import IssueStatusBadge from '../components/IssueStatusBadge';
import Link from 'next/link';
import Image from 'next/image';


const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
            <h4 className={`text-3xl font-bold`}>Latest Issues</h4>
            <div className="overflow-x-auto">
                <table className="table">
                    <tbody>
                        {issues.map((issue) => (
                            <tr key={issue.id}>
                                <td>
                                    <div className="flex items-center justify-between">
                                        <div className='flex items-start gap-2'>
                                            <Link href={`/dashboard/issues/${issue.id}`} className="font-medium text-lg">
                                                {issue.title}
                                            </Link>
                                            <IssueStatusBadge status={issue.status} />
                                        </div>
                                        {issue.assignedToUser && (
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <Image
                                                        src={issue.assignedToUser.image ?? '/default.jpg'}
                                                        width={12}
                                                        height={12}
                                                        alt="User Avatar"
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
        </div>
    </div>
  );
};

export default LatestIssues;