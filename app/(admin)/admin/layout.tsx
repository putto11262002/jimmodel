import { Suspense } from "react";
import Providers from "./_providers";

export default function AdminSlotLayout({
  header,
  content,
}: {
  header: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Providers>
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
    </Providers>
  );
}
