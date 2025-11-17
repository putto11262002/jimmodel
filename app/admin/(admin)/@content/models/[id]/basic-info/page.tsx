"use client";

import { updateModelSchema } from "@/actions/models/validator";
import { DatePicker } from "@/components/date-picker";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useModel } from "@/hooks/queries/models/use-model";
import { useUpdateModel } from "@/hooks/queries/models/use-update-model";
import { apiClient } from "@/lib/api/client";
import { COUNTRIES } from "@/lib/data/countries";
import { GENDERS } from "@/lib/data/genders";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InferRequestType, InferResponseType } from "hono/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ModelFormSkeleton } from "../_components/model-form-skeleton";

interface BasicInfoPageProps {
  params: Promise<{ id: string }>;
}

type UpdateModelInput = InferRequestType<
  (typeof apiClient.api.models)[":id"]["$put"]
>["json"];

type Model = InferResponseType<
  (typeof apiClient.api.models)[":id"]["$get"],
  200
>;

interface BasicInfoFormProps {
  initialData: Model;
}

function BasicInfoForm({ initialData }: BasicInfoFormProps) {
  const router = useRouter();
  const updateModel = useUpdateModel();

  const form = useForm<UpdateModelInput>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      name: initialData.name || "",
      nickName: initialData.nickName ?? undefined,
      gender: initialData.gender || "male",
      dateOfBirth: initialData.dateOfBirth ? (typeof initialData.dateOfBirth === 'string' ? new Date(initialData.dateOfBirth) : initialData.dateOfBirth) : undefined,
      nationality: initialData.nationality ?? undefined,
      ethnicity: initialData.ethnicity ?? undefined,
      bio: initialData.bio ?? undefined,
    },
  });

  const onSubmit = async (data: UpdateModelInput) => {
    updateModel.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          toast.success("Basic information updated successfully");
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
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the model&apos;s basic information and bio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter nickname (optional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <DatePicker
                    date={
                      field.value instanceof Date
                        ? field.value
                        : typeof field.value === 'string'
                        ? new Date(field.value)
                        : typeof field.value === 'number'
                        ? new Date(field.value)
                        : undefined
                    }
                    onSelect={(date) => field.onChange(date)}
                  />
                  <FormDescription>
                    Category will be auto-computed based on age
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
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
              name="ethnicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ethnicity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter ethnicity (optional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter bio (optional)"
                      rows={4}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
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

export default function BasicInfoPage({ params }: BasicInfoPageProps) {
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

  return <BasicInfoForm initialData={model} />;
}
