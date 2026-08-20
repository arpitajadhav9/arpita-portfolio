import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./BotanicalBackground.css";

/* ─── Scroll-triggered entrance variants ─── */
const branchDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.3 },
    },
  },
};

const leafReveal = {
  hidden: { opacity: 0, scale: 0.3, rotate: -15 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, delay: 0.4 + i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

const flowerBloom = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.0, delay: 0.6 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Premium Leaf & Flower Components ─── */

// High-fidelity Leaf with center and side veins
function Leaf({ x, y, rotate = 0, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        transform={`rotate(${rotate}) scale(${scale})`}
        variants={leafReveal}
        custom={delay}
        className="botanical-leaf botanical-sway"
      >
        {/* Leaf Plate */}
        <path
          d="M 0 0 C 8 -12, 18 -16, 28 -16 C 35 -16, 40 -8, 42 0 C 28 8, 14 8, 0 0 Z"
          fill="url(#bgLeafGrad)"
          fillOpacity="0.45"
          stroke="var(--sage)"
          strokeWidth="0.6"
          strokeOpacity="0.3"
        />
        {/* Central Vein */}
        <path
          d="M 0 0 C 14 -4, 28 -4, 42 0"
          stroke="var(--sage)"
          strokeWidth="0.8"
          strokeOpacity="0.5"
          fill="none"
        />
        {/* Side Veins */}
        <path d="M 12 -2 Q 14 -7, 16 -9" stroke="var(--sage)" strokeWidth="0.4" strokeOpacity="0.3" fill="none" />
        <path d="M 22 -3 Q 24 -8, 26 -10" stroke="var(--sage)" strokeWidth="0.4" strokeOpacity="0.3" fill="none" />
        <path d="M 16 2 Q 18 5, 20 6" stroke="var(--sage)" strokeWidth="0.4" strokeOpacity="0.2" fill="none" />
      </motion.g>
    </g>
  );
}

// Multi-layered Flower
function Flower({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        transform={`scale(${scale})`}
        variants={flowerBloom}
        custom={delay}
        className="botanical-sway--alt"
      >
        {/* Outer Petals */}
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <ellipse
            key={`op-${r}`}
            cx="0"
            cy="-6"
            rx="3.2"
            ry="7.0"
            fill="url(#bgFlowerGrad)"
            fillOpacity="0.35"
            transform={`rotate(${r})`}
          />
        ))}
        {/* Inner Petals */}
        {[30, 90, 150, 210, 270, 330].map((r) => (
          <ellipse
            key={`ip-${r}`}
            cx="0"
            cy="-4"
            rx="2.0"
            ry="4.8"
            fill="var(--accent)"
            fillOpacity="0.5"
            transform={`rotate(${r})`}
          />
        ))}
        {/* Center Pistil */}
        <circle cx="0" cy="0" r="1.8" fill="var(--gold)" fillOpacity="0.85" />
        <circle cx="0" cy="0" r="0.8" fill="#fff" fillOpacity="0.9" />
      </motion.g>
    </g>
  );
}

/* ─── Shared Gradients Definition ─── */
function SharedGradients() {
  return (
    <defs>
      <linearGradient id="bgLeafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--sage)" />
        <stop offset="100%" stopColor="var(--sage-muted)" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="bgFlowerGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--accent)" />
        <stop offset="100%" stopColor="var(--accent-muted)" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  );
}

