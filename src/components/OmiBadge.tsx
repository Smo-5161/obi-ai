interface OmiBadgeProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function OmiBadge({ size = "sm", className = "" }: OmiBadgeProps) {
  const text = size === "lg" ? "text-5xl md:text-6xl" : "text-sm";
  const pad = size === "lg" ? "px-3 py-1.5 md:px-4 md:py-2" : "px-2 py-1";
  const eye = size === "lg" ? "text-[0.19em]" : "text-[0.26em]";
  return (
    <span
      className={`relative inline-flex items-center rounded-none border-2 border-ink bg-accent ${pad} ${text} font-bold text-background shadow-[2px_2px_0_0_var(--ink)] ${className}`}
    >
      <span className="relative inline-block leading-none">
        <span aria-hidden="true">O</span>
        {/* Yeux : centrés horizontalement sur le O, dans sa boucle.
            left 50% + translateX(-50%) = centrage horizontal exact du O.
            top ~46% = à l'intérieur de la boucle (le O crème a un creux au centre). */}
        <span
          className={`absolute ${eye} font-bold leading-none text-background`}
          style={{
            left: "31%",
            top: "50%",
            transform: "translate(-50%, -42%)",
            letterSpacing: "0.3em",
            whiteSpace: "nowrap",
          }}
          aria-hidden="true"
        >
          ••
        </span>
        <span aria-hidden="true">mi</span>
      </span>
    </span>
  );
}
