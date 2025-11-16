"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { useCreateModelDialog } from "./_components/create-model-dialog";
import { CacheActionsDropdown } from "./_components/cache-actions-dropdown";

export default function ModelsHeader() {
  const { setOpen } = useCreateModelDialog();

  return (
    <PageHeader
      title="Models Management"
      description="View, create, and manage model profiles"
      actions={
        <div className="flex items-center gap-2">
          <CacheActionsDropdown />
          <Button onClick={() => setOpen(true)} size="icon" aria-label="Create Model">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      }
    />
  );
}
