import { NextRequest, NextResponse } from "next/server";
import { loadDb } from "@/lib/store";
import { brainCoverage } from "@/lib/pipeline";

export async function GET(req: NextRequest) {
  const db = await loadDb();
  const brainId = req.nextUrl.searchParams.get("brainId");
  const brains = brainId ? db.brains.filter((b) => b.id === brainId) : db.brains;

  const report = brains.map((brain) => {
    const sops = Object.values(db.sops).filter((s) => s.brainId === brain.id);
    const recordings = Object.values(db.recordings).filter((r) => r.brainId === brain.id);
    const freq = { daily: 0, weekly: 0, monthly: 0, adhoc: 0 };
    for (const s of sops) freq[s.frequency]++;
    const scheduled = freq.daily + freq.weekly + freq.monthly;
    const perDay = scheduled ? Math.round((freq.daily / scheduled) * 100) : 0;
    const perWeek = scheduled ? Math.round((freq.weekly / scheduled) * 100) : 0;
    const progress = Object.values(db.progress).filter((p) => p.brainId === brain.id);
    const onboardingVelocity = progress.length
      ? Math.round(
          (progress.reduce((a, p) => a + p.completedSopIds.length, 0) / (progress.length * Math.max(sops.length, 1))) * 100,
        )
      : 0;
    const blockingTopics = progress
      .flatMap((p) => Object.entries(p.blockingTopics))
      .reduce<Record<string, number>>((acc, [k, v]) => {
        acc[k] = (acc[k] || 0) + v;
        return acc;
      }, {});
    return {
      brainId: brain.id,
      name: brain.name,
      coverageScore: brainCoverage(db, brain),
      sopCount: sops.length,
      recordingCount: recordings.length,
      maskedItems: recordings.reduce((a, r) => a + r.sensitiveMasked, 0),
      frequencySplit: freq,
      dailySharePercent: perDay,
      weeklySharePercent: perWeek,
      onboardingVelocityPercent: Math.min(onboardingVelocity, 100),
      askedQuestions: progress.reduce((a, p) => a + p.askedQuestions, 0),
      blockingTopics,
    };
  });

  return NextResponse.json(report);
}
