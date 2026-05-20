import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedCounter = ({ value, className, style }: Props) => {
  const [displayed, setDisplayed] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    const start = prev.current;
    const end = value;
    const duration = 800;
    const startTime = Date.now();
    let raf: number;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    prev.current = value;
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={className} style={style}>{displayed.toLocaleString()}</span>;
};

export default AnimatedCounter;
