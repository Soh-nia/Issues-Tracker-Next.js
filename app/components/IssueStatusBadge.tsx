import { Status } from '@prisma/client'
import React from 'react'

const statusMap: Record<
  Status, 
  { label: string, color: 'bg-error' | 'bg-info' | 'bg-success' }
> = {
  OPEN: { label: 'Open', color: 'bg-error' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-info' },
  CLOSED: { label: 'Closed', color: 'bg-success' }
};

const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <div className={`badge ${statusMap[status].color}`}>{statusMap[status].label}</div>
  )
}

export default IssueStatusBadge