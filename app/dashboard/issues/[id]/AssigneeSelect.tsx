'use client';

import Spinner from '@/app/components/Spinner';
import { Issue, User } from '@prisma/client';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useTransition, useEffect } from 'react';
import { updateIssue } from '@/app/lib/action';
import { useRouter } from 'next/navigation';

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users', { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch(() => {
        setError('Failed to load users');
        toast.error('Failed to load users');
      });
  }, []);

  const assignIssue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value === 'null' ? null : event.target.value;

    startTransition(async () => {
      const formData = new FormData();
      if (userId) formData.append('assignedToUserId', userId);
      else formData.append('assignedToUserId', ''); // Empty string for null

      const result = await updateIssue(issue.id.toString(), {}, formData);
      if (result.message) {
        setError(result.message);
        toast.error(result.message);
      } else {
        toast.success('Issue assigned successfully');
        router.refresh();
      }
    });
  };

  return (
    <>
      <select
        className="select select-lg border-base-300"
        defaultValue={issue.assignedToUserId || 'null'}
        onChange={assignIssue}
        disabled={isPending || error !== null}
      >
        <option value="null" className="text-base">
          Unassigned
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id} className="text-base">
            {user.name}
          </option>
        ))}
      </select>
      {isPending && <Spinner />}
      {error && <p className="text-error mt-2">{error}</p>}
      {/* <label className="block mt-2 text-sm text-base-content">Suggestions</label> */}
      <Toaster />
    </>
  );
};

export default AssigneeSelect;