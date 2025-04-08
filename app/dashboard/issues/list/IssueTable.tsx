import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import { HiArrowSmUp } from "react-icons/hi";
import Link from 'next/link'
import React from 'react'
import { Issue, Status } from '@prisma/client'

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  page: string;
}

interface Props {
  searchParams: IssueQuery,
  issues: Issue[]
}

const IssueTable = ({ searchParams, issues }: Props) => {
  return (
    <div className="overflow-x-auto">
        <table className="table table-zebra">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.value} className={`${column.className} text-xl`}>
                        <Link
                          href={{
                            pathname: '/dashboard/issues/list',
                            query: {
                              ...(searchParams.status && { status: searchParams.status }),
                              orderBy: column.value,
                              page: searchParams.page || '1',
                            },
                          }}
                        >
                          {column.label}
                        </Link>
                        {column.value === searchParams.orderBy && (
                          <HiArrowSmUp className="inline" />
                        )}
                      </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {issues.map((issue) => (
                    <tr key={issue.id}>
                        <td>
                            <Link href={`/dashboard/issues/${issue.id}`}>
                            {issue.title}
                            </Link>
                            <div className="block md:hidden">
                                <IssueStatusBadge status={issue.status} />
                            </div>
                        </td>
                        <td>
                            <div className="hidden md:block">
                                <IssueStatusBadge status={issue.status} />
                            </div>
                        </td>
                        <td>
                            <div className="hidden md:block">
                                {issue.createdAt.toDateString()}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: 'Issue', value: 'title' },
    { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
    { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
  ];

  export const columnNames = columns.map((column) => column.value);

  export default IssueTable;