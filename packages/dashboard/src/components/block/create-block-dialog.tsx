import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BlockCreateInput } from "@jimmodel/shared";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLabel } from "../ui/form";
import { FormDatePickerField } from "../shared/form/FormDatePickerField";
import { FormInputField } from "../shared/form/FormInputField";
import { AddModelDialog } from "../job/job-model-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { errorInterceptorV2 } from "../../lib/error";
import modelService from "../../services/model";
import { Avatar, AvatarImage } from "../ui/avatar";
import placeholderImage from "@assets/placeholder.jpeg";
import dayjs from "dayjs";
import { FromSelectField } from "../shared/form/FormSelectField";
import blockService from "../../services/block";
import { useToast } from "../ui/use-toast";
import { AppError } from "../../types/app-error";
import { Alert, AlertDescription } from "../ui/alert";
const timeOptions = [
  { label: "10:00", value: "10:00" },
  { label: "11:00", value: "11:00" },
  { label: "12:00", value: "12:00" },
  { label: "13:00", value: "13:00" },
  { label: "14:00", value: "14:00" },
  { label: "15:00", value: "15:00" },
  { label: "16:00", value: "16:00" },
  { label: "17:00", value: "17:00" },
  { label: "18:00", value: "18:00" },
  { label: "19:00", value: "19:00" },
  { label: "20:00", value: "20:00" },
  { label: "21:00", value: "21:00" },
  { label: "22:00", value: "22:00" },
  { label: "23:00", value: "23:00" },
];

const BlockCreateFormSchema = z
  .object({
    startDate: z.date(),
    startTime: z.string(),
    endDate: z.date(),
    endTime: z.string(),
    reason: z.string(),
    models: z
      .array(
        z.object({
          name: z.string(),
          id: z.string(),
          imageUrl: z.string().optional(),
          email: z.string(),
        })
      )
      .min(1, "At least one model is required"),
    dates: z.any(),
  })
  .superRefine((data, ctx) => {
    const start = dayjs(data.startDate)
      .set("hour", parseInt(data.startTime.split(":")[0]))
      .set("minute", parseInt(data.startTime.split(":")[1]));
    const end = dayjs(data.endDate)
      .set("hour", parseInt(data.endTime.split(":")[0]))
      .set("minute", parseInt(data.endTime.split(":")[1]));
    if (end.isBefore(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["dates"],
      });
    }
  });

const FormBlockToBlockCreateInput = z
  .object({
    startDate: z.date(),
    startTime: z.string(),
    endDate: z.date(),
    endTime: z.string(),
    reason: z.string(),
    models: z
      .array(
        z.object({
          name: z.string(),
          id: z.string(),
          imageUrl: z.string().optional(),
          email: z.string(),
        })
      )
      .min(1, "At least one model is required"),
  })
  .transform((data) => {
    return {
      start: dayjs(data.startDate)
        .add(parseInt(data.startTime.split(":")[0]), "hour")
        .add(parseInt(data.startTime.split(":")[1]), "minute")
        .toDate()
        .toISOString(),
      end: dayjs(data.endDate)
        .add(parseInt(data.endTime.split(":")[0]), "hour")
        .add(parseInt(data.endTime.split(":")[1]), "minute")
        .toDate()
        .toISOString(),
      reason: data.reason,
      modelIds: data.models.map((model) => model.id),
    };
  });

export default function CreateBlockDialog() {
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [displayDialog, setDisplayDialog] = useState(false);
  const form = useForm<z.infer<typeof BlockCreateFormSchema>>({
    resolver: zodResolver(BlockCreateFormSchema),
  });

  const modelField = useFieldArray({
    control: form.control,
    name: "models",
    keyName: "_id",
  });

  const { data: searchedModels } = useQuery({
    queryKey: ["models", { q: modelSearchTerm }],
    queryFn: () =>
      errorInterceptorV2(modelService.getAll, { q: modelSearchTerm }),
    enabled: modelSearchTerm !== "",
  });

  const {
    mutate: addBlock,
    isPending: isPendingAddBlock,
    error,
  } = useMutation<unknown, AppError, BlockCreateInput>({
    mutationFn: (input: BlockCreateInput) =>
      errorInterceptorV2(blockService.create, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks", "calendar"] });
      form.reset({ models: [] });
      setDisplayDialog(false);
      toast({
        description: "Block created successfully",
      });
    },
  });

  const unaddedModels = useMemo(() => {
    if (searchedModels?.data && modelField.fields) {
      return searchedModels.data.filter(
        (model) => !modelField.fields.find((m) => m.id === model.id)
      );
    }
    return [];
  }, [searchedModels, modelField.fields]);

  return (
    <Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="w-4 h-4 mr-2" />
          Block
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Block</DialogTitle>
          <DialogDescription>
            Create a block on models on a range of dates
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="my-3">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit((data) =>
              addBlock(FormBlockToBlockCreateInput.parse(data))
            )}
          >
            {form.formState?.errors?.dates && (
              <p className="text-danger text-sm font-medium">
                {form.formState.errors.dates.message?.toString()}
              </p>
            )}
            <FormDatePickerField form={form} name="startDate" />{" "}
            <FromSelectField
              label=""
              name="startTime"
              form={form}
              options={timeOptions}
            />
            <FormDatePickerField
              calendarProps={{}}
              form={form}
              name="endDate"
            />{" "}
            <FromSelectField
              label=""
              name="endTime"
              form={form}
              options={timeOptions}
            />
            <FormInputField form={form} name="reason" />
            <div className="space-y-2 w-full">
              <FormLabel>Models</FormLabel>
              <div className="flex gap-2 flex-col">
                {modelField.fields.map((field, index) => (
                  <div
                    className="py-2 px-3 border rounded-md hover:bg-slate-100 flex items-center"
                    key={field.id}
                  >
                    <Avatar>
                      <AvatarImage src={field.imageUrl || placeholderImage} />
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{field.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {field.email}
                      </p>
                    </div>
                    <Button
                      onClick={() => modelField.remove(index)}
                      className="ml-auto"
                      variant={"ghost"}
                      type="button"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <AddModelDialog
                  onSeachTermChange={(term) => setModelSearchTerm(term)}
                  searchedModels={unaddedModels}
                  onAddModel={(model) =>
                    modelField.append({
                      id: model.id,
                      name: model.name,
                      imageUrl: model?.images?.[0]?.url,
                      email: model.email,
                    })
                  }
                />
              </div>
              {form.formState.errors["models"] && (
                <p className="text-xs font-medium text-danger">
                  {form.formState.errors["models"]?.message}
                </p>
              )}
            </div>
            <div>
              <Button
                disabled={isPendingAddBlock}
                className="mt-2"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
