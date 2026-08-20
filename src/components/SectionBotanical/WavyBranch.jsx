import { motion } from "framer-motion";

// Entry animations for the branch path, leaves, and flowers
const branchDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (customDelay) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.8, delay: customDelay * 0.1, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.4, delay: customDelay * 0.1 },
    },
  }),
};

const leafReveal = {
  hidden: { opacity: 0, scale: 0, rotate: -20 },
  visible: (customDelay) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, delay: 0.4 + customDelay * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const flowerBloom = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  visible: (customDelay) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.0, delay: 0.6 + customDelay * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Reusable Leaf subcomponent
function Leaf({ x, y, rotate = 0, scale = 1, delay = 0 }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
      variants={leafReveal}
      custom={delay}
    >
      {/* Leaf body */}
      <path
        d="M 0 0 C 12 -8, 20 -4, 18 4 C 15 10, 5 8, 0 0 Z"
        fill="url(#wavy-leaf-grad)"
        opacity="0.45"
      />
      {/* Central vein */}
      <path
        d="M 0 0 C 6 -3, 12 -1, 16 2"
        stroke="var(--sage)"
        strokeOpacity="0.25"
        strokeWidth="0.5"
        fill="none"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

// Reusable Flower subcomponent
function Flower({ x, y, scale = 1.0, delay = 0, fill }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      variants={flowerBloom}
      custom={delay}
    >
      {/* 6 overlapping petals */}
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <path
          key={r}
          d="M 0 0 C 2.5 -5.5, 7.5 -6, 5.5 0 C 7.5 6, 2.5 5.5, 0 0 Z"
          fill={fill}
          opacity="0.5"
          transform={`rotate(${r})`}
        />
      ))}
      {/* Center pistil */}
      <circle cx="0" cy="0" r="1.5" fill="var(--gold)" fillOpacity="0.75" />
    </motion.g>
  );
}

// Reusable Bud subcomponent
function Bud({ x, y, scale = 1, delay = 0, fill }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      variants={flowerBloom}
      custom={delay}
    >
      {/* Outer green sepals */}
      <circle cx="0" cy="0" r="3" fill="var(--sage)" fillOpacity="0.3" />
      {/* Inner blooming petals */}
      <circle cx="0" cy="0" r="1.8" fill={fill} fillOpacity="0.65" />
    </motion.g>
  );
}

// Generates branch path data based on side, variant and yStart
const getVariantData = (variant, side, yStart) => {
  const isLeft = side === "left";
  const mx = (x) => (isLeft ? x : 1440 - x);
  const mr = (angle) => (isLeft ? angle : -angle);

  switch (variant) {
    case 1:
      return {
        mainD: `M ${mx(0)} ${yStart} C ${mx(60)} ${yStart - 20}, ${mx(120)} ${yStart + 20}, ${mx(170)} ${yStart + 90} C ${mx(210)} ${yStart + 150}, ${mx(200)} ${yStart + 220}, ${mx(180)} ${yStart + 260}`,
        subBranches: [
          {
            d: `M ${mx(90)} ${yStart + 5} C ${mx(120)} ${yStart - 10}, ${mx(150)} ${yStart}, ${mx(160)} ${yStart + 15}`,
            delay: 2
          },
          {
            d: `M ${mx(170)} ${yStart + 90} C ${mx(150)} ${yStart + 130}, ${mx(130)} ${yStart + 150}, ${mx(120)} ${yStart + 160}`,
            delay: 4
          }
        ],
        leaves: [
          { x: mx(50), y: yStart - 10, rotate: mr(-35), scale: 0.9, delay: 1 },
          { x: mx(130), y: yStart + 35, rotate: mr(40), scale: 0.95, delay: 3 },
          { x: mx(160), y: yStart + 15, rotate: mr(-10), scale: 0.85, delay: 3 },
          { x: mx(120), y: yStart + 160, rotate: mr(135), scale: 0.85, delay: 5 }
        ],
        buds: [
          { x: mx(100), y: yStart + 10, scale: 0.9, delay: 2 }
        ],
        tip: { x: mx(180), y: yStart + 260 }
      };

    case 2:
      return {
        mainD: `M ${mx(0)} ${yStart} C ${mx(80)} ${yStart - 10}, ${mx(140)} ${yStart + 60}, ${mx(200)} ${yStart + 80} C ${mx(250)} ${yStart + 90}, ${mx(260)} ${yStart + 140}, ${mx(240)} ${yStart + 180}`,
        subBranches: [
          {
            d: `M ${mx(110)} ${yStart + 30} C ${mx(140)} ${yStart + 10}, ${mx(170)} ${yStart + 20}, ${mx(180)} ${yStart + 35}`,
            delay: 2
          },
          {
            d: `M ${mx(200)} ${yStart + 80} C ${mx(180)} ${yStart + 110}, ${mx(160)} ${yStart + 130}, ${mx(150)} ${yStart + 140}`,
            delay: 4
          }
        ],
        leaves: [
          { x: mx(60), y: yStart + 10, rotate: mr(15), scale: 0.9, delay: 1 },
          { x: mx(235), y: yStart + 95, rotate: mr(65), scale: 0.85, delay: 3 },
          { x: mx(150), y: yStart + 140, rotate: mr(160), scale: 0.8, delay: 5 }
        ],
        buds: [
          { x: mx(180), y: yStart + 35, scale: 1.0, delay: 3 }
        ],
        tip: { x: mx(240), y: yStart + 180 }
      };

    case 3:
    default:
      return {
        mainD: `M ${mx(0)} ${yStart} C ${mx(50)} ${yStart - 30}, ${mx(110)} ${yStart - 10}, ${mx(150)} ${yStart + 40} C ${mx(190)} ${yStart + 90}, ${mx(220)} ${yStart + 160}, ${mx(210)} ${yStart + 220} C ${mx(200)} ${yStart + 260}, ${mx(170)} ${yStart + 290}, ${mx(150)} ${yStart + 310}`,
        subBranches: [
          {
            d: `M ${mx(130)} ${yStart + 20} C ${mx(160)} ${yStart + 50}, ${mx(180)} ${yStart + 70}, ${mx(190)} ${yStart + 90}`,
            delay: 2
          },
          {
            d: `M ${mx(210)} ${yStart + 220} C ${mx(190)} ${yStart + 250}, ${mx(170)} ${yStart + 260}, ${mx(160)} ${yStart + 270}`,
            delay: 4
          }
        ],
        leaves: [
          { x: mx(80), y: yStart - 15, rotate: mr(-45), scale: 0.85, delay: 1 },
          { x: mx(180), y: yStart + 110, rotate: mr(35), scale: 0.9, delay: 3 },
          { x: mx(190), y: yStart + 90, rotate: mr(45), scale: 0.8, delay: 3 }
        ],
        buds: [
          { x: mx(160), y: yStart + 270, scale: 0.9, delay: 5 }
        ],
        tip: { x: mx(150), y: yStart + 310 }
      };
  }
};

export default function WavyBranch({ side = "left", yStart = 200, variant = 1, flowerColor = "accent", delay = 0 }) {
  const { mainD, subBranches, leaves, buds, tip } = getVariantData(variant, side, yStart);
  
  // Decide which gradient to use for flowers/buds
  const flowerGradUrl = flowerColor === "gold" ? "url(#wavy-flower-gold-grad)" : "url(#wavy-flower-accent-grad)";

  return (
    <g>
      <defs>
        {/* Leaf Gradient */}
        <linearGradient id="wavy-leaf-grad" x1="0" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.15" />
        </linearGradient>

        {/* Rose Flower Gradient */}
        <linearGradient id="wavy-flower-accent-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
        </linearGradient>

        {/* Gold Flower Gradient */}
        <linearGradient id="wavy-flower-gold-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* 1. Main wavy branch path */}
      <motion.path
        d={mainD}
        stroke="var(--gold)"
        strokeOpacity="0.22"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        variants={branchDraw}
        custom={delay}
      />
      
      {/* 2. Small sub-branches */}
      {subBranches.map((sub, idx) => (
        <motion.path
          key={`sub-${idx}`}
          d={sub.d}
          stroke="var(--gold)"
          strokeOpacity="0.16"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          variants={branchDraw}
          custom={delay + sub.delay}
        />
      ))}

      {/* 3. Leaves along the branch system */}
      {leaves.map((leaf, idx) => (
        <Leaf
          key={`leaf-${idx}`}
          x={leaf.x}
          y={leaf.y}
          rotate={leaf.rotate}
          scale={leaf.scale}
          delay={delay + leaf.delay}
        />
      ))}

      {/* 4. Flower Buds along the branch system */}
      {buds.map((bud, idx) => (
        <Bud
          key={`bud-${idx}`}
          x={bud.x}
          y={bud.y}
          scale={bud.scale}
          delay={delay + bud.delay}
          fill={flowerGradUrl}
        />
      ))}

      {/* 5. Blooming Flower at the end tip */}
      <Flower
        x={tip.x}
        y={tip.y}
        scale={1.1}
        delay={delay + 5}
        fill={flowerGradUrl}
      />
    </g>
  );
}
