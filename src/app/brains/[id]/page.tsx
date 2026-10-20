import { Suspense } from "react";
import BrainClient from "./BrainClient";

export const dynamic = "force-dynamic";

export default async function BrainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-slate-400">Chargement du Brain…</p>}>
      <BrainClient brainId={id} />
    </Suspense>
  );
}
