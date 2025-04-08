import Pagination from '@/app/components/Pagination';
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';
import IssueActions from './IssueActions';
import IssueTable, { IssueQuery } from './IssueTable';
import { Metadata } from 'next';
import IssuesTableSkeleton from '../_components/IssuesTableSkeleton';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all project issues'
};

async function fetchFilteredIssues(status: Status | undefined, page: number, pageSize: number) {
  const where = status ? { status } : {};
  const issues = await prisma.issue.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const totalIssues = await prisma.issue.count({ where });
  return { issues, totalIssues };
}

export default async function IssuesPage(props: {
    searchParams?: Promise<IssueQuery>;
  }) {
  const searchParams = await props.searchParams;
  const status = Object.values(Status).includes(searchParams?.status as Status)
    ? searchParams?.status
    : undefined;
  const page = Number(searchParams?.page) || 1;
  const pageSize = 10;
  const { issues, totalIssues } = await fetchFilteredIssues(status, page, pageSize);

  return (
    <div className="flex flex-col gap-3 md:p-10 p-5 min-h-screen">
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <IssueActions />
                <Suspense key={page} fallback={<IssuesTableSkeleton />}>
                  <IssueTable searchParams={searchParams || ({} as IssueQuery)} issues={issues} />
                </Suspense>
                <Pagination
                  pageSize={pageSize}
                  currentPage={page}
                  itemCount={totalIssues}
                />
            </div>
        </div>
    </div>
  );
};