import { redirect } from "next/navigation";

interface EditModelPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditModelPage({ params }: EditModelPageProps) {
  const { id } = await params;

  // Redirect to the basic-info section by default
  redirect(`/admin/models/${id}/basic-info`);
}
