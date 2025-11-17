"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useModel } from "@/hooks/queries/models/use-model";
import { useRevalidateModelProfile } from "@/hooks/queries/models/use-revalidate-model-profile";
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
  const updateModel = useUpdateModel();
  const revalidateProfile = useRevalidateModelProfile();

  // Publication settings form
  const publicationForm = useForm<UpdateModelInput>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      category: initialData.category ?? undefined,
      published: initialData.published ?? false,
    },
  });

  // Availability settings form
  const availabilityForm = useForm<UpdateModelInput>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      local: initialData.local ?? false,
      inTown: initialData.inTown ?? false,
    },
  });

  // Watch the local field to conditionally enable/disable inTown
  const isLocal = availabilityForm.watch("local");

  const onSubmitPublication = async (data: UpdateModelInput) => {
    updateModel.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          toast.success("Publication settings updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const onSubmitAvailability = async (data: UpdateModelInput) => {
    updateModel.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          toast.success("Availability settings updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRevalidate = () => {
    revalidateProfile.mutate(
      { id: initialData.id },
      {
        onSuccess: () => {
          toast.success("Model profile cache revalidated");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Publication Settings Card */}
      <Form {...publicationForm}>
        <form onSubmit={publicationForm.handleSubmit(onSubmitPublication)}>
          <Card>
            <CardHeader>
              <CardTitle>Publication Settings</CardTitle>
              <CardDescription>
                Control the model&apos;s visibility and public display category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={publicationForm.control}
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

              <FormField
                control={publicationForm.control}
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
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={updateModel.isPending}>
                {updateModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Publication Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Availability Settings Card */}
      <Form {...availabilityForm}>
        <form onSubmit={availabilityForm.handleSubmit(onSubmitAvailability)}>
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>
                Set the model&apos;s location and availability status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={availabilityForm.control}
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
                            availabilityForm.setValue("inTown", false);
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
                  control={availabilityForm.control}
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
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={updateModel.isPending}>
                {updateModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Availability Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Cache Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>
            Manage the public site cache for this model&apos;s profile page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Revalidate Public Profile Cache
              </p>
              <p className="text-sm text-muted-foreground">
                Trigger a background cache revalidation for this model&apos;s public profile page. Use this after making changes to ensure visitors see the latest content.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleRevalidate}
              disabled={revalidateProfile.isPending}
            >
              {revalidateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revalidating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Revalidate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
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
