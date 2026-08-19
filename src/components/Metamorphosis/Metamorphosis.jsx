import { useId } from "react";
import { motion } from "framer-motion";
import { useTilt } from "../../hooks/useTilt";
import CaterpillarBody from "./Caterpillar";
import "./Metamorphosis.css";

function Scene({ children, className = "", caption, tilt = 8, float = true, glow = true }) {
  const t = useTilt(tilt);
  return (
    <div
      ref={t.ref}
      onMouseMove={t.onMouseMove}
      onMouseLeave={t.onMouseLeave}
      className={`meta-scene ${className}`}
      style={t.style}
    >
      {glow && <div className="meta-glow" aria-hidden="true" />}
      <motion.div
        className="meta-inner"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {float ? <div className="meta-float">{children}</div> : children}
        {caption && <p className="meta-caption">{caption}</p>}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shared butterfly wing paths (body at 0,0)
   ───────────────────────────────────────────── */
function WingPaths({ gradL, gradR, gradLow, folded = false }) {
  return (
    <g className={`bfly-wings ${folded ? "bfly-fold" : "bfly-fly-wings"}`}>
      <motion.g
        className="bfly-wing bfly-wing--l"
        initial={folded ? { scaleX: 0.08 } : false}
        whileInView={folded ? { scaleX: 1 } : undefined}
        viewport={folded ? { once: true, margin: "-60px" } : undefined}
        transition={{ type: "spring", stiffness: 36, damping: 9, delay: 0.35 }}
      >
        <path d="M0 0 C -18 -38, -62 -62, -82 -32 C -92 -12, -70 18, -40 20 C -22 21, -6 10, 0 0" fill={`url(#${gradL})`} />
        <path d="M0 0 C -12 18, -40 45, -28 62 C -18 74, -2 40, 0 0" fill={`url(#${gradLow})`} />
        <path d="M0 0 C -14 -22 -44 -40 -62 -26" className="bfly-vein" />
        <path d="M0 0 C -10 14 -26 26 -22 42" className="bfly-vein" />
      </motion.g>

      <motion.g
        className="bfly-wing bfly-wing--r"
        initial={folded ? { scaleX: 0.08 } : false}
        whileInView={folded ? { scaleX: 1 } : undefined}
        viewport={folded ? { once: true, margin: "-60px" } : undefined}
        transition={{ type: "spring", stiffness: 36, damping: 9, delay: 0.5 }}
      >
        <path d="M0 0 C 18 -38, 62 -62, 82 -32 C 92 -12, 70 18, 40 20 C 22 21, 6 10, 0 0" fill={`url(#${gradR})`} />
        <path d="M0 0 C 12 18, 40 45, 28 62 C 18 74, 2 40, 0 0" fill={`url(#${gradLow})`} />
        <path d="M0 0 C 14 -22 44 -40 62 -26" className="bfly-vein" />
        <path d="M0 0 C 10 14 26 26 22 42" className="bfly-vein" />
      </motion.g>

      {/* body + antennae */}
      <path d="M0 -30 L0 58" className="bfly-body" />
      <circle cx="0" cy="-34" r="3.4" className="bfly-head" />
      <path d="M0 -32 C -6 -40 -10 -46 -13 -52" className="bfly-antenna" />
      <path d="M0 -32 C 6 -40 10 -46 13 -52" className="bfly-antenna" />
      <circle cx="-13" cy="-53" r="1.6" className="bfly-antenna-tip" />
      <circle cx="13" cy="-53" r="1.6" className="bfly-antenna-tip" />
    </g>
  );
}

/* ═════════════════════════════════════════
   STAGE 01 — Caterpillar (Hero / rest)
   ═════════════════════════════════════════ */
function CaterpillarStage({ className = "", caption }) {
  return (
    <Scene className={className} caption={caption} float={false}>
      <svg viewBox="0 0 400 300" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="heroLeafGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* branch */}
        <path d="M -10 240 C 90 220 240 244 410 214" stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="13" strokeLinecap="round" />
        <path d="M -10 234 C 90 216 240 238 410 208" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
        {/* small leaf on branch */}
        <path d="M 74 224 C 54 190 30 176 18 192 C 30 210 54 222 74 224 Z" fill="url(#heroLeafGrad)" />
        <path d="M 74 224 C 56 210 42 196 26 194" stroke="var(--sage)" strokeOpacity="0.4" strokeWidth="0.8" fill="none" />
        {/* caterpillar */}
        <CaterpillarBody pose="rest" transform="translate(252 198)" />
      </svg>
    </Scene>
  );
}

/* ═════════════════════════════════════════
   STAGE 02 — Devouring (About)
   ═════════════════════════════════════════ */
function EatingStage({ className = "", caption }) {
  const raw = useId();
  const uid = raw.replace(/:/g, "");
  const biteMask = `biteMask-${uid}`;
  return (
    <Scene className={className} caption={caption}>
      <svg viewBox="0 0 400 300" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="eatLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="var(--sage)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.3" />
          </linearGradient>
          <mask id={biteMask}>
            <rect width="400" height="300" fill="white" />
            <circle cx="236" cy="196" r="14" fill="black" />
            <circle cx="250" cy="172" r="10" fill="black" />
            <circle cx="228" cy="218" r="9" fill="black" />
          </mask>
        </defs>

        {/* branch */}
        <path d="M -10 250 C 90 232 190 250 280 232" stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="12" strokeLinecap="round" />

        {/* bitten leaf */}
        <path
          d="M 300 30 C 360 60 400 130 396 200 C 392 258 330 288 286 286 C 240 284 226 240 246 200 C 258 176 268 120 300 30 Z"
          fill="url(#eatLeafGrad)"
          mask={`url(#${biteMask})`}
        />
        <path d="M 292 40 C 300 120 296 190 286 282" stroke="var(--sage)" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
        <path d="M 296 130 C 330 110 358 120 372 140" stroke="var(--sage)" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
        <path d="M 292 200 C 320 186 352 196 366 218" stroke="var(--sage)" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />

        {/* crumbs */}
        <circle cx="226" cy="196" r="2.4" className="crumb" />
        <circle cx="226" cy="196" r="1.8" className="crumb" style={{ animationDelay: "0.25s" }} />
        <circle cx="226" cy="196" r="2" className="crumb" style={{ animationDelay: "0.5s" }} />

        {/* caterpillar munching */}
        <CaterpillarBody pose="eating" transform="translate(212 204)" />
      </svg>
    </Scene>
  );
}

/* ═════════════════════════════════════════
   STAGE 03 — Weaving (Experience)
   ═════════════════════════════════════════ */
function PupatingStage({ className = "", caption }) {
  return (
    <Scene className={className} caption={caption}>
      <svg viewBox="0 0 400 320" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="pupGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* top branch */}
        <path d="M 20 44 C 140 26 250 50 380 34" stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="12" strokeLinecap="round" />

        {/* silk thread */}
        <path d="M 200 42 C 198 84 206 110 204 134" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 170 116 C 182 88 190 60 196 44" stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* silk wraps weaving around body */}
        <path d="M 118 122 C 140 138 170 140 194 126" className="silk-line" />
        <path d="M 100 134 C 122 150 152 152 176 138" className="silk-line" style={{ animationDelay: "0.3s" }} />
        <path d="M 78 142 C 100 158 130 160 154 146" className="silk-line" style={{ animationDelay: "0.6s" }} />

        {/* hanging caterpillar */}
        <CaterpillarBody pose="rest" transform="translate(206 140)" className="caterpillar--pupating" />
      </svg>
    </Scene>
  );
}

/* ═════════════════════════════════════════
   STAGE 04 — Cocoon (Skills)
   ═════════════════════════════════════════ */
function CocoonStage({ className = "", caption }) {
  const raw = useId();
  const uid = raw.replace(/:/g, "");
  const cocoonGrad = `cocoonGrad-${uid}`;
  return (
    <Scene className={className} caption={caption}>
      <svg viewBox="0 0 400 320" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={cocoonGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* top branch */}
        <path d="M 20 44 C 140 26 250 50 380 34" stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="12" strokeLinecap="round" />

        {/* thread */}
        <path d="M 200 42 C 198 96 206 128 202 156" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        <g className="cocoon">
          {/* hanging loop */}
          <path d="M 202 120 C 198 114 196 110 200 108 C 204 106 206 112 202 120" stroke="var(--gold)" strokeOpacity="0.5" strokeWidth="1.4" fill="none" />
          {/* cocoon body */}
          <path
            d="M 202 122 C 224 130 242 156 242 186 C 242 252 224 286 202 292 C 180 286 162 252 162 186 C 162 156 180 130 202 122 Z"
            fill={`url(#${cocoonGrad})`}
            fillOpacity="0.4"
            stroke="var(--accent)"
            strokeOpacity="0.5"
            strokeWidth="1.6"
          />
          {/* ridges */}
          <path d="M 168 172 C 184 179 220 179 236 172" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.2" fill="none" />
          <path d="M 165 200 C 183 207 221 207 239 200" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.2" fill="none" />
          <path d="M 166 230 C 183 236 221 236 234 230" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.2" fill="none" />
          {/* hint of crack */}
          <path d="M 198 132 l 4 7 M 206 132 l -4 7" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="0.8" strokeLinecap="round" />
          {/* inner pulse */}
          <ellipse cx="202" cy="206" rx="24" ry="52" className="cocoon-pulse" />
        </g>
      </svg>
    </Scene>
  );
}

/* ═════════════════════════════════════════
   STAGE 05 — Emerging (Projects)
   ═════════════════════════════════════════ */
function EmergingStage({ className = "", caption }) {
  const raw = useId();
  const uid = raw.replace(/:/g, "");
  const cocoonGrad = `emergGrad-${uid}`;
  const gradL = `emergWingL-${uid}`;
  const gradR = `emergWingR-${uid}`;
  const gradLow = `emergWingLow-${uid}`;
  return (
    <Scene className={className} caption={caption}>
      <svg viewBox="0 0 400 320" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={cocoonGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id={gradL} x1="0" y1="-50" x2="-90" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id={gradR} x1="0" y1="-50" x2="90" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id={gradLow} x1="0" y1="-40" x2="0" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* top branch */}
        <path d="M 20 44 C 140 26 250 50 380 34" stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="12" strokeLinecap="round" />

        {/* thread */}
        <path d="M 200 42 C 198 92 206 122 202 148" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* cracked-open cocoon */}
        <path
          d="M 168 160 L 178 150 L 190 164 L 202 150 L 214 164 L 226 150 L 236 160 C 240 200 234 258 202 290 C 170 258 164 200 168 160 Z"
          fill={`url(#${cocoonGrad})`}
          fillOpacity="0.45"
          stroke="var(--accent)"
          strokeOpacity="0.45"
          strokeWidth="1.4"
        />
        <path d="M 168 160 L 178 150 L 190 164 L 202 150 L 214 164 L 226 150 L 236 160" stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" />
        {/* opened cap flap */}
        <g transform="rotate(-22 202 150)">
          <path
            d="M 174 138 C 186 124 218 124 230 136 C 236 142 234 152 228 158 C 214 164 192 162 182 154 C 174 148 170 144 174 138 Z"
            fill={`url(#${cocoonGrad})`}
            fillOpacity="0.35"
            stroke="var(--accent)"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
        </g>

        {/* rising light */}
        <circle cx="190" cy="150" r="2" className="emerge-particle" />
        <circle cx="214" cy="150" r="2" className="emerge-particle" style={{ animationDelay: "0.5s" }} />
        <circle cx="202" cy="150" r="1.6" className="emerge-particle" style={{ animationDelay: "1s" }} />

        {/* emerging butterfly, folded wings */}
        <g transform="translate(202 112)">
          <WingPaths gradL={gradL} gradR={gradR} gradLow={gradLow} folded />
        </g>
      </svg>
    </Scene>
  );
}

/* ═════════════════════════════════════════
   STAGE 06 — Flight (Contact)
   ═════════════════════════════════════════ */
function ButterflyStage({ className = "", caption }) {
  const raw = useId();
  const uid = raw.replace(/:/g, "");
  const gradL = `flyWingL-${uid}`;
  const gradR = `flyWingR-${uid}`;
  const gradLow = `flyWingLow-${uid}`;
  return (
    <Scene className={className} caption={caption}>
      <svg viewBox="0 0 400 300" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradL} x1="0" y1="-50" x2="-90" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id={gradR} x1="0" y1="-50" x2="90" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id={gradLow} x1="0" y1="-40" x2="0" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* sparkles */}
        <circle cx="150" cy="92" r="2" className="sparkle" />
        <circle cx="252" cy="80" r="2" className="sparkle" style={{ animationDelay: "0.6s" }} />
        <circle cx="120" cy="168" r="1.6" className="sparkle" style={{ animationDelay: "1.1s" }} />
        <circle cx="272" cy="176" r="1.6" className="sparkle" style={{ animationDelay: "1.6s" }} />
        <circle cx="200" cy="62" r="1.4" className="sparkle" style={{ animationDelay: "0.3s" }} />

        {/* flying butterfly */}
        <g className="bfly-fly" transform="translate(200 132)">
          <WingPaths gradL={gradL} gradR={gradR} gradLow={gradLow} />
        </g>
      </svg>
    </Scene>
  );
}

export {
  Scene,
  CaterpillarStage,
  EatingStage,
  PupatingStage,
  CocoonStage,
  EmergingStage,
  ButterflyStage,
};
