const AshokaChakra = ({ size = 48 }: { size?: number }) => {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    return (
      <line
        key={i}
        x1={cx}
        y1={cy}
        x2={cx + r * Math.cos(angle)}
        y2={cy + r * Math.sin(angle)}
        stroke="#1a237e"
        strokeWidth={1.5}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="none" stroke="#1a237e" strokeWidth={2} />
      <circle cx={size/2} cy={size/2} r={size*0.12} fill="#1a237e" />
      {spokes}
    </svg>
  );
};

export default AshokaChakra;
