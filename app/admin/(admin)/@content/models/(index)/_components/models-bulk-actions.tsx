"use client";

import { Button } from "@/components/ui/button";
import { useBulkUpdatePublished } from "@/hooks/queries/models/use-bulk-update-published";
import { useRevalidateBulkProfiles } from "@/hooks/queries/models/use-revalidate-bulk-profiles";
import { Eye, EyeOff, Loader2, RefreshCw, Trash2 } from "lucide-react";
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
  const bulkRevalidate = useRevalidateBulkProfiles();

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

  // Handle bulk revalidate
  const handleBulkRevalidate = () => {
    bulkRevalidate.mutate(
      { ids: selectedIds },
      {
        onSuccess: () => {
          toast.success(
            `${selectedIds.length} model profile cache(s) revalidated`
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

  const isPending = bulkUpdate.isPending || bulkRevalidate.isPending;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleBulkPublish(true)}
        disabled={isPending}
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
        disabled={isPending}
        title="Unpublish selected"
      >
        {bulkUpdate.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleBulkRevalidate}
        disabled={isPending}
        title="Revalidate selected model profiles"
      >
        {bulkRevalidate.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDeleteClick}
        disabled={isPending}
        title="Delete selected"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
