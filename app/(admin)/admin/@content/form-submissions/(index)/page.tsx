"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormSubmissions } from "@/hooks/queries/form-submissions/use-form-submissions";
import { useDeleteSubmission } from "@/hooks/queries/form-submissions/use-delete-submission";
import { useUpdateSubmissionStatus } from "@/hooks/queries/form-submissions/use-update-submission-status";
import { useBulkDeleteSubmissions } from "@/hooks/queries/form-submissions/use-bulk-delete-submissions";
import { formSubmissionSearchParamsSchema } from "./_validators";
import { FORM_SUBMISSION_SUBJECTS } from "@/lib/data/form-submission-subjects";
import { SubmissionsTableSkeleton } from "./_components/submissions-table-skeleton";
import { SubmissionsBulkActions } from "./_components/submissions-bulk-actions";
import { SubmissionDetailSheet } from "./_components/submission-detail-sheet";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { MoreHorizontal, Trash2, Eye, Mail, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function FormSubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Parse search params
  const parsed = formSubmissionSearchParamsSchema.parse({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "20",
    subject: searchParams.get("subject") || undefined,
    status: searchParams.get("status") || undefined,
  });

  // Fetch data
  const { data, isPending, error } = useFormSubmissions(parsed);

  // Mutations
  const deleteSubmission = useDeleteSubmission();
  const updateStatus = useUpdateSubmissionStatus();
  const bulkDelete = useBulkDeleteSubmissions();

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1
    router.push(`/admin/form-submissions?${params.toString()}`);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteSubmission.mutate(id, {
      onSuccess: () => {
        toast.success("Submission deleted");
        setDeleteDialogOpen(false);
        setSubmissionToDelete(null);
      },
      onError: (error) => {
        toast.error("Failed to delete", { description: error.message });
      },
    });
  };

  // Handle status update
  const handleStatusUpdate = (id: string, status: "new" | "read" | "responded") => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success("Status updated");
        },
        onError: (error) => {
          toast.error("Failed to update status", { description: error.message });
        },
      }
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    bulkDelete.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`${selectedIds.length} submissions deleted`);
        setSelectedIds([]);
      },
      onError: (error) => {
        toast.error("Failed to delete", { description: error.message });
      },
    });
  };

  // Handle selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (!data) return;
    if (selectedIds.length === data.items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.items.map((s) => s.id));
    }
  };

  // Handle opening detail sheet
  const handleViewDetails = (id: string) => {
    setSelectedSubmissionId(id);
    setDetailSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Bulk Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <Select
            value={parsed.subject || "all"}
            onValueChange={(v) => handleFilterChange("subject", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {FORM_SUBMISSION_SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={parsed.status || "all"}
            onValueChange={(v) => handleFilterChange("status", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SubmissionsBulkActions
          selectedIds={selectedIds}
          onClearSelection={() => setSelectedIds([])}
          onDeleteClick={() => setBulkDeleteDialogOpen(true)}
        />
      </div>

      {/* Loading state */}
      {isPending && <SubmissionsTableSkeleton />}

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/50 p-8 text-center">
          <p className="text-destructive">
            Failed to load submissions: {error.message}
          </p>
        </div>
      )}

      {/* Empty state */}
      {data && data.items.length === 0 && (
        <>
          {/* Filter active but no results */}
          {(parsed.subject || parsed.status) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No matches found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters to see more results.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  handleFilterChange("subject", undefined);
                  handleFilterChange("status", undefined);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* No filter, truly empty */}
          {!parsed.subject && !parsed.status && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No form submissions yet</h3>
              <p className="text-sm text-muted-foreground">
                Form submissions from your contact page will appear here.
              </p>
            </div>
          )}
        </>
      )}

      {/* Data */}
      {data && data.items.length > 0 && (
        <>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === data.items.length && data.items.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(submission.id)}
                        onCheckedChange={() => toggleSelection(submission.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{submission.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.status === "new"
                            ? "default"
                            : submission.status === "read"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(submission.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(submission.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(submission.id, "read")}
                            disabled={submission.status === "read"}
                          >
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(submission.id, "responded")}
                            disabled={submission.status === "responded"}
                          >
                            Mark as Responded
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSubmissionToDelete(submission.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Single Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => submissionToDelete && handleDelete(submissionToDelete)}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the submission."
      />

      {/* Bulk Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={() => {
          handleBulkDelete();
          setBulkDeleteDialogOpen(false);
        }}
        title={`Delete ${selectedIds.length} Submissions`}
        description={`Are you sure you want to delete ${selectedIds.length} submissions? This action cannot be undone.`}
      />

      {/* Submission Detail Sheet */}
      <SubmissionDetailSheet
        submissionId={selectedSubmissionId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
}
