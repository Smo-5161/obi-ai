const PIXELS: string[] = [
  "..o....o..",
  ".ooo..ooo.",
  "oOBBOOBBOo",
  "oBBBBBBBBo",
  "OBBOBBOBBO",
  "oBBBBBBBBo",
  "oBBoBBoBBo",
  ".oBBOOBBo.",
  "..oooooo..",
];

const FILL: Record<string, string> = {
  ".": "transparent",
  o: "#c24800",
  O: "#e04e00",
  B: "#ff5c00",
};

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
            FILL[c] === "transparent" ? null : (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={FILL[c]} />
            ),
          ),
        )}
      </svg>
      <span
        style={{
          fontSize: size * 0.3,
          lineHeight: 1,
          color: "#14120f",
          fontWeight: 700,
          fontFamily: "'Press Start 2P', 'Space Grotesk', Arial, sans-serif",
          position: "relative",
          letterSpacing: "-0.02em",
        }}
      >
        Obi
      </span>
    </span>
  );
}
