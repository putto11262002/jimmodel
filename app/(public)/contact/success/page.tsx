import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";

export default function ContactSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-2.5 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          Message Sent Successfully!
        </h1>

        <p className="mb-8 text-muted-foreground">
          We've received your message and will get back to you as soon as possible.
        </p>

        <Button asChild variant="link">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
