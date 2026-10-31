"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteTeamButtonProps = {
  teamId: string;
  teamName: string;
  playerCount: number;
};

type DeleteResponse = {
  error?: string;
};

export default function DeleteTeamButton({
  teamId,
  teamName,
  playerCount,
}: DeleteTeamButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as DeleteResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to delete team.");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        title={
          playerCount > 0
            ? "Teams with players cannot be deleted."
            : `Delete ${teamName}`
        }
        className="text-xs font-semibold text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error ? (
        <p className="max-w-[180px] text-right text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
