"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SubmissionsBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onDeleteClick: () => void;
}

export function SubmissionsBulkActions({
  selectedIds,
  onClearSelection,
  onDeleteClick,
}: SubmissionsBulkActionsProps) {
  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDeleteClick}
        title="Delete selected"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
