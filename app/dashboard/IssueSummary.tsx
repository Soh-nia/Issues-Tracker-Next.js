import { Status } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const containers: {
    label: string;
    value: number;
    status: Status;
  }[] = [
    { label: 'Open Issues', value: open, status: 'OPEN' },
    {
      label: 'In-progress Issues',
      value: inProgress,
      status: 'IN_PROGRESS',
    },
    { label: 'Closed Issues', value: closed, status: 'CLOSED' },
  ];

  return (
    <div className="flex flex-row gap-4">
      {containers.map((container) => (
        <div className="card bg-base-100 shadow-sm" key={container.label}>
            <div className="card-body">
                <div className="flex flex-col gap-1">
                    <Link
                    className='text-sm font-medium'
                    href={`/dashboard/issues/list?status=${container.status}`}
                    >
                    {container.label}
                    </Link>
                    <p className="text-l md:text-xl md:leading-normal text-primary-content font-bold">
                    {container.value}
                    </p>
                </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueSummary;