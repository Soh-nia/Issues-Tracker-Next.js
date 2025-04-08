'use client';

import { Status } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const statuses: { label: string; value?: Status | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Closed', value: 'CLOSED' },
];

const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <fieldset className="fieldset mt-2">
      <select
        className="select select-xl border-base-300"
        value={searchParams.get('status') || ''}
        onChange={(event) => {
          const status = event.target.value;
          const params = new URLSearchParams(searchParams);
          if (status) params.set('status', status);
          else params.delete('status');
          params.set('page', '1');
          router.push('/dashboard/issues/list?' + params.toString());
        }}
      >
        {/* <option value="" disabled className="text-base">
          Filter ...
        </option> */}
        {statuses.map((status) => (
          <option key={status.label} value={status.value ?? ''} className="text-base">
            {status.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
};

export default IssueStatusFilter;