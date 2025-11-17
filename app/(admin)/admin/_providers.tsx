"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { CreateModelDialogProvider } from "./@header/models/_components/create-model-dialog";
import { useSession } from "@/hooks/queries/auth/use-session";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Client-side authentication guard
 * Checks session and redirects to signin if not authenticated
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();
  const router = useRouter();

  // Show loading state during session check
  if (isPending || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!data.session || !data.user) {
    router.push("/signin");
    return null;
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
