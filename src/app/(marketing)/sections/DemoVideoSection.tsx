import FeatureCards from "./FeatureCards";

export function DemoVideoSection() {
  return (
    <section data-section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
        <h2 className="st-item mt-1 text-2xl leading-relaxed tracking-tight text-text-strong">
          Omi en action
        </h2>
        <p
          data-typewriter="Une minute pour comprendre comment Omi capture un processus et guide le successeur, pas à pas."
          className="st-item mx-auto mt-3 min-h-12 max-w-2xl text-foreground"
        >
          Une minute pour comprendre comment Omi capture un processus et guide le successeur,
          pas à pas.
        </p>

        <div className="st-item widget relative mx-auto mt-10 max-w-4xl border-2 border-line bg-paper-raised p-2 shadow-[6px_6px_0_0_var(--line)]">
          <div className="relative aspect-video w-full overflow-hidden bg-ink">
            <video
              className="h-full w-full object-cover"
              controls
              preload="metadata"
              poster="/video-poster.svg"
            >
              <source src="/presentation.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la vidéo.
            </video>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded-none border-2 border-accent bg-background/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                Démo
              </span>
            </div>
          </div>
        </div>

        <FeatureCards />
      </div>
    </section>
  );
}
