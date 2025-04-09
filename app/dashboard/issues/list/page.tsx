import Pagination from '@/app/components/Pagination';
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';
import IssueActions from './IssueActions';
import IssueTable, { IssueQuery } from './IssueTable';
import { Metadata } from 'next';
import IssuesTableSkeleton from '../_components/IssuesTableSkeleton';
import { Suspense } from 'react';

// Force dynamic rendering to avoid static prerendering issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all project issues',
};

async function fetchFilteredIssues(status: Status | undefined, page: number, pageSize: number) {
  try {
    const where = status ? { status } : {};
    const issues = await prisma.issue.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const totalIssues = await prisma.issue.count({ where });
    return { issues, totalIssues };
  } catch (error) {
    console.error('Error fetching issues:', error);
    return { issues: [], totalIssues: 0 }; // Fallback to empty state
  }
}

export default async function IssuesPage({ searchParams }: { searchParams?: Promise<IssueQuery> }) {
  const resolvedSearchParams = await searchParams;
  const status = Object.values(Status).includes(resolvedSearchParams?.status as Status)
    ? (resolvedSearchParams?.status as Status)
    : undefined;
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = 10;

  const { issues, totalIssues } = await fetchFilteredIssues(status, page, pageSize);

  return (
    <div className="flex flex-col gap-3 md:p-10 p-5 min-h-screen">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <Suspense fallback={<div className="h-10 bg-gray-200 animate-pulse rounded"></div>}>
            <IssueActions />
          </Suspense>
          <Suspense key={page} fallback={<IssuesTableSkeleton />}>
            <IssueTable searchParams={resolvedSearchParams || ({} as IssueQuery)} issues={issues} />
          </Suspense>
          <Suspense fallback={<div className="h-8 w-40 bg-gray-200 animate-pulse rounded mt-3"></div>}>
            <Pagination pageSize={pageSize} currentPage={page} itemCount={totalIssues} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}