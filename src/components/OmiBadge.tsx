interface OmiBadgeProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function OmiBadge({ size = "sm", className = "" }: OmiBadgeProps) {
  const text = size === "lg" ? "text-5xl md:text-6xl" : "text-sm";
  const pad = size === "lg" ? "px-3 py-1.5 md:px-4 md:py-2" : "px-2 py-1";
  return (
    <span
      className={`inline-flex items-center rounded-none border-2 border-ink bg-accent ${pad} ${text} font-bold text-background shadow-[2px_2px_0_0_var(--ink)] ${className}`}
    >
      Omi
    </span>
  );
}
