"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useModels } from "@/hooks/queries/models/use-models";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { modelSearchParamsSchema } from "./_validators";
import { ModelsTable } from "./_components/models-table";
import { ModelsTableSkeleton } from "./_components/models-table-skeleton";
import { ModelsFilters } from "./_components/models-filters";
import { ModelsBulkActions } from "./_components/models-bulk-actions";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useDeleteModel } from "@/hooks/queries/models/use-delete-model";
import { toast } from "sonner";

export default function ModelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const deleteModel = useDeleteModel();

  // Parse search params for filters
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const { search, category, published } =
    modelSearchParamsSchema.parse(searchParamsObj);

  // Parse search params for query
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const local = searchParams.get("local")
    ? searchParams.get("local") === "true"
    : undefined;
  const inTown = searchParams.get("inTown")
    ? searchParams.get("inTown") === "true"
    : undefined;

  // Fetch models with React Query
  const { data, isLoading, error } = useModels({
    page,
    limit,
    sortOrder,
    category,
    published,
    local,
    inTown,
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: {
    search?: string;
    category?: string;
    published?: boolean;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update search param
    if (newFilters.search) {
      params.set("search", newFilters.search);
    } else {
      params.delete("search");
    }

    // Update category param
    if (newFilters.category && newFilters.category !== "all") {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }

    // Update published param
    if (newFilters.published !== undefined) {
      params.set("published", String(newFilters.published));
    } else {
      params.delete("published");
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`/admin/models?${params.toString()}`);
  };

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

      setSelectedIds([]);
      setBulkDeleteDialogOpen(false);
    });
  };

  // Check if filters are active
  const hasActiveFilters = !!(search || category || published !== undefined);

  return (
    <div className="space-y-6">
      {/* Filters and Bulk Actions */}
      <div className="flex items-center justify-between gap-4">
        <ModelsFilters
          filters={{ search, category, published }}
          onFiltersChange={handleFiltersChange}
        />
        <ModelsBulkActions
          selectedIds={selectedIds}
          onClearSelection={() => setSelectedIds([])}
          onDeleteClick={() => setBulkDeleteDialogOpen(true)}
        />
      </div>

      {/* Show skeleton during initial load */}
      {isLoading && <ModelsTableSkeleton />}

      {/* Show error state */}
      {error && (
        <div className="rounded-lg border border-destructive/50 p-8 text-center">
          <p className="text-destructive">
            Failed to load models: {error.message}
          </p>
        </div>
      )}

      {/* Show data or empty state */}
      {data && (
        <div className="space-y-4">
          {data.items.length === 0 ? (
            /* Empty State */
            hasActiveFilters ? (
              /* No results for filters/search */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-muted-foreground"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No models match your current filters. Try adjusting your search.
                </p>
              </div>
            ) : (
              /* No models created yet */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No models yet</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating your first model.
                </p>
              </div>
            )
          ) : (
            <>
              {/* Models Table */}
              <ModelsTable
                data={data.items}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onDelete={(id) => {
                  // Single delete is handled within ModelsTable
                }}
              />

              {/* Pagination */}
              {data.totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/admin/models?${new URLSearchParams({
                          ...Object.fromEntries(searchParams.entries()),
                          page: Math.max(1, data.page - 1).toString(),
                        }).toString()}`}
                        className={
                          data.page === 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === data.totalPages ||
                          Math.abs(page - data.page) <= 1
                      )
                      .map((page, index, array) => {
                        const showEllipsis =
                          index > 0 && array[index - 1] !== page - 1;
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && (
                              <PaginationItem>
                                <span className="px-2">...</span>
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                href={`/admin/models?${new URLSearchParams({
                                  ...Object.fromEntries(searchParams.entries()),
                                  page: page.toString(),
                                }).toString()}`}
                                isActive={page === data.page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        );
                      })}
                    <PaginationItem>
                      <PaginationNext
                        href={`/admin/models?${new URLSearchParams({
                          ...Object.fromEntries(searchParams.entries()),
                          page: Math.min(data.totalPages, data.page + 1).toString(),
                        }).toString()}`}
                        className={
                          data.page === data.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.length} Models`}
        description={`Are you sure you want to delete ${selectedIds.length} models? This action cannot be undone.`}
      />
    </div>
  );
}
