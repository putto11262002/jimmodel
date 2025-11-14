"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface Column<TData> {
  id: string;
  header: ReactNode | ((props: {
    isAllSelected: boolean;
    isSomeSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    sortDirection?: SortDirection;
    onSort?: () => void;
  }) => ReactNode);
  cell: (row: TData, index: number) => ReactNode;
  enableSorting?: boolean;
  sortingFn?: (a: TData, b: TData) => number;
}

interface DataTableProps<TData> {
  columns: Column<TData>[];
  data: TData[];
  // Selection state
  selectedRows?: Set<number>;
  onRowSelect?: (index: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

export function DataTable<TData>({
  columns,
  data,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
}: DataTableProps<TData>) {
  const [sortColumnId, setSortColumnId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < data.length;

  // Handle sort toggle
  const handleSort = (columnId: string) => {
    if (sortColumnId === columnId) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumnId(null);
      }
    } else {
      setSortColumnId(columnId);
      setSortDirection("asc");
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumnId || !sortDirection) {
      return data;
    }

    const column = columns.find((col) => col.id === sortColumnId);
    if (!column || !column.sortingFn) {
      return data;
    }

    const sorted = [...data].sort(column.sortingFn);
    return sortDirection === "desc" ? sorted.reverse() : sorted;
  }, [data, sortColumnId, sortDirection, columns]);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>
                {typeof column.header === "function"
                  ? column.header({
                      isAllSelected,
                      isSomeSelected,
                      onSelectAll: (checked) => onSelectAll?.(checked),
                      sortDirection: sortColumnId === column.id ? sortDirection : null,
                      onSort: column.enableSorting
                        ? () => handleSort(column.id)
                        : undefined,
                    })
                  : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => (
              <TableRow
                key={index}
                data-state={selectedRows.has(index) ? "selected" : undefined}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.cell(row, index)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
