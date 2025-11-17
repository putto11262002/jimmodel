"use client";

import { use } from "react";
import { EditModelSidebar } from "./_components/edit-model-sidebar";

interface EditModelLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function EditModelLayout({
  children,
  params,
}: EditModelLayoutProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <EditModelSidebar modelId={id} />

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
