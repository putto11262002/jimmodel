import type { Category } from "@/lib/data/categories";
import { CATEGORIES } from "@/lib/data/categories";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  "use cache";
  const { category } = await params;

  // Validate category
  if (!CATEGORIES.includes(category as Category)) {
    notFound();
  }

  // Redirect to page 1
  redirect(`/models/${category}/1`);
}