/* ─── Section wrapper with IntersectionObserver ─── */
function BotanicalSection({ className, children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <motion.div
      ref={ref} className={`botanical-group ${className}`}
      style={reduced ? {} : { y }}
      initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   1. HERO BACKGROUND — Bottom-aligned wavy branches
   ═══════════════════════════════════════════ */
export function HeroBackground() {
  return (
    <div className="botanical-bg" aria-hidden="true">
      <BotanicalSection className="botanical-group--hero">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>
          <SharedGradients />

          {/* Bottom-left climbing branch (wavy, hugging corner) */}
          <motion.path
            d="M -30 950 C 30 850, 60 780, 80 650"
            stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="3.2" strokeLinecap="round"
            variants={branchDraw}
          />
          {/* Sub branch left */}
          <motion.path
            d="M 20 830 Q 50 800, 70 750"
            stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={10} y={880} rotate={45} scale={0.9} delay={0} />
          <Leaf x={50} y={780} rotate={35} scale={1.0} delay={1} />
          <Leaf x={65} y={710} rotate={45} scale={0.85} delay={2} />
          <Leaf x={45} y={795} rotate={30} scale={0.8} delay={3} />
          <Flower x={80} y={650} scale={0.9} delay={3} />
          <Flower x={70} y={750} scale={0.75} delay={4} />

          {/* Bottom-right climbing branch (wavy) */}
          <motion.path
            d="M 1460 920 C 1380 820, 1320 700, 1280 550"
            stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="3.2" strokeLinecap="round"
            variants={branchDraw}
          />
          {/* Sub branch right */}
          <motion.path
            d="M 1380 760 Q 1330 730, 1300 680"
            stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={1420} y={830} rotate={-60} scale={0.9} delay={0} />
          <Leaf x={1340} y={710} rotate={-45} scale={1.0} delay={1} />
          <Leaf x={1310} y={640} rotate={-35} scale={0.85} delay={2} />
          <Leaf x={1340} y={725} rotate={-40} scale={0.8} delay={3} />
          <Flower x={1280} y={550} scale={0.9} delay={3} />
          <Flower x={1300} y={680} scale={0.75} delay={4} />
        </svg>
      </BotanicalSection>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. ABOUT BACKGROUND — Side wavy branches framing layout
   ═══════════════════════════════════════════ */
export function AboutBackground() {
  return (
    <div className="botanical-bg" aria-hidden="true">
      <BotanicalSection className="botanical-group--about">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>
          <SharedGradients />

          {/* Left climbing branch (wavy) */}
          <motion.path
            d="M -20 880 C 60 680, 40 440, 100 200"
            stroke="var(--gold)" strokeOpacity="0.4" strokeWidth="3.2" strokeLinecap="round"
            variants={branchDraw}
          />
          <motion.path
            d="M 24 540 Q 70 510, 90 450"
            stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={10} y={700} rotate={45} scale={1.0} delay={0} />
          <Leaf x={50} y={480} rotate={35} scale={0.9} delay={1} />
          <Leaf x={70} y={320} rotate={45} scale={0.85} delay={2} />
          <Leaf x={55} y={515} rotate={30} scale={0.8} delay={2} />
          <Flower x={100} y={200} scale={0.9} delay={3} />
          <Flower x={90} y={450} scale={0.75} delay={4} />

          {/* Right hanging branch (wavy) */}
          <motion.path
            d="M 1460 120 C 1380 320, 1400 520, 1280 780"
            stroke="var(--gold)" strokeOpacity="0.4" strokeWidth="3.0" strokeLinecap="round"
            variants={branchDraw}
          />
          <motion.path
            d="M 1390 380 Q 1340 420, 1310 470"
            stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={1410} y={250} rotate={-30} scale={0.9} delay={0} />
          <Leaf x={1360} y={480} rotate={-45} scale={1.0} delay={1} />
          <Leaf x={1320} y={630} rotate={-40} scale={0.85} delay={2} />
          <Leaf x={1355} y={425} rotate={-30} scale={0.8} delay={2} />
          <Flower x={1280} y={780} scale={0.9} delay={3} />
          <Flower x={1310} y={470} scale={0.75} delay={4} />
        </svg>
      </BotanicalSection>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. EXPERIENCE BACKGROUND — Clean framing branches
   ═══════════════════════════════════════════ */
export function ExperienceBackground() {
  return (
    <div className="botanical-bg" aria-hidden="true">
      <BotanicalSection className="botanical-group--experience">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>
          <SharedGradients />

          {/* Left top branch */}
          <motion.path
            d="M -20 220 C 80 230, 180 180, 280 250"
            stroke="var(--gold)" strokeOpacity="0.4" strokeWidth="3.0" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={90} y={225} rotate={45} scale={0.9} delay={0} />
          <Leaf x={190} y={200} rotate={35} scale={1.0} delay={1} />
          <Flower x={280} y={250} scale={0.95} delay={2} />

          {/* Right top branch */}
          <motion.path
            d="M 1460 380 C 1340 370, 1220 400, 1100 350"
            stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="3.2" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={1330} y={375} rotate={-45} scale={0.95} delay={0} />
          <Leaf x={1210} y={390} rotate={-35} scale={1.0} delay={1} />
          <Flower x={1100} y={350} scale={0.9} delay={2} />

          {/* Right bottom branch */}
          <motion.path
            d="M 1460 740 C 1360 730, 1260 750, 1160 700"
            stroke="var(--gold)" strokeOpacity="0.4" strokeWidth="2.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={1320} y={735} rotate={-35} scale={0.9} delay={0} />
          <Leaf x={1240} y={725} rotate={-40} scale={0.9} delay={1} />
          <Flower x={1160} y={700} scale={0.8} delay={1} />
        </svg>
      </BotanicalSection>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. SKILLS BACKGROUND — Grounded mini-trees framing grid
   ═══════════════════════════════════════════ */
export function SkillsBackground() {
  return (
    <div className="botanical-bg" aria-hidden="true">
      <BotanicalSection className="botanical-group--skills">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>
          <SharedGradients />

          {/* Left mini tree */}
          <motion.path
            d="M 40 920 C 50 750, 45 600, 100 450"
            stroke="var(--gold)" strokeOpacity="0.4" strokeWidth="2.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <motion.path
            d="M 46 680 C 80 650, 100 665, 120 630"
            stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={42} y={780} rotate={50} scale={0.9} delay={0} />
          <Leaf x={90} y={645} rotate={40} scale={1.0} delay={1} />
          <Leaf x={82} y={655} rotate={45} scale={0.75} delay={2} />
          <Flower x={100} y={450} scale={0.85} delay={2} />
          <Flower x={120} y={630} scale={0.7} delay={3} />

          {/* Right mini tree */}
          <motion.path
            d="M 1400 920 C 1390 750, 1395 600, 1340 450"
            stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="2.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <motion.path
            d="M 1394 680 C 1360 650, 1340 665, 1320 630"
            stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={1398} y={780} rotate={-50} scale={0.9} delay={0} />
          <Leaf x={1350} y={645} rotate={-40} scale={1.0} delay={1} />
          <Leaf x={1358} y={655} rotate={-45} scale={0.75} delay={2} />
          <Flower x={1340} y={450} scale={0.85} delay={2} />
          <Flower x={1320} y={630} scale={0.7} delay={3} />
        </svg>
      </BotanicalSection>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. PROJECTS BACKGROUND — Corner-arching wavy frames
   ═══════════════════════════════════════════ */
export function ProjectsBackground() {
  return (
    <div className="botanical-bg" aria-hidden="true" style={{ height: "950px", top: "auto", bottom: 0 }}>
      <BotanicalSection className="botanical-group--projects">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>
          <SharedGradients />

          {/* Bottom-left climbing branch (wavy, hugging corner) */}
          <motion.path
            d="M -30 950 C 30 850, 60 780, 80 650"
            stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="3.2" strokeLinecap="round"
            variants={branchDraw}
          />
          {/* Sub branch left */}
          <motion.path
            d="M 20 830 Q 50 800, 70 750"
            stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={10} y={880} rotate={45} scale={0.9} delay={0} />
          <Leaf x={50} y={780} rotate={35} scale={1.0} delay={1} />
          <Leaf x={65} y={710} rotate={45} scale={0.85} delay={2} />
          <Leaf x={45} y={795} rotate={30} scale={0.8} delay={3} />
          <Flower x={80} y={650} scale={0.9} delay={3} />
          <Flower x={70} y={750} scale={0.75} delay={4} />

          {/* Bottom-right climbing branch (wavy) */}
          <motion.path
            d="M 1460 920 C 1380 820, 1320 700, 1280 550"
            stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="3.2" strokeLinecap="round"
            variants={branchDraw}
          />
          {/* Sub branch right */}
          <motion.path
            d="M 1380 760 Q 1330 730, 1300 680"
            stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={1420} y={830} rotate={-60} scale={0.9} delay={0} />
          <Leaf x={1340} y={710} rotate={-45} scale={1.0} delay={1} />
          <Leaf x={1310} y={640} rotate={-35} scale={0.85} delay={2} />
          <Leaf x={1340} y={725} rotate={-40} scale={0.8} delay={3} />
          <Flower x={1280} y={550} scale={0.9} delay={3} />
          <Flower x={1300} y={680} scale={0.75} delay={4} />
        </svg>
      </BotanicalSection>
    </div>
  );
}

/* ═══════════════════════════════════════════
   6. CONTACT BACKGROUND — Sparse delicate wavy branches
   ═══════════════════════════════════════════ */
export function ContactBackground() {
  return (
    <div className="botanical-bg" aria-hidden="true">
      <BotanicalSection className="botanical-group--contact">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>
          <SharedGradients />

          {/* Left delicate branch */}
          <motion.path
            d="M -10 380 C 50 365, 90 385, 140 345"
            stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="2.2" strokeLinecap="round"
            variants={branchDraw}
          />
          {/* Sub branch left */}
          <motion.path
            d="M 50 375 Q 80 345, 100 310"
            stroke="var(--gold)" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={50} y={375} rotate={45} scale={0.95} delay={0} />
          <Leaf x={80} y={345} rotate={35} scale={0.8} delay={1} />
          <Flower x={140} y={345} scale={0.8} delay={1} />
          <Flower x={100} y={310} scale={0.65} delay={2} />

          {/* Right delicate branch */}
          <motion.path
            d="M 1450 480 C 1390 465, 1350 485, 1300 445"
            stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="2.2" strokeLinecap="round"
            variants={branchDraw}
          />
          {/* Sub branch right */}
          <motion.path
            d="M 1390 475 Q 1360 445, 1340 410"
            stroke="var(--gold)" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round"
            variants={branchDraw}
          />
          <Leaf x={1390} y={475} rotate={-45} scale={0.95} delay={0} />
          <Leaf x={1360} y={445} rotate={-35} scale={0.8} delay={1} />
          <Flower x={1300} y={445} scale={0.8} delay={1} />
          <Flower x={1340} y={410} scale={0.65} delay={2} />
        </svg>
      </BotanicalSection>
    </div>
  );
}
