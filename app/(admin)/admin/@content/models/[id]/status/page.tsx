"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { useModel } from "@/hooks/queries/models/use-model";
import { ModelFormSkeleton } from "../_components/model-form-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateModel } from "@/hooks/queries/models/use-update-model";
import { updateModelSchema } from "@/actions/models/validator";
import { CATEGORIES } from "@/lib/data/categories";
import type { InferRequestType, InferResponseType } from "hono/client";
import { apiClient } from "@/lib/api/client";

interface StatusPageProps {
  params: Promise<{ id: string }>;
}

type UpdateModelInput = InferRequestType<typeof apiClient.api.models[":id"]["$put"]>["json"];
type Model = InferResponseType<typeof apiClient.api.models[":id"]["$get"], 200>;

interface StatusPublicationFormProps {
  initialData: Model;
}

function StatusPublicationForm({ initialData }: StatusPublicationFormProps) {
  const router = useRouter();
  const updateModel = useUpdateModel();

  const form = useForm<UpdateModelInput>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      category: initialData.category ?? undefined,
      local: initialData.local ?? false,
      inTown: initialData.inTown ?? false,
      published: initialData.published ?? false,
    },
  });

  // Watch the local field to conditionally enable/disable inTown
  const isLocal = form.watch("local");

  const onSubmit = async (data: UpdateModelInput) => {
    updateModel.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          toast.success("Status and publication settings updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Status & Publication</CardTitle>
            <CardDescription>Manage the model&apos;s availability and visibility settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Display Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Auto-computed (or select to override)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Leave empty to auto-compute based on age and gender. Override to set a custom category for public site display.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // Reset inTown to false when local is true
                          if (checked) {
                            form.setValue("inTown", false);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Local Model</FormLabel>
                      <FormDescription>
                        Mark if the model is a local talent
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

{!isLocal && (
                <FormField
                  control={form.control}
                  name="inTown"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Currently in Town</FormLabel>
                        <FormDescription>
                          Mark if the model is currently available in town
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
                        Publish this model to make it visible publicly
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/models")}
              disabled={updateModel.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateModel.isPending}>
              {updateModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default function StatusPage({ params }: StatusPageProps) {
  const { id } = use(params);
  const { data: model, isLoading, error } = useModel(id);

  if (isLoading) {
    return <ModelFormSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!model) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Model not found</AlertDescription>
      </Alert>
    );
  }

  return <StatusPublicationForm initialData={model} />;
}
