"use client";

import Spinner from "@/app/components/Spinner";
import { Issue } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { useState, useTransition, useEffect } from "react";
import { updateIssue, getCurrentUser } from "@/app/lib/action";
import { useRouter } from "next/navigation";

// Define a minimal User type matching getCurrentUser's return
interface MinimalUser {
  id: string;
  name: string | null;
  email: string | null;
}

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const [user, setUser] = useState<MinimalUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(issue.assignedToUserId || null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        if (data) {
          setUser(data);
          // If the issue is assigned to someone else, reset to unassigned
          if (issue.assignedToUserId && issue.assignedToUserId !== data.id) {
            setSelectedUserId(null);
          }
        } else {
          setError("Failed to load user data");
          toast.error("Failed to load user data");
        }
      })
      .catch(() => {
        setError("Failed to load user data");
        toast.error("Failed to load user data");
      });
  }, [issue.assignedToUserId]);

  useEffect(() => {
    setSelectedUserId(issue.assignedToUserId || null);
  }, [issue.assignedToUserId]);

  const assignIssue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value === "null" ? null : event.target.value;
    setSelectedUserId(userId);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("assignedToUserId", userId || "");

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

  if (!user) {
    return <Spinner />;
  }

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
        <option value={user.id} className="text-base">
          {user.name || user.email}
        </option>
      </select>
      {isPending && <Spinner />}
      {error && <p className="text-error mt-2">{error}</p>}
      <Toaster />
    </>
  );
};

export default AssigneeSelect;