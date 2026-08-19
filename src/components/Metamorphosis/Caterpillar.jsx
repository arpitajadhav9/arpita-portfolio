import { useId } from "react";

const SEGS = [
  { dx: 0, dy: 0, r: 24 },
  { dx: -26, dy: 8, r: 22 },
  { dx: -52, dy: 14, r: 21 },
  { dx: -80, dy: 12, r: 20 },
  { dx: -106, dy: 4, r: 19 },
  { dx: -130, dy: 0, r: 18 },
  { dx: -152, dy: 5, r: 17 },
];

const SPOTS = [
  { dx: -34, dy: 2, r: 3.2 },
  { dx: -46, dy: 9, r: 2.3 },
  { dx: -60, dy: 6, r: 3 },
  { dx: -72, dy: 12, r: 2.3 },
  { dx: -86, dy: 8, r: 2.6 },
  { dx: -98, dy: 4, r: 3 },
  { dx: -112, dy: 2, r: 2.4 },
  { dx: -136, dy: -2, r: 2.4 },
  { dx: -155, dy: 3, r: 2.2 },
];

function CaterpillarBody({ pose = "rest", className = "", ...rest }) {
  const raw = useId();
  const uid = raw.replace(/:/g, "");
  const bodyGrad = `metaBody-${uid}`;
  const headGrad = `metaHead-${uid}`;
  const shadowGrad = `metaShadow-${uid}`;

  return (
    <g className={`caterpillar caterpillar--${pose} ${className}`} {...rest}>
      <defs>
        <linearGradient id={bodyGrad} x1="-170" y1="0" x2="10" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--sage)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-hover)" />
        </linearGradient>
        <linearGradient id={headGrad} x1="-24" y1="-24" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
        <radialGradient id={shadowGrad} cx="50%" cy="50%" r="50%">
          <stop offset="58%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
        </radialGradient>
      </defs>

      {/* legs under each body segment */}
      {SEGS.slice(1).map((s, i) => (
        <g key={`leg${i}`} className="caterpillar-legs" style={{ animationDelay: `${i * 0.15}s` }}>
          <path d={`M ${s.dx - 5} ${s.dy + s.r} q 2 8 6 12`} />
          <path d={`M ${s.dx + 6} ${s.dy + s.r} q 2 8 6 12`} />
        </g>
      ))}

      {/* front legs near head */}
      <g className="caterpillar-legs" style={{ animationDelay: "0.05s" }}>
        <path d="M 1 22 q 2 8 6 12" />
        <path d="M 9 22 q 2 8 6 12" />
      </g>

      {/* body segments */}
      {SEGS.map((s, i) => (
        <g key={`seg${i}`} className="caterpillar-seg" style={{ animationDelay: `${i * 0.13}s` }}>
          <circle cx={s.dx} cy={s.dy} r={s.r} fill={`url(#${bodyGrad})`} />
          <circle cx={s.dx} cy={s.dy} r={s.r} fill={`url(#${shadowGrad})`} />
          <ellipse
            cx={s.dx - s.r * 0.32}
            cy={s.dy - s.r * 0.4}
            rx={s.r * 0.42}
            ry={s.r * 0.26}
            fill="rgba(255,255,255,0.16)"
          />
        </g>
      ))}

      {/* spots */}
      {SPOTS.map((p, i) => (
        <circle key={`spot${i}`} cx={p.dx} cy={p.dy} r={p.r} className="caterpillar-spot" />
      ))}

      {/* head */}
      <g className="caterpillar-head">
        <circle cx="0" cy="0" r="24" fill={`url(#${headGrad})`} />
        <circle cx="0" cy="0" r="24" fill={`url(#${shadowGrad})`} />
        <ellipse cx="-8" cy="-10" rx="9" ry="6" fill="rgba(255,255,255,0.16)" />

        {/* antennae */}
        <g className="caterpillar-antenna caterpillar-antenna--l">
          <path d="M -2 -22 C -10 -30 -10 -38 -6 -42" />
          <circle cx="-6" cy="-43" r="2.6" />
        </g>
        <g className="caterpillar-antenna caterpillar-antenna--r">
          <path d="M 4 -20 C 12 -28 14 -34 12 -38" />
          <circle cx="12" cy="-39" r="2.6" />
        </g>

        {/* eyes */}
        <g className="caterpillar-eye">
          <circle cx="2" cy="-9" r="5.4" fill="rgba(12,11,16,0.85)" />
          <circle cx="3.4" cy="-10.6" r="1.8" fill="#fff" />
        </g>
        <g className="caterpillar-eye" style={{ animationDelay: "0.14s" }}>
          <circle cx="12" cy="-7" r="5.4" fill="rgba(12,11,16,0.85)" />
          <circle cx="13.4" cy="-8.6" r="1.8" fill="#fff" />
        </g>

        {/* cheeks */}
        <circle cx="6" cy="3" r="4" className="caterpillar-cheek" />
        <circle cx="13" cy="5" r="4" className="caterpillar-cheek" />

        {/* mouth */}
        {pose === "eating" ? (
          <g className="caterpillar-mouth-open">
            <path d="M 7 6 Q 11 13 16 7 Q 11 11 7 6 Z" />
          </g>
        ) : (
          <path d="M 9 5 q 4 3 8 1" className="caterpillar-mouth" />
        )}
      </g>
    </g>
  );
}

export default CaterpillarBody;
