import { redirect } from "next/navigation";

export default async function BrainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/brains/${id}/manage`);
}
