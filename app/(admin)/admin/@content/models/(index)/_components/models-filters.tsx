"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/data/categories";
import { useForm } from "react-hook-form";
import z from "zod";

// Filter form schema (allows "all" in addition to category values)
const filterFormSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  published: z.boolean().optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

interface ModelsFiltersProps {
  filters: {
    search?: string;
    category?: string;
    published?: boolean;
  };
  onFiltersChange: (filters: {
    search?: string;
    category?: string;
    published?: boolean;
  }) => void;
}

export function ModelsFilters({
  filters,
  onFiltersChange,
}: ModelsFiltersProps) {
  // Form for filters
  const form = useForm<FilterFormValues>({
    values: {
      search: filters.search,
      category: filters.category || "all",
      published: filters.published,
    },
  });

  // Watch form changes and update filters
  const formValues = form.watch();

  // Update filters when form changes
  const handleFilterChange = () => {
    onFiltersChange({
      search: formValues.search || undefined,
      category:
        formValues.category && formValues.category !== "all"
          ? formValues.category
          : undefined,
      published: formValues.published,
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-1 gap-2"
        onChange={handleFilterChange}
        onSubmit={(e) => e.preventDefault()}
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Search</FormLabel>
              <FormControl>
                <Input
                  placeholder="Search by name..."
                  className="max-w-sm"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Status</FormLabel>
              <Select
                value={field.value === undefined ? "all" : String(field.value)}
                onValueChange={(val) =>
                  field.onChange(val === "all" ? undefined : val)
                }
              >
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Unpublished</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
