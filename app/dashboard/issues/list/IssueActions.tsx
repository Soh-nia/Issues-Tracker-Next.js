'use client';

import Link from 'next/link';
import React from 'react';
import IssueStatusFilter from './IssueStatusFilter';

const IssueActions = () => {
  return (
    <div className="flex md:flex-row md:justify-between flex-col">
        <IssueStatusFilter />
        <Link
        href="/dashboard/issues/new"
        className="flex items-center self-start rounded-lg bg-primary px-4 py-2 mt-3 md:mt-0 md:px-6 md:py-3 text-sm font-medium text-primary-content transition-colors hover:bg-primary-content hover:text-white md:text-base">
            New Issue
        </Link>
    </div>
  );
};

export default IssueActions;