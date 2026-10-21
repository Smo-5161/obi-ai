import { Suspense } from "react";
import BrainClient from "./BrainClient";

export default function BrainPage() {
  return (
    <Suspense fallback={<p className="text-muted">Chargement du Brain…</p>}>
      <BrainClient />
    </Suspense>
  );
}
