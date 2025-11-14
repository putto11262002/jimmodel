"use client";

import { updateModelSchema } from "@/actions/models/validator";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModel } from "@/hooks/queries/models/use-model";
import { useUpdateModel } from "@/hooks/queries/models/use-update-model";
import { apiClient } from "@/lib/api/client";
import { EYE_COLORS } from "@/lib/data/eye-colors";
import { HAIR_COLORS } from "@/lib/data/hair-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InferRequestType, InferResponseType } from "hono/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ModelFormSkeleton } from "../_components/model-form-skeleton";

interface PhysicalPageProps {
  params: Promise<{ id: string }>;
}

type UpdateModelInput = InferRequestType<
  (typeof apiClient.api.models)[":id"]["$put"]
>["json"];
type Model = InferResponseType<
  (typeof apiClient.api.models)[":id"]["$get"],
  200
>;

interface PhysicalAttributesFormProps {
  initialData: Model;
}

function PhysicalAttributesForm({ initialData }: PhysicalAttributesFormProps) {
  const router = useRouter();
  const updateModel = useUpdateModel();

  const form = useForm<UpdateModelInput>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      height: initialData.height ?? undefined,
      weight: initialData.weight ?? undefined,
      hips: initialData.hips ?? undefined,
      hairColor: initialData.hairColor ?? undefined,
      eyeColor: initialData.eyeColor ?? undefined,
    },
  });

  const onSubmit = async (data: UpdateModelInput) => {
    updateModel.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          toast.success("Physical attributes updated successfully");
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
            <CardTitle>Physical Attributes</CardTitle>
            <CardDescription>
              Update the model&apos;s physical measurements and characteristics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 175"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        value={typeof field.value === 'number' ? field.value : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 65"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        value={typeof field.value === 'number' ? field.value : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hips (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 90"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        value={typeof field.value === 'number' ? field.value : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hairColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hair Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {HAIR_COLORS.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eyeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eye Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select eye color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EYE_COLORS.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default function PhysicalPage({ params }: PhysicalPageProps) {
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

  return <PhysicalAttributesForm initialData={model} />;
}
