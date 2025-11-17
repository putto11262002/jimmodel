"use client";

import { DataTable } from "@/components/data-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useDeleteModel } from "@/hooks/queries/models/use-delete-model";
import { useUpdateModel } from "@/hooks/queries/models/use-update-model";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ColumnActions, createColumns, Model, SelectionCallbacks } from "./columns";

interface ModelsTableProps {
  data: Model[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDelete: (id: string) => void;
}

export function ModelsTable({
  data,
  selectedIds,
  onSelectionChange,
}: ModelsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);

  // Mutation hooks
  const updateModel = useUpdateModel();
  const deleteModel = useDeleteModel();

  // Convert selectedIds to Set of indices
  const selectedIndices = useMemo(() => {
    const indices = new Set<number>();
    selectedIds.forEach((id) => {
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        indices.add(index);
      }
    });
    return indices;
  }, [selectedIds, data]);

  // Handle single model delete
  const handleDelete = (id: string) => {
    deleteModel.mutate(id, {
      onSuccess: () => {
        toast.success("Model deleted successfully");
        setDeleteDialogOpen(false);
        setModelToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // Handle toggle published status
  const handleTogglePublished = (id: string, currentStatus: boolean) => {
    updateModel.mutate(
      { id, data: { published: !currentStatus } },
      {
        onSuccess: () => {
          toast.success(
            `Model ${!currentStatus ? "published" : "unpublished"} successfully`
          );
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  // Handle row selection
  const handleRowSelect = (index: number, checked: boolean) => {
    const modelId = data[index]?.id;
    if (!modelId) return;

    if (checked) {
      onSelectionChange([...selectedIds, modelId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== modelId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(data.map((item) => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  // Check if row is selected
  const isRowSelected = (index: number) => {
    return selectedIndices.has(index);
  };

  // Create column actions
  const columnActions: ColumnActions = {
    onTogglePublished: handleTogglePublished,
    onDelete: (id: string) => {
      setModelToDelete(id);
      setDeleteDialogOpen(true);
    },
  };

  // Create selection callbacks
  const selectionCallbacks: SelectionCallbacks = {
    isSelected: isRowSelected,
    onSelectRow: handleRowSelect,
  };

  // Create columns
  const columns = createColumns(columnActions, selectionCallbacks);

  // Handle bulk delete
  const handleBulkDelete = () => {
    const deletePromises = selectedIds.map((id) => {
      return new Promise((resolve, reject) => {
        deleteModel.mutate(id, {
          onSuccess: () => resolve(id),
          onError: (error) => reject(error),
        });
      });
    });

    Promise.allSettled(deletePromises).then((results) => {
      const successful = results.filter((r) => r.status === "fulfilled");
      const failed = results.filter((r) => r.status === "rejected");

      if (successful.length > 0) {
        toast.success(`${successful.length} model(s) deleted successfully`);
      }
      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} model(s)`);
      }

      onSelectionChange([]);
      setDeleteDialogOpen(false);
    });
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        selectedRows={selectedIndices}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (modelToDelete) {
            handleDelete(modelToDelete);
          } else {
            handleBulkDelete();
          }
        }}
        title={
          modelToDelete
            ? "Delete Model"
            : `Delete ${selectedIds.length} Models`
        }
        description={
          modelToDelete
            ? "Are you sure you want to delete this model? This action cannot be undone."
            : `Are you sure you want to delete ${selectedIds.length} models? This action cannot be undone.`
        }
      />
    </>
  );
}
