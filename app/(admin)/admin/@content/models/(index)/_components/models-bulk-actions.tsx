"use client";

import { Button } from "@/components/ui/button";
import { useBulkUpdatePublished } from "@/hooks/queries/models/use-bulk-update-published";
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ModelsBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onDeleteClick: () => void;
}

export function ModelsBulkActions({
  selectedIds,
  onClearSelection,
  onDeleteClick,
}: ModelsBulkActionsProps) {
  const bulkUpdate = useBulkUpdatePublished();

  // Handle bulk publish/unpublish
  const handleBulkPublish = (publish: boolean) => {
    bulkUpdate.mutate(
      { ids: selectedIds, published: publish },
      {
        onSuccess: () => {
          toast.success(
            `${selectedIds.length} model(s) ${publish ? "published" : "unpublished"} successfully`
          );
          onClearSelection();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleBulkPublish(true)}
        disabled={bulkUpdate.isPending}
        title="Publish selected"
      >
        {bulkUpdate.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleBulkPublish(false)}
        disabled={bulkUpdate.isPending}
        title="Unpublish selected"
      >
        {bulkUpdate.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDeleteClick}
        disabled={bulkUpdate.isPending}
        title="Delete selected"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
