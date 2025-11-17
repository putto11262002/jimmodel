"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

/**
 * Admin root layout
 * Provides QueryClient for all admin routes (both auth and admin)
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {children}
    </QueryClientProvider>
  );
}
