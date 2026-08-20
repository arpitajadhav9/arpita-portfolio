import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import "./BotanicalBackground.css";

/*
 * Botanical Background — straight branches, dense coverage, animated.
 * Each section has a unique arrangement of branches, leaves, and flowers.
 */

/* ─── Scroll-triggered entrance variants ─── */
const branchDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.3, delay: i * 0.08 },
    },
  }),
};

const leafReveal = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const flowerBloom = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.2, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Primitives ─── */
function Branch({ d, stroke = "var(--gold)", opacity = 0.2, width = 3, delay = 0 }) {
  return (
    <motion.path
      d={d} stroke={stroke} strokeOpacity={opacity} strokeWidth={width}
      fill="none" strokeLinecap="round" strokeLinejoin="round"
      className="botanical-branch botanical-branch--animate"
      variants={branchDraw} custom={delay}
    />
  );
}

function Leaf({ d, fill = "var(--sage)", opacity = 0.18, delay = 0, className = "" }) {
  return (
    <motion.path
      d={d} fill={fill} fillOpacity={opacity}
      className={`botanical-leaf ${className}`}
      variants={leafReveal} custom={delay}
    />
  );
}

function LeafVein({ d, stroke = "var(--sage)", opacity = 0.1, delay = 0 }) {
  return (
    <motion.path
      d={d} stroke={stroke} strokeOpacity={opacity} strokeWidth={0.6}
      fill="none" strokeLinecap="round"
      className="botanical-leaf-stroke"
      variants={leafReveal} custom={delay}
    />
  );
}

function Flower({ cx, cy, fill = "var(--accent)", opacity = 0.14, scale = 1, delay = 0 }) {
  return (
    <motion.g
      transform={`translate(${cx}, ${cy}) scale(${scale})`}
      variants={flowerBloom} custom={delay}
    >
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse key={r} cx="0" cy="-5" rx="2.8" ry="5.5"
          fill={fill} fillOpacity={opacity} transform={`rotate(${r})`} />
      ))}
      <circle cx="0" cy="0" r="2" fill={fill} fillOpacity={opacity * 2} />
    </motion.g>
  );
}

function Bud({ cx, cy, r = 3, fill = "var(--accent)", opacity = 0.12, delay = 0 }) {
  return (
    <motion.g variants={flowerBloom} custom={delay}>
      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={opacity} />
      <circle cx={cx} cy={cy} r={r * 0.35} fill={fill} fillOpacity={opacity * 2.5} />
    </motion.g>
  );
}

