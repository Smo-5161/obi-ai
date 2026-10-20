import { Suspense } from "react";
import BrainClient from "./BrainClient";

export default function BrainPage() {
  return (
    <Suspense fallback={<p className="text-slate-400">Chargement du Brain…</p>}>
      <BrainClient />
    </Suspense>
  );
}
