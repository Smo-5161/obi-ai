interface OmiBadgeProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function OmiBadge({ size = "sm", className = "" }: OmiBadgeProps) {
  const text = size === "lg" ? "text-5xl md:text-6xl" : "text-sm";
  const pad = size === "lg" ? "px-3 py-1.5 md:px-4 md:py-2" : "px-2 py-1";
  const eye = size === "lg" ? "text-[0.22em]" : "text-[0.3em]";
  return (
    <span
      className={`relative inline-flex items-center rounded-none border-2 border-ink bg-accent ${pad} ${text} font-bold text-background shadow-[2px_2px_0_0_var(--ink)] ${className}`}
    >
      <span className="relative inline-block">
        O
        <span
          className={`absolute ${eye} font-bold leading-none tracking-[0.32em] text-background`}
          style={{
            left: "0.135em",
            top: "0.235em",
          }}
          aria-hidden="true"
        >
          ••
        </span>
      </span>
      mi
    </span>
  );
}
