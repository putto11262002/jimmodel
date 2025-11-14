"use client";

import { updateModelSchema } from "@/actions/models/validator";
import { ArrayInput } from "@/components/array-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModel } from "@/hooks/queries/models/use-model";
import { useUpdateModel } from "@/hooks/queries/models/use-update-model";
import { apiClient } from "@/lib/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InferRequestType, InferResponseType } from "hono/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ModelFormSkeleton } from "../_components/model-form-skeleton";

interface CareerPageProps {
  params: Promise<{ id: string }>;
}

type UpdateModelInput = InferRequestType<
  (typeof apiClient.api.models)[":id"]["$put"]
>["json"];

type Model = InferResponseType<
  (typeof apiClient.api.models)[":id"]["$get"],
  200
>;

interface CareerDetailsFormProps {
  initialData: Model;
}

function CareerDetailsForm({ initialData }: CareerDetailsFormProps) {
  const router = useRouter();
  const updateModel = useUpdateModel();

  const form = useForm<UpdateModelInput>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      talents: initialData.talents || [],
      experiences: initialData.experiences || [],
    },
  });

  const onSubmit = async (data: UpdateModelInput) => {
    updateModel.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          toast.success("Career details updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Career Details</CardTitle>
            <CardDescription>
              Update the model&apos;s talents and professional experiences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="talents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Talents</FormLabel>
                  <FormControl>
                    <ArrayInput
                      values={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add a talent"
                    />
                  </FormControl>
                  <FormDescription>
                    Add talents one by one (e.g., Acting, Dancing, Singing)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experiences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiences</FormLabel>
                  <FormControl>
                    <ArrayInput
                      values={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add an experience"
                    />
                  </FormControl>
                  <FormDescription>
                    Add experiences one by one (e.g., TV Commercial for Brand X)
                  </FormDescription>
                  <FormMessage />
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
              {updateModel.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default function CareerPage({ params }: CareerPageProps) {
  const { id } = use(params);
  const { data: model, isLoading, error } = useModel(id);

  if (isLoading || !model) {
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

  return <CareerDetailsForm initialData={model} />;
}
