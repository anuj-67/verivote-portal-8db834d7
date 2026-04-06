const FingerprintSVG = ({ color = '#9ca3af', size = 80 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <path d="M40 10 C20 10 12 25 12 40 C12 55 20 70 40 70" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round"/>
    <path d="M40 10 C60 10 68 25 68 40 C68 55 60 70 40 70" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round"/>
    <path d="M40 18 C25 18 19 30 19 40 C19 50 25 62 40 62" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M40 18 C55 18 61 30 61 40 C61 50 55 62 40 62" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round"/>
    <path d="M40 26 C30 26 26 33 26 40 C26 47 30 54 40 54" stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round"/>
    <path d="M40 26 C50 26 54 33 54 40 C54 47 50 54 40 54" stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round"/>
    <path d="M40 33 C35 33 32 36 32 40 C32 44 35 47 40 47" stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round"/>
    <path d="M40 33 C45 33 48 36 48 40 C48 44 45 47 40 47" stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round"/>
    <circle cx={40} cy={40} r={2} fill={color}/>
  </svg>
);

export default FingerprintSVG;
