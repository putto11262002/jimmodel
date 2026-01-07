"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column } from "@/components/data-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Model type (matches the data from useModels)
export type Model = {
  id: string;
  name: string;
  category: string;
  dateOfBirth: string | null;
  published: boolean;
  profileImageURL: string | null;
  local: boolean;
  inTown: boolean;
};


export type ColumnActions = {
  onTogglePublished: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
};

export type SelectionCallbacks = {
  isSelected: (index: number) => boolean;
  onSelectRow: (index: number, checked: boolean) => void;
};

export const createColumns = (
  actions: ColumnActions,
  selection: SelectionCallbacks
): Column<Model>[] => [
  {
    id: "select",
    header: ({ isAllSelected, isSomeSelected, onSelectAll }) => (
      <Checkbox
        checked={isAllSelected || (isSomeSelected && "indeterminate")}
        onCheckedChange={onSelectAll}
        aria-label="Select all"
      />
    ),
    cell: (model, index) => (
      <Checkbox
        checked={selection.isSelected(index)}
        onCheckedChange={(checked) => selection.onSelectRow(index, !!checked)}
        aria-label="Select row"
      />
    ),
  },
  {
    id: "profileImageURL",
    header: "Image",
    cell: (model) => {
      return model.profileImageURL ? (
        <Image
          src={model.profileImageURL}
          alt={model.name}
          width={40}
          height={40}
          className="rounded-md object-cover w-10 h-10 object-top"
        />
      ) : (
        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            {model.name.charAt(0)}
          </span>
        </div>
      );
    },
  },
  {
    id: "name",
    header: ({ sortDirection, onSort }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={onSort}
        className="hover:bg-transparent"
      >
        Name
        {sortDirection === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : sortDirection === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: (model) => <div className="font-medium">{model.name}</div>,
    enableSorting: true,
    sortingFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    id: "category",
    header: ({ sortDirection, onSort }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={onSort}
        className="hover:bg-transparent"
      >
        Category
        {sortDirection === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : sortDirection === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: (model) => {
      return (
        <Badge variant="secondary">
          {model.category.charAt(0).toUpperCase() + model.category.slice(1)}
        </Badge>
      );
    },
    enableSorting: true,
    sortingFn: (a, b) => a.category.localeCompare(b.category),
  },
  {
    id: "local",
    header: "Local",
    cell: (model) => {
      return (
        <Badge variant={model.local ? "default" : "secondary"}>
          {model.local ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    id: "inTown",
    header: "In Town",
    cell: (model) => {
      return (
        <Badge variant={model.inTown ? "default" : "secondary"}>
          {model.inTown ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    id: "published",
    header: ({ sortDirection, onSort }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={onSort}
        className="hover:bg-transparent"
      >
        Status
        {sortDirection === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : sortDirection === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: (model) => {
      return (
        <Badge
          variant={model.published ? "default" : "secondary"}
          className={
            model.published ? "bg-primary/10 text-primary border-primary/20" : ""
          }
        >
          {model.published ? "Published" : "Draft"}
        </Badge>
      );
    },
    enableSorting: true,
    sortingFn: (a, b) => (a.published === b.published ? 0 : a.published ? -1 : 1),
  },
  {
    id: "actions",
    header: <div className="text-right">Actions</div>,
    cell: (model) => {
      return (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/models/${model.id}/basic-info`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => actions.onTogglePublished(model.id, model.published)}
              >
                {model.published ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => actions.onDelete(model.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
