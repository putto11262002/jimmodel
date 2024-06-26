import { zodResolver } from "@hookform/resolvers/zod";
import { StaffRole } from "@jimmodel/shared";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Alert, AlertDescription } from "../../ui/alert";
import { useGetStaff } from "../../../hooks/staff/use-get-staff";
import { useUpdateStaff } from "../../../hooks/staff/use-update-staff";

type UpdateStaffProfileFormProps = {
 staffId: string
};

const UpdateStaffProfileFormSchema = z.object({
  firstName: z.string().min(1, "first name is required"),
  lastName: z.string().min(1, "last name is required"),
  role: z.nativeEnum(StaffRole, { required_error: "staff role is required" }),
  color: z.string(),
});

export default function UpdateStaffProfileForm({
  staffId,

}: UpdateStaffProfileFormProps) {
  const { staff } = useGetStaff({ staffId });
 
  const form = useForm<z.infer<typeof UpdateStaffProfileFormSchema>>({
    resolver: zodResolver(UpdateStaffProfileFormSchema),
    defaultValues: staff,
  });

  const {update, error, status} = useUpdateStaff()
  
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-2"
        onSubmit={form.handleSubmit((data) => update({payload: data, id: staffId}))}
      >
        <div className="col-span-2">
        {error && (
          <Alert variant="destructive" className="my-3">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        </div>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(StaffRole).map((role) => (
                    <SelectItem value={role} key={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-2 col-span-2">
          <Button disabled={status === "pending"} type="submit">Update Profile</Button>
        </div>
      </form>
    </Form>
  );
}
