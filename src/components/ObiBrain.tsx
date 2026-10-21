const PIXELS: string[] = [
  "....oo....oo....",
  "...oobo..oboo...",
  "..obbbboobbbbo..",
  ".obbbbbbbbbbbbo.",
  "obbbbbbbbbbbbbbo",
  "obbbbbbbbbbbbbbo",
  "obbobbbbbbobbbbo",
  "obbbbbbbbbbbbbbo",
  ".obbbbbbbbbbbbo.",
  "..oobbbbbbbboo..",
  "...oobbbbbboo...",
  "....obbbbbbo....",
  ".....obbbbo.....",
  "......obbo......",
  ".......oo.......",
];

export default function ObiBrain({ size = 24 }: { size?: number }) {
  const cols = PIXELS[0].length;
  const rows = PIXELS.length;
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size * (cols / rows), height: size }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${cols} ${rows}`}
        aria-hidden="true"
        style={{ imageRendering: "pixelated", position: "absolute", inset: 0 }}
      >
        {PIXELS.map((row, y) =>
          row.split("").map((c, x) =>
            c === "." ? null : (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={c === "o" ? "#e04e00" : "#ff5c00"}
              />
            ),
          ),
        )}
      </svg>
      <span
        style={{
          fontSize: size * 0.28,
          lineHeight: 1,
          color: "#14120f",
          fontWeight: 700,
          fontFamily: "'Space Grotesk', Arial, sans-serif",
          position: "relative",
        }}
      >
        Obi
      </span>
    </span>
  );
}
