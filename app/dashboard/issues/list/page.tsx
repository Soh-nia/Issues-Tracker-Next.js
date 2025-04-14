import Pagination from '@/app/components/Pagination';
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';
import IssueActions from './IssueActions';
import IssueTable, { IssueQuery } from './IssueTable';
import { Metadata } from 'next';
import IssuesTableSkeleton from '../_components/IssuesTableSkeleton';
import { Suspense } from 'react';
import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';

// Force dynamic rendering to avoid static prerendering issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all your project issues',
};

async function fetchFilteredIssues(
  userId: string,
  status: Status | undefined,
  page: number,
  pageSize: number
) {
  try {
    const where = {
      createdByUserId: userId,
      ...(status && { status }),
    };
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
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to view your issues.</div>;
  }

  const resolvedSearchParams = await searchParams;
  const status = Object.values(Status).includes(resolvedSearchParams?.status as Status)
    ? (resolvedSearchParams?.status as Status)
    : undefined;
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = 10;

  const { issues, totalIssues } = await fetchFilteredIssues(session.user.id, status, page, pageSize);

  return (
    <div className="flex flex-col gap-3 md:p-10 p-5 min-h-screen">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
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
            <Suspense
              fallback={
                <div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded mb-4"></div>
                  <IssuesTableSkeleton />
                  <div className="h-8 w-40 bg-gray-200 animate-pulse rounded mt-3"></div>
                </div>
              }
            >
              <IssueActions />
              <IssueTable searchParams={resolvedSearchParams || ({} as IssueQuery)} issues={issues} />
              <Pagination pageSize={pageSize} currentPage={page} itemCount={totalIssues} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}