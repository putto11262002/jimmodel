"use client";

import { useSession } from "@/hooks/queries/auth/use-session";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { CreateModelDialogProvider } from "./@header/models/_components/create-model-dialog";

/**
 * Client-side authentication guard
 * Checks session and redirects to signin if not authenticated
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!data?.session && !isPending) {
      router.push("/signin");
    }
  }, [data]);

  // Show loading state during session check
  if (isPending || !data) {
    return (
      <div className="flex h-screen w-screen fixed top-0 left-0 z-10 items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <ShieldCheck className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Verifying access</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: true,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <CreateModelDialogProvider>{children}</CreateModelDialogProvider>
      </AuthGuard>
    </QueryClientProvider>
  );
}