/* ─── Section wrapper with IntersectionObserver ─── */
function BotanicalSection({ className, style, children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <motion.div
      ref={ref} className={`botanical-group ${className}`} style={style}
      initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
function BotanicalBackground() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <div className="botanical-layer" aria-hidden="true">

      {/* ════════════════════════════════════════
          HERO — Straight branches from all four corners,
          multiple sub-branches, leaves, flowers.
          ════════════════════════════════════════ */}
      <BotanicalSection className="botanical-group--hero" style={reduced ? {} : { y: y1 }}>
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>

          {/* Top-left main branch — mostly straight, slight angle */}
          <Branch d="M -20 0 L 60 180 L 90 360 L 70 500" width={3.8} delay={0} />
          {/* Sub-branches off the left main */}
          <Branch d="M 40 120 L 100 160" width={2.4} opacity={0.18} delay={1} />
          <Branch d="M 76 280 L 30 320" width={2.2} opacity={0.16} delay={2} />
          <Branch d="M 82 420 L 120 460" width={2} opacity={0.14} delay={3} />
          {/* Leaves on left */}
          <Leaf d="M 100 158 C 114 148 124 154 120 164 C 114 172 102 168 100 162 Z" delay={1} />
          <LeafVein d="M 102 160 C 112 152 118 150 120 152" delay={1} />
          <Leaf d="M 32 318 C 18 308 8 314 14 324 C 22 332 30 326 32 322 Z" opacity={0.15} delay={2} />
          <Leaf d="M 118 458 C 130 448 140 454 136 464 C 128 472 120 466 118 462 Z" opacity={0.13} delay={3} />
          <Bud cx={72} cy={498} r={4} opacity={0.1} delay={4} />

          {/* Top-right main branch — mirrors left */}
          <Branch d="M 1460 0 L 1380 180 L 1350 360 L 1370 500" width={3.8} delay={0} />
          <Branch d="M 1400 120 L 1340 160" width={2.4} opacity={0.18} delay={1} />
          <Branch d="M 1364 280 L 1410 320" width={2.2} opacity={0.16} delay={2} />
          <Branch d="M 1358 420 L 1320 460" width={2} opacity={0.14} delay={3} />
          <Leaf d="M 1340 158 C 1326 148 1316 154 1320 164 C 1326 172 1338 168 1340 162 Z" delay={1} />
          <LeafVein d="M 1338 160 C 1328 152 1322 150 1320 152" delay={1} />
          <Leaf d="M 1408 318 C 1422 308 1432 314 1426 324 C 1418 332 1410 326 1408 322 Z" opacity={0.15} delay={2} />
          <Leaf d="M 1322 458 C 1310 448 1300 454 1304 464 C 1312 472 1320 466 1322 462 Z" opacity={0.13} delay={3} />
          <Bud cx={1368} cy={498} r={4} opacity={0.1} delay={4} />

          {/* Bottom-left diagonal branch */}
          <Branch d="M 0 900 L 80 780 L 120 660" width={2.8} opacity={0.16} delay={2} />
          <Branch d="M 80 780 L 140 760" width={1.8} opacity={0.12} delay={3} />
          <Leaf d="M 138 758 C 150 748 160 754 156 764 C 148 772 140 766 138 762 Z" opacity={0.12} delay={3} />

          {/* Bottom-right diagonal branch */}
          <Branch d="M 1440 900 L 1360 780 L 1320 660" width={2.8} opacity={0.16} delay={2} />
          <Branch d="M 1360 780 L 1300 760" width={1.8} opacity={0.12} delay={3} />
          <Leaf d="M 1302 758 C 1290 748 1280 754 1284 764 C 1292 772 1300 766 1302 762 Z" opacity={0.12} delay={3} />
        </svg>
      </BotanicalSection>

      {/* ════════════════════════════════════════
          LEARNING — Straight vertical branch from bottom-left
          with angled sub-branches. Creeper-like but straight.
          ════════════════════════════════════════ */}
      <BotanicalSection className="botanical-group--learning" style={reduced ? {} : { y: y2 }}>
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>

          {/* Main vertical stem — straight up from bottom-left */}
          <Branch d="M -10 880 L 40 700 L 60 520 L 50 340 L 65 180" width={3.4} delay={0} />

          {/* Sub-branches angling off the main stem */}
          <Branch d="M 48 700 L 120 680" width={2.4} opacity={0.18} delay={1} />
          <Branch d="M 56 520 L 10 500" width={2.2} opacity={0.16} delay={2} />
          <Branch d="M 52 400 L 110 380" width={2} opacity={0.14} delay={3} />
          <Branch d="M 55 300 L 15 280" width={1.8} opacity={0.12} delay={4} />
          <Branch d="M 62 220 L 110 200" width={1.6} opacity={0.11} delay={5} />

          {/* Leaves along sub-branches */}
          <Leaf d="M 118 678 C 130 668 140 674 136 684 C 128 692 120 686 118 682 Z" delay={1} />
          <LeafVein d="M 120 680 C 128 672 134 670 136 672" delay={1} />
          <Leaf d="M 12 498 C 0 488 -10 494 -4 504 C 4 512 10 506 12 502 Z" opacity={0.15} delay={2} />
          <Leaf d="M 108 378 C 120 368 130 374 126 384 C 118 392 110 386 108 382 Z" opacity={0.14} delay={3} />
          <Leaf d="M 17 278 C 5 268 -5 274 1 284 C 9 292 15 286 17 282 Z" opacity={0.12} delay={4} />
          <Leaf d="M 108 198 C 120 188 130 194 126 204 C 118 212 110 206 108 202 Z" opacity={0.11} delay={5} />

          {/* Flower at top */}
          <Flower cx={65} cy={178} fill="var(--accent)" opacity={0.12} scale={0.8} delay={6} />

          {/* Right side — straight branch from right edge */}
          <Branch d="M 1460 400 L 1380 380 L 1340 360" width={2.6} opacity={0.12} delay={4} />
          <Branch d="M 1380 380 L 1360 420" width={1.8} opacity={0.1} delay={5} />
          <Leaf d="M 1362 418 C 1350 408 1340 414 1344 424 C 1352 432 1360 426 1362 422 Z" opacity={0.1} delay={5} />
        </svg>
      </BotanicalSection>

      {/* ════════════════════════════════════════
          GROWING — Horizontal branches from both sides,
          mostly straight with slight angles.
          ════════════════════════════════════════ */}
      <BotanicalSection className="botanical-group--growing" style={reduced ? {} : { y: y3 }}>
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>

          {/* Left branch — straight horizontal from left edge */}
          <Branch d="M -20 300 L 120 290 L 260 280" width={3.2} opacity={0.18} delay={0} />
          <Branch d="M 120 290 L 100 240" width={2} opacity={0.14} delay={1} />
          <Branch d="M 200 284 L 180 330" width={1.8} opacity={0.12} delay={2} />
          <Leaf d="M 102 238 C 90 228 80 234 84 244 C 92 252 100 246 102 242 Z" delay={1} />
          <Leaf d="M 182 328 C 170 318 160 324 164 334 C 172 342 180 336 182 332 Z" opacity={0.13} delay={2} />
          <Flower cx={258} cy={278} fill="var(--gold)" opacity={0.1} scale={0.7} delay={3} />

          {/* Left branch 2 — lower, from left */}
          <Branch d="M -10 600 L 100 590 L 200 580" width={2.8} opacity={0.14} delay={2} />
          <Branch d="M 100 590 L 80 540" width={1.8} opacity={0.11} delay={3} />
          <Leaf d="M 82 538 C 70 528 60 534 64 544 C 72 552 80 546 82 542 Z" opacity={0.12} delay={3} />

          {/* Right branch — straight horizontal from right edge */}
          <Branch d="M 1460 500 L 1320 490 L 1180 480" width={3.2} opacity={0.18} delay={1} />
          <Branch d="M 1320 490 L 1340 440" width={2} opacity={0.14} delay={2} />
          <Branch d="M 1240 484 L 1260 530" width={1.8} opacity={0.12} delay={3} />
          <Leaf d="M 1338 438 C 1350 428 1360 434 1356 444 C 1348 452 1340 446 1338 442 Z" delay={2} />
          <Leaf d="M 1258 528 C 1270 518 1280 524 1276 534 C 1268 542 1260 536 1258 532 Z" opacity={0.13} delay={3} />
          <Flower cx={1182} cy={478} fill="var(--gold)" opacity={0.1} scale={0.7} delay={4} />

          {/* Right branch 2 — lower */}
          <Branch d="M 1450 700 L 1340 690 L 1240 680" width={2.8} opacity={0.14} delay={3} />
          <Branch d="M 1340 690 L 1360 740" width={1.8} opacity={0.11} delay={4} />
          <Leaf d="M 1358 738 C 1370 728 1380 734 1376 744 C 1368 752 1360 746 1358 742 Z" opacity={0.12} delay={4} />

          {/* Scattered depth leaves */}
          <Leaf d="M 700 100 C 712 90 722 96 718 106 C 710 114 702 108 700 104 Z"
            opacity={0.04} delay={5} className="botanical-depth-far" />
          <Leaf d="M 900 800 C 912 790 922 796 918 806 C 910 814 902 808 900 804 Z"
            opacity={0.03} delay={5} className="botanical-depth-far" />
        </svg>
      </BotanicalSection>

      {/* ════════════════════════════════════════
          EXPERIMENTING — Vertical stems with angled branches,
          like a small tree. Flowers at tips.
          ════════════════════════════════════════ */}
      <BotanicalSection className="botanical-group--experimenting" style={reduced ? {} : { y: y1 }}>
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>

          {/* Left stem — straight up from bottom-left */}
          <Branch d="M 50 880 L 60 700 L 55 520 L 65 340" width={2.8} opacity={0.14} delay={0} />
          {/* Angled sub-branches */}
          <Branch d="M 58 700 L 110 660" width={2} opacity={0.12} delay={1} />
          <Branch d="M 57 520 L 15 480" width={1.8} opacity={0.11} delay={2} />
          <Branch d="M 62 400 L 110 370" width={1.6} opacity={0.1} delay={3} />
          {/* Leaves */}
          <Leaf d="M 108 658 C 120 648 130 654 126 664 C 118 672 110 666 108 662 Z" opacity={0.12} delay={1} />
          <Leaf d="M 17 478 C 5 468 -5 474 1 484 C 9 492 15 486 17 482 Z" opacity={0.11} delay={2} />
          <Leaf d="M 108 368 C 120 358 130 364 126 374 C 118 382 110 376 108 372 Z" opacity={0.1} delay={3} />
          <Flower cx={65} cy={338} fill="var(--accent)" opacity={0.12} scale={0.7} delay={4} />

          {/* Right stem — straight up from bottom-right */}
          <Branch d="M 1390 880 L 1380 700 L 1385 520 L 1375 340" width={2.8} opacity={0.14} delay={1} />
          <Branch d="M 1382 700 L 1330 660" width={2} opacity={0.12} delay={2} />
          <Branch d="M 1383 520 L 1425 480" width={1.8} opacity={0.11} delay={3} />
          <Branch d="M 1378 400 L 1330 370" width={1.6} opacity={0.1} delay={4} />
          <Leaf d="M 1332 658 C 1320 648 1310 654 1314 664 C 1322 672 1330 666 1332 662 Z" opacity={0.12} delay={2} />
          <Leaf d="M 1423 478 C 1435 468 1445 474 1439 484 C 1431 492 1425 486 1423 482 Z" opacity={0.11} delay={3} />
          <Leaf d="M 1332 368 C 1320 358 1310 364 1314 374 C 1322 382 1330 376 1332 372 Z" opacity={0.1} delay={4} />
          <Flower cx={1375} cy={338} fill="var(--accent)" opacity={0.12} scale={0.7} delay={5} />
        </svg>
      </BotanicalSection>

      {/* ════════════════════════════════════════
          BUILDING — Thick straight branches forming a
          corner frame. Dense leaves + flowers.
          ════════════════════════════════════════ */}
      <BotanicalSection className="botanical-group--building" style={reduced ? {} : { y: y2 }}>
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>

          {/* Left main branch — straight diagonal from top-left */}
          <Branch d="M -20 20 L 80 180 L 140 340 L 160 500" width={4} delay={0} />
          {/* Sub-branches */}
          <Branch d="M 60 140 L 130 120" width={2.6} opacity={0.18} delay={1} />
          <Branch d="M 110 260 L 50 280" width={2.2} opacity={0.15} delay={2} />
          <Branch d="M 148 400 L 200 380" width={2} opacity={0.13} delay={3} />
          <Branch d="M 155 460 L 110 490" width={1.8} opacity={0.12} delay={4} />
          {/* Leaves */}
          <Leaf d="M 128 118 C 140 108 150 114 146 124 C 138 132 130 126 128 122 Z" delay={1} />
          <LeafVein d="M 130 120 C 138 112 144 110 146 112" delay={1} />
          <Leaf d="M 52 278 C 40 268 30 274 34 284 C 42 292 50 286 52 282 Z" opacity={0.14} delay={2} />
          <Leaf d="M 198 378 C 210 368 220 374 216 384 C 208 392 200 386 198 382 Z" opacity={0.12} delay={3} />
          <Leaf d="M 112 488 C 100 478 90 484 94 494 C 102 502 110 496 112 492 Z" opacity={0.11} delay={4} />
          <Flower cx={160} cy={498} fill="var(--gold)" opacity={0.12} scale={0.8} delay={4} />

          {/* Right main branch — straight diagonal from top-right */}
          <Branch d="M 1460 20 L 1360 180 L 1300 340 L 1280 500" width={4} delay={2} />
          <Branch d="M 1380 140 L 1310 120" width={2.6} opacity={0.18} delay={3} />
          <Branch d="M 1330 260 L 1390 280" width={2.2} opacity={0.15} delay={4} />
          <Branch d="M 1292 400 L 1240 380" width={2} opacity={0.13} delay={5} />
          <Branch d="M 1285 460 L 1330 490" width={1.8} opacity={0.12} delay={6} />
          <Leaf d="M 1312 118 C 1300 108 1290 114 1294 124 C 1302 132 1310 126 1312 122 Z" delay={3} />
          <LeafVein d="M 1310 120 C 1302 112 1296 110 1294 112" delay={3} />
          <Leaf d="M 1388 278 C 1400 268 1410 274 1406 284 C 1398 292 1390 286 1388 282 Z" opacity={0.14} delay={4} />
          <Leaf d="M 1242 378 C 1230 368 1220 374 1224 384 C 1232 392 1240 386 1242 382 Z" opacity={0.12} delay={5} />
          <Leaf d="M 1328 488 C 1340 478 1350 484 1346 494 C 1338 502 1330 496 1328 492 Z" opacity={0.11} delay={6} />
          <Flower cx={1280} cy={498} fill="var(--gold)" opacity={0.12} scale={0.8} delay={6} />
        </svg>
      </BotanicalSection>

      {/* ════════════════════════════════════════
          TRANSFORMING — Sparse straight branches,
          minimal leaves + scattered buds.
          ════════════════════════════════════════ */}
      <BotanicalSection className="botanical-group--transforming" style={reduced ? {} : { y: y4 }}>
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%" }}>

          {/* Left — thin straight branch */}
          <Branch d="M -10 400 L 60 380 L 100 360" width={2.2} opacity={0.1} delay={0} />
          <Branch d="M 60 380 L 50 340" width={1.6} opacity={0.08} delay={1} />
          <Leaf d="M 52 338 C 40 328 30 334 34 344 C 42 352 50 346 52 342 Z" opacity={0.08} delay={1} />
          <Leaf d="M 98 358 C 110 348 120 354 116 364 C 108 372 100 366 98 362 Z" opacity={0.07} delay={2} />

          {/* Right — thin straight branch */}
          <Branch d="M 1450 500 L 1380 480 L 1340 460" width={2.2} opacity={0.1} delay={1} />
          <Branch d="M 1380 480 L 1390 440" width={1.6} opacity={0.08} delay={2} />
          <Leaf d="M 1388 438 C 1400 428 1410 434 1406 444 C 1398 452 1390 446 1388 442 Z" opacity={0.08} delay={2} />
          <Leaf d="M 1342 458 C 1330 448 1320 454 1324 464 C 1332 472 1340 466 1342 462 Z" opacity={0.07} delay={3} />

          {/* Scattered floating leaves */}
          <Leaf d="M 300 150 C 312 140 322 146 318 156 C 310 164 302 158 300 154 Z"
            opacity={0.04} delay={3} className="botanical-depth-far" />
          <Leaf d="M 1100 200 C 1112 190 1122 196 1118 206 C 1110 214 1102 208 1100 204 Z"
            opacity={0.04} delay={3} className="botanical-depth-far" />
          <Leaf d="M 600 780 C 612 770 622 776 618 786 C 610 794 602 788 600 784 Z"
            opacity={0.03} delay={4} className="botanical-depth-far" />
          <Leaf d="M 900 820 C 912 810 922 816 918 826 C 910 834 902 828 900 824 Z"
            opacity={0.03} delay={4} className="botanical-depth-far" />

          {/* Buds */}
          <Bud cx={300} cy={150} r={2.5} opacity={0.05} delay={4} />
          <Bud cx={1100} cy={200} r={2.5} opacity={0.05} delay={4} />
        </svg>
      </BotanicalSection>
    </div>
  );
}

export default BotanicalBackground;
