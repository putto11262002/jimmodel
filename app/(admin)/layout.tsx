import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { AdminSidebar } from "./admin/_components/admin-sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authorization check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to signin if not authenticated
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="flex h-screen">
      <Suspense>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col bg-background">{children}</div>
      <Toaster position="top-right" />
    </div>
  );
}
