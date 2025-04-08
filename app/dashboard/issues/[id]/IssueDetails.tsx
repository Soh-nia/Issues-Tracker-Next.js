import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import { Issue } from '@prisma/client';
import ReactMarkdown from 'react-markdown';

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <h4 className={`text-2xl font-bold`}>{issue.title}</h4>
      <div className="flex flex-row gap-5 my-2">
        <IssueStatusBadge status={issue.status} />
        <p className='text-sm'>{issue.createdAt.toDateString()}</p>
      </div>
      <div className="card bg-base-100 shadow-md mt-5">
        <div className="card-body">
            <ReactMarkdown>{issue.description}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default IssueDetails;