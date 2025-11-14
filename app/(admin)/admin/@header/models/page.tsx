"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { useCreateModelDialog } from "./_components/create-model-dialog";

export default function ModelsHeader() {
  const { setOpen } = useCreateModelDialog();

  return (
    <PageHeader
      title="Models Management"
      description="View, create, and manage model profiles"
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Model
        </Button>
      }
    />
  );
}
