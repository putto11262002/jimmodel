"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteSubmission } from "@/hooks/queries/form-submissions/use-delete-submission";
import { useFormSubmission } from "@/hooks/queries/form-submissions/use-form-submission";
import { useUpdateSubmissionStatus } from "@/hooks/queries/form-submissions/use-update-submission-status";
import { format } from "date-fns";
import { Mail, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SubmissionDetailSheetProps {
  submissionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionDetailSheet({
  submissionId,
  open,
  onOpenChange,
}: SubmissionDetailSheetProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: submission,
    isPending,
    error,
  } = useFormSubmission(submissionId || "");
  const deleteSubmission = useDeleteSubmission();
  const updateStatus = useUpdateSubmissionStatus();

  const handleStatusUpdate = (status: "new" | "read" | "responded") => {
    if (!submission) return;
    updateStatus.mutate(
      { id: submission.id, status },
      {
        onSuccess: () => {
          toast.success("Status updated");
        },
        onError: (error) => {
          toast.error("Failed to update status", {
            description: error.message,
          });
        },
      },
    );
  };

  const handleDelete = () => {
    if (!submission) return;
    deleteSubmission.mutate(submission.id, {
      onSuccess: () => {
        toast.success("Submission deleted");
        setDeleteDialogOpen(false);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Failed to delete", { description: error.message });
      },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-xl flex flex-col">
          {isPending || !submission ? (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-lg">
                    <Skeleton className="h-6 w-48" />
                  </SheetTitle>
                  <Skeleton className="h-5 w-16" />
                </div>
                <SheetDescription className="mt-1">
                  <Skeleton className="h-4 w-64" />
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4">
                <div className="grid gap-4">
                  {/* Contact Information */}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Name
                      </label>
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </label>
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="grid gap-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Message
                    </label>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions - Fixed at bottom */}
              <div className="border-t px-4 py-4">
                <div className="grid gap-3">
                  <div className="flex gap-2">
                    <Button variant="outline" disabled className="flex-1">
                      Mark as Read
                    </Button>
                    <Button variant="outline" disabled className="flex-1">
                      Mark as Responded
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    disabled
                    className="w-full justify-start"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Submission
                  </Button>
                </div>
              </div>
            </>
          ) : error ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
              <p className="text-destructive">
                Failed to load submission: {error.message}
              </p>
            </div>
          ) : (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-lg">
                    {submission.subject}
                  </SheetTitle>
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
                </div>
                <SheetDescription className="mt-1">
                  Submitted on{" "}
                  {format(
                    new Date(submission.createdAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4">
                <div className="grid gap-4">
                  {/* Contact Information */}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Name
                      </label>
                      <p className="text-sm">{submission.name}</p>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {submission.email}
                      </a>
                    </div>
                    {submission.phone && (
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </label>
                        <a
                          href={`tel:${submission.phone}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {submission.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="grid gap-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Message
                    </label>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {submission.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions - Fixed at bottom */}
              <div className="border-t px-4 py-4">
                <div className="grid gap-3">
                  <div className="flex gap-2">
                    {submission.status !== "read" && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate("read")}
                        disabled={updateStatus.isPending}
                        className="flex-1"
                      >
                        Mark as Read
                      </Button>
                    )}
                    {submission.status !== "responded" && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate("responded")}
                        disabled={updateStatus.isPending}
                        className="flex-1"
                      >
                        Mark as Responded
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={deleteSubmission.isPending}
                    className="w-full justify-start"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Submission
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              submission
              {submission && ` from ${submission.name}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
