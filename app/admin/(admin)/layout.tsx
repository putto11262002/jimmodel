"use client";

import { Toaster } from "@/components/ui/sonner";
import { useSession } from "@/hooks/queries/auth/use-session";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AdminSidebar } from "./_components/admin-sidebar";
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
      router.push("/admin/signin");
    }
  }, [data, isPending, router]);

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

export default function AdminLayout({
  header,
  content,
}: {
  header: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CreateModelDialogProvider>
        <div className="flex h-screen">
          <Suspense>
            <AdminSidebar />
          </Suspense>
          <div className="flex-1 flex flex-col bg-background">
            <header className="sticky top-0 z-10 border-b bg-background">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
                {header}
              </div>
            </header>
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
                <Suspense>{content}</Suspense>
              </div>
            </main>
          </div>
          <Toaster position="top-right" />
        </div>
      </CreateModelDialogProvider>
    </AuthGuard>
  );
}
