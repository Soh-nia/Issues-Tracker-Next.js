"use client";

import Spinner from "@/app/components/Spinner";
import { Issue, User } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { useState, useTransition, useEffect } from "react";
import { updateIssue } from "@/app/lib/action";
import { useRouter } from "next/navigation";

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(issue.assignedToUserId || null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch(() => {
        setError("Failed to load users");
        toast.error("Failed to load users");
      });
  }, []);

  useEffect(() => {
    setSelectedUserId(issue.assignedToUserId || null);
  }, [issue.assignedToUserId]);

  const assignIssue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value === "null" ? null : event.target.value;
    setSelectedUserId(userId);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("assignedToUserId", userId || "");

      // No redirectTo (undefined) for AssigneeSelect
      const result = await updateIssue(issue.id.toString(), undefined, { message: null, errors: {} }, formData);
      if (result?.message || result?.errors) {
        setError(result.message || "Failed to assign issue");
        toast.error(result.message || "Failed to assign issue");
        setSelectedUserId(issue.assignedToUserId || null);
      } else {
        toast.success("Issue assigned successfully");
        router.refresh();
      }
    });
  };

  return (
    <>
      <select
        className="select select-lg border-base-300"
        value={selectedUserId || "null"}
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
      <Toaster />
    </>
  );
};

export default AssigneeSelect;