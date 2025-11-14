"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCreateModel } from "@/hooks/queries/models/use-create-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createModelFormSchema,
  type CreateModelFormInput,
} from "../_validators";

interface CreateModelDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateModelDialogContext = createContext<
  CreateModelDialogContextValue | undefined
>(undefined);

export function CreateModelDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const createModel = useCreateModel();

  const form = useForm<CreateModelFormInput>({
    resolver: zodResolver(createModelFormSchema),
    defaultValues: {
      name: "",
      gender: "male",
    },
  });

  const onSubmit = (data: CreateModelFormInput) => {
    createModel.mutate(data, {
      onSuccess: (result) => {
        toast.success("Model created successfully");
        form.reset();
        setOpen(false);
        router.push(`/admin/models/${result.id}/basic-info`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <CreateModelDialogContext.Provider value={{ open, setOpen }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Create New Model</DialogTitle>
                <DialogDescription>
                  Enter the model name and gender to create a new profile. You
                  can add more details after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter model name"
                          {...field}
                          disabled={createModel.isPending}
                          autoFocus
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
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={createModel.isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-Binary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createModel.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createModel.isPending}>
                  {createModel.isPending ? "Creating..." : "Create Model"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </CreateModelDialogContext.Provider>
  );
}

export function useCreateModelDialog() {
  const context = useContext(CreateModelDialogContext);
  if (!context) {
    throw new Error(
      "useCreateModelDialog must be used within CreateModelDialogProvider"
    );
  }
  return context;
}
