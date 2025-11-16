import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { AdminSidebar } from "./admin/_components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Suspense>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col bg-background">{children}</div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
