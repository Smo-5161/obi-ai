export default function ObiBrain({ size = 24 }: { size?: number }) {
  const w = size * 2.2;
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 88 40"
      aria-hidden="true"
      role="img"
      aria-label="Obi"
    >
      <path
        fill="#ff5c00"
        d={[
          "M12 6",
          "Q12 2 16 2",
          "L40 2",
          "Q43 2 44 4.5",
          "Q45 2 48 2",
          "L72 2",
          "Q76 2 76 6",
          "L76 20",
          "Q76 26 70 26",
          "L66 26",
          "Q64 30 60 32",
          "L58 34",
          "Q56 38 52 36",
          "L48 33",
          "Q44 36 40 36",
          "L16 36",
          "Q10 36 10 30",
          "L10 12",
          "Q10 6 12 6",
          "Z",
        ].join(" ")}
      />
      <text
        x="44"
        y="24"
        fontFamily="'Space Grotesk', Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="#14120f"
        textAnchor="middle"
      >
        Obi
      </text>
    </svg>
  );
}
