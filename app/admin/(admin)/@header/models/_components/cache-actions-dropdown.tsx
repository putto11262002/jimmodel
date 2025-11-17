"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRevalidateAllModels } from "@/hooks/queries/models/use-revalidate-all-models";
import { useRevalidateAllProfiles } from "@/hooks/queries/models/use-revalidate-all-profiles";
import { useRevalidateModelListing } from "@/hooks/queries/models/use-revalidate-model-listing";
import { Database, List, Loader2, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";

export function CacheActionsDropdown() {
  const revalidateListing = useRevalidateModelListing();
  const revalidateAllProfiles = useRevalidateAllProfiles();
  const revalidateAll = useRevalidateAllModels();

  const isPending =
    revalidateListing.isPending ||
    revalidateAllProfiles.isPending ||
    revalidateAll.isPending;

  const handleRevalidateListing = () => {
    revalidateListing.mutate(undefined, {
      onSuccess: () => {
        toast.success("Model listing cache revalidated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleRevalidateAllProfiles = () => {
    revalidateAllProfiles.mutate(undefined, {
      onSuccess: () => {
        toast.success("All model profile caches revalidated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleRevalidateAll = () => {
    revalidateAll.mutate(undefined, {
      onSuccess: () => {
        toast.success("All model caches revalidated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={handleRevalidateListing} disabled={isPending}>
          <List className="mr-2 h-4 w-4" />
          Revalidate Listing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRevalidateAllProfiles} disabled={isPending}>
          <Users className="mr-2 h-4 w-4" />
          Revalidate All Profiles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRevalidateAll} disabled={isPending}>
          <Database className="mr-2 h-4 w-4" />
          Revalidate All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
