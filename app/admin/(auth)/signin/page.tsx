"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { authClient, useSession } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signinFormSchema, type SigninFormInput } from "./_validators";

type AlertState = {
  type: "error" | "success";
  title: string;
  description: string;
} | null;

export default function SigninPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const form = useForm<SigninFormInput>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect to admin if already authenticated
  useEffect(() => {
    if (session?.user) {
      router.push("/admin");
    }
  }, [session, router]);

  const onSubmit = async (data: SigninFormInput) => {
    setAlert(null); // Clear previous alerts

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setAlert({
            type: "success",
            title: "Welcome back!",
            description: "Redirecting to admin panel...",
          });
        },
        onError: (ctx) => {
          setIsLoading(false);
          const errorMessage = ctx.error.message || "Failed to sign in";

          // Handle specific error cases
          if (errorMessage.toLowerCase().includes("credentials")) {
            setAlert({
              type: "error",
              title: "Invalid credentials",
              description:
                "Please check your email and password and try again.",
            });
          } else if (errorMessage.toLowerCase().includes("rate limit")) {
            setAlert({
              type: "error",
              title: "Too many attempts",
              description: "Please wait a few minutes before trying again.",
            });
          } else {
            setAlert({
              type: "error",
              title: "Sign in failed",
              description: errorMessage,
            });
          }
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {alert && (
                <Alert
                  variant={alert.type === "error" ? "destructive" : "default"}
                >
                  {alert.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                        disabled={isLoading}
                        autoFocus
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      {/* <Link */}
                      {/*   href="/forgot-password" */}
                      {/*   className="text-sm text-muted-foreground hover:text-primary" */}
                      {/*   tabIndex={-1} */}
                      {/* > */}
                      {/*   Forgot password? */}
                      {/* </Link> */}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="current-password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          tabIndex={-1}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter className="flex flex-col space-y-4"> */}
        {/*   <div className="text-sm text-muted-foreground text-center"> */}
        {/*     Don&apos;t have an account?{" "} */}
        {/*     <Link href="/signup" className="text-primary hover:underline"> */}
        {/*       Create an account */}
        {/*     </Link> */}
        {/*   </div> */}
        {/* </CardFooter> */}
      </Card>
    </div>
  );
}
