'use client';

import Spinner from '@/app/components/Spinner';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteIssue } from '@/app/lib/action';

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteIssue(issueId.toString());
      if (result?.message) {
        setError(result.message);
      } else {
        router.push('/dashboard/issues/list');
        router.refresh();
      }
    });
  };

  return (
    <>
      <button
        className="btn items-center border bg-error rounded-lg px-6 py-3 font-medium text-error-content hover:text-base-content transition-colors text-base"
        onClick={() => (document.getElementById('my_modal_5') as HTMLDialogElement)?.showModal()}
        disabled={isPending}
      >
        Delete Issue
        {isPending && <Spinner />}
      </button>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle text-center">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete this issue? This action cannot be undone.
          </p>
          <div className="modal-action flex justify-center gap-4">
            <form method="dialog">
              <button 
              className="btn h-10 items-center rounded-lg bg-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-300">Cancel</button>
            </form>
            <button
              className="btn h-10 items-center bg-error rounded-lg px-4 font-medium text-error-content hover:text-base-content transition-colors text-base"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete Issue {isPending && <Spinner />}
            </button>
          </div>
        </div>
      </dialog>

      {error && (
        <dialog open className="modal modal-bottom sm:modal-middle text-center">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Error</h3>
            <p className="py-4">{error}</p>
            <div className="modal-action flex justify-center">
              <button
                className="btn btn-ghost"
                onClick={() => setError(null)}
              >
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default DeleteIssueButton;