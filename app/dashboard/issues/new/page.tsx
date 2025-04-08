import { Metadata } from 'next';
import IssueForm from '@/app/dashboard/issues/_components/IssueForm';

export const metadata: Metadata = {
    title: 'Create Issue',
};

const NewIssuePage = () => {
  return (
    <div className="hero bg-base-200">
        <div className="hero-content">
                <IssueForm />
        </div>
    </div>
  )
}

export default NewIssuePage
