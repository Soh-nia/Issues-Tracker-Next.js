
import Link from 'next/link';
import { HiPencil } from "react-icons/hi2";


const EditIssueButton = ({ issueId }: { issueId: number }) => {
  return (
    <Link
    href={`/dashboard/issues/edit/${issueId}`}
    className="btn items-center border bg-warning rounded-lg px-6 py-3 font-medium text-warning-content hover:text-base-content transition-colors text-base"
  >
    <HiPencil className="w-5 md:w-6" /><span>Edit Issue</span>
  </Link>
  );
};

export default EditIssueButton;