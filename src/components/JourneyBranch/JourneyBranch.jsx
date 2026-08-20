import { useRef, useState, useEffect, useCallback } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import "./JourneyBranch.css";

// Decorative custom leaf component
function JourneyLeaf({ x, y, rotate = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M 0 0 C 15 -10, 30 -5, 35 10 C 25 15, 10 10, 0 0 Z"
        fill="url(#bgLeafGrad)"
        stroke="var(--sage-muted)"
        strokeWidth="0.8"
      />
      <path
        d="M 0 0 C 12 -2, 24 -1, 30 5"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.6"
        fill="none"
      />
    </g>
  );
}

// Decorative matching custom flower component
function JourneyFlower({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M 0 0 C 6 -10, 16 -10, 10 0 C 16 10, 6 10, 0 0 Z"
          fill="url(#bgFlowerGrad)"
          stroke="var(--accent-muted)"
          strokeWidth="0.6"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="3.2" fill="var(--gold)" fillOpacity="0.8" />
      <circle cx="0" cy="0" r="1.4" fill="#fff" />
    </g>
  );
}

// Highly optimized segment properties for custom crawling animation
const SEGS = [
  { r: 13, fill: "var(--accent)" },
  { r: 12, fill: "var(--accent)" },
  { r: 11.5, fill: "var(--accent)" },
  { r: 11, fill: "var(--sage)" },
  { r: 10.5, fill: "var(--sage)" },
  { r: 10, fill: "var(--sage)" },
  { r: 9, fill: "var(--gold)" }
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ═══════════════════════════════════════
   MOBILE — Vertical Crawler (About → Experience)
   ═══════════════════════════════════════ */
function MobileCrawler({ reduced }) {
  const wrapperRef = useRef(null);
  const pathRef = useRef(null);

  const [crawlerPos, setCrawlerPos] = useState({
    segments: Array(7).fill({ x: 30, y: 40, r: 7 }),
    headAngle: 0,
    opacity: 0,
    clampedT: 0,
    cocoonMorph: 0,
  });

  const crawlPhase = useRef(0);
  const prevDist = useRef(0);
  const animFrame = useRef(null);

  const viewW = 60;
  const viewH = 520;
  const padY = 30;
  const trackX = 30;

  const updateCrawler = useCallback(() => {
    if (reduced || !pathRef.current || !wrapperRef.current) return;

    const aboutEl = document.querySelector(".about");
    const skillsEl = document.querySelector(".skills");
    if (!aboutEl || !skillsEl) return;

    const aboutRect = aboutEl.getBoundingClientRect();
    const skillsRect = skillsEl.getBoundingClientRect();

    const startY = aboutRect.top + aboutRect.height * 0.3;
    const endY = skillsRect.top + skillsRect.height * 0.3;
    const range = endY - startY;
    if (range <= 0) return;

    const viewportMid = window.innerHeight * 0.5;
    const rawT = (viewportMid - startY) / range;
    const t = Math.max(0, Math.min(1, rawT));

    const len = pathRef.current.getTotalLength();
    const targetDist = t * len;

    const delta = targetDist - prevDist.current;
    if (Math.abs(delta) > 0.05) {
      crawlPhase.current += Math.abs(delta) * 0.14;
    }
    prevDist.current = targetDist;

    // Cocoon morphing logic over the last 50px of the track
    const cocoonStartDist = len - 50;
    const isCocoon = targetDist >= cocoonStartDist;
    const cocoonMorph = isCocoon ? Math.min(1, (targetDist - cocoonStartDist) / 50) : 0;

    let opacity = 0;
    if (t > 0.01) {
      if (t < 0.08) opacity = t / 0.08;
      else if (t > 0.96) opacity = Math.max(0, (1 - t) / 0.04);
      else opacity = 1;
    }

    const segments = SEGS.map((s, idx) => {
      const spacing = idx * 6;
      const contraction = Math.sin(crawlPhase.current - idx * 0.7) * 1.5;
      const spacingFactor = 1 - cocoonMorph * 0.75;
      let segDist = targetDist - (spacing + contraction) * spacingFactor;
      segDist = Math.max(0, Math.min(len, segDist));
      const pt = pathRef.current.getPointAtLength(segDist);
      let segX = pt.x, segY = pt.y;
      if (cocoonMorph > 0) {
        segX = trackX + (pt.x - trackX) * (1 - cocoonMorph);
        segY = pt.y - (idx * 1.2) * cocoonMorph;
      }
      return { x: segX, y: segY, r: s.r * 0.55 };
    });

    const headDist = Math.max(0, Math.min(len, targetDist));
    const p1 = pathRef.current.getPointAtLength(Math.max(0, headDist - 4));
    const p2 = pathRef.current.getPointAtLength(Math.min(len, headDist + 4));
    let headAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    if (cocoonMorph > 0) {
      headAngle = headAngle * (1 - cocoonMorph) + 90 * cocoonMorph;
    }

    setCrawlerPos({ segments, headAngle, opacity, clampedT: t, cocoonMorph });
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let active = true;
    const loop = () => {
      if (!active) return;
      updateCrawler();
      animFrame.current = requestAnimationFrame(loop);
    };
    animFrame.current = requestAnimationFrame(loop);
    return () => { active = false; cancelAnimationFrame(animFrame.current); };
  }, [reduced, updateCrawler]);

  if (reduced) return null;

  const pathD = `M ${trackX} ${padY} C ${trackX + 8} ${padY + 80}, ${trackX - 8} ${viewH * 0.4}, ${trackX} ${viewH / 2} C ${trackX + 8} ${viewH * 0.6}, ${trackX - 8} ${viewH - padY - 80}, ${trackX} ${viewH - padY}`;

  return (
    <div className="mobile-crawler" ref={wrapperRef} aria-hidden="true">
      <svg
        className="mobile-crawler-svg"
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="mTrackGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="mShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <linearGradient id="mHeadGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        {/* Invisible track path used for positioning calculations */}
        <path
          ref={pathRef}
          d={pathD}
          stroke="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Crawling caterpillar */}
        {crawlerPos.opacity > 0.01 && (
          <g style={{ opacity: crawlerPos.opacity }}>
            {crawlerPos.segments.map((seg, idx) => (
              <ellipse key={`ms-${idx}`} cx={seg.x + 4} cy={seg.y} rx="2" ry={seg.r * 0.9}
                fill="url(#mShadowGrad)" />
            ))}

            {crawlerPos.segments.slice(1, 5).map((seg, idx) => (
              <g key={`ml-${idx}`} stroke="var(--sage)" strokeWidth="1" strokeLinecap="round"
                fill="none" strokeOpacity={0.7 * (1 - (crawlerPos.cocoonMorph || 0))}>
                <path d={`M ${seg.x + 2} ${seg.y - 1.5} q 4 -0.8 5 -3`} />
                <path d={`M ${seg.x + 2} ${seg.y + 1.5} q 4 0.8 5 3`} />
              </g>
            ))}

            {crawlerPos.segments.map((seg, idx) => (
              <g key={`mc-${idx}`}>
                <circle cx={seg.x} cy={seg.y} r={seg.r} fill={SEGS[idx].fill}
                  stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                <ellipse cx={seg.x - seg.r * 0.35} cy={seg.y - seg.r * 0.3}
                  rx={seg.r * 0.22} ry={seg.r * 0.38} fill="rgba(255,255,255,0.14)" />
                {idx > 0 && idx < 6 && (
                  <circle cx={seg.x + 1} cy={seg.y} r="1" fill="var(--gold)" fillOpacity="0.75" />
                )}
              </g>
            ))}

            <g transform={`translate(${crawlerPos.segments[0].x}, ${crawlerPos.segments[0].y}) rotate(${crawlerPos.headAngle - 90})`}>
              <circle cx="0" cy="0" r="9" fill="url(#mHeadGrad)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
              <ellipse cx="-2.5" cy="-2.5" rx="2.5" ry="1.8" fill="rgba(255,255,255,0.16)" />

              <g className="journey-antenna">
                <path d="M -2.5 -8 C -4 -13, -7 -17, -5 -20" stroke="var(--gold)" strokeWidth="1"
                  fill="none" strokeLinecap="round" />
                <circle cx="-5" cy="-21" r="1.3" fill="var(--accent)" />
              </g>
              <g className="journey-antenna" style={{ animationDelay: "0.2s" }}>
                <path d="M 2.5 -8 C 4 -13, 7 -17, 5 -20" stroke="var(--gold)" strokeWidth="1"
                  fill="none" strokeLinecap="round" />
                <circle cx="5" cy="-21" r="1.3" fill="var(--accent)" />
              </g>

              <circle cx="-2.5" cy="-2.5" r="1.8" fill="#110f17" />
              <circle cx="-3" cy="-3.2" r="0.6" fill="#fff" />
              <circle cx="2.5" cy="-2.5" r="1.8" fill="#110f17" />
              <circle cx="2" cy="-3.2" r="0.6" fill="#fff" />

              <circle cx="-4" cy="0.5" r="1.5" fill="var(--accent)" fillOpacity="0.6" />
              <circle cx="4" cy="0.5" r="1.5" fill="var(--accent)" fillOpacity="0.6" />

              <path d="M -1.5 2 q 1.5 1.2 3 0" stroke="var(--text-secondary)" strokeWidth="0.8"
                strokeLinecap="round" fill="none" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════
   DESKTOP — Full Branch with Caterpillar
   ═══════════════════════════════════════ */
function DesktopBranch({ reduced }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  const [height, setHeight] = useState(2500);
  const [pathLength, setPathLength] = useState(0);
  const [stageCoords, setStageCoords] = useState({ yAbout: 200, yExp: 1000, ySkills: 1800 });
  const [leafPoints, setLeafPoints] = useState([]);
  const [flowerPoints, setFlowerPoints] = useState([]);
  const [twigs, setTwigs] = useState([]);
  const [caterpillarPos, setCaterpillarPos] = useState({
    segments: Array(7).fill({ x: 100, y: 100, r: 11 }),
    headAngle: 0,
    isEating: false,
    isCocoon: false,
    cocoonMorph: 0,
    opacity: 0,
    clampedT: 0
  });

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const updateMetrics = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    setHeight(containerRect.height);

    const aboutStage = document.querySelector(".about .meta--stage-anchor") || document.querySelector(".about .meta--stage");
    const expStage = document.querySelector(".experience .meta--stage-anchor") || document.querySelector(".experience .meta--stage");
    const skillsStage = document.querySelector(".skills .meta--stage-anchor") || document.querySelector(".skills .meta--stage");

    const yAbout = aboutStage
      ? aboutStage.getBoundingClientRect().top - containerRect.top + aboutStage.getBoundingClientRect().height / 2
      : containerRect.height * 0.15;
    const yExp = expStage
      ? expStage.getBoundingClientRect().top - containerRect.top + expStage.getBoundingClientRect().height / 2
      : containerRect.height * 0.5;
    const ySkills = skillsStage
      ? skillsStage.getBoundingClientRect().top - containerRect.top + skillsStage.getBoundingClientRect().height / 2
      : containerRect.height * 0.85;

    setStageCoords({ yAbout, yExp, ySkills });

    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);

      const leafPcts = [0.08, 0.22, 0.35, 0.48, 0.62, 0.75, 0.88];
      const leafPts = leafPcts.map((pct, i) => {
        const dist = pct * len;
        const pt = pathRef.current.getPointAtLength(dist);
        const p1 = pathRef.current.getPointAtLength(Math.max(0, dist - 5));
        const p2 = pathRef.current.getPointAtLength(Math.min(len, dist + 5));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
        return { x: pt.x, y: pt.y, angle: angle + (i % 2 === 0 ? 55 : -125), scale: 0.65 + (i % 3) * 0.1 };
      });
      setLeafPoints(leafPts);

      const flowerPcts = [0.15, 0.42, 0.68, 0.92];
      const flowerPts = flowerPcts.map((pct, i) => {
        const dist = pct * len;
        const pt = pathRef.current.getPointAtLength(dist);
        const p1 = pathRef.current.getPointAtLength(Math.max(0, dist - 5));
        const p2 = pathRef.current.getPointAtLength(Math.min(len, dist + 5));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
        const rad = angle * (Math.PI / 180);
        const offset = 8;
        const sign = i % 2 === 0 ? 1 : -1;
        const ox = -Math.sin(rad) * offset * sign;
        const oy = Math.cos(rad) * offset * sign;
        return { x: pt.x + ox, y: pt.y + oy, scale: 0.7 + (i % 2) * 0.1 };
      });
      setFlowerPoints(flowerPts);

      const twigPcts = [0.12, 0.32, 0.58, 0.82];
      const computedTwigs = twigPcts.map((pct, i) => {
        const dist = pct * len;
        const startPt = pathRef.current.getPointAtLength(dist);
        const p1 = pathRef.current.getPointAtLength(Math.max(0, dist - 5));
        const p2 = pathRef.current.getPointAtLength(Math.min(len, dist + 5));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
        const rad = angle * (Math.PI / 180);
        const sign = i % 2 === 0 ? -1 : 1;
        const length = 38;
        const endX = startPt.x + Math.sin(rad) * length * sign;
        const endY = startPt.y - Math.cos(rad) * length * sign;
        const ctrlX = startPt.x + Math.sin(rad) * (length * 0.5) * sign + Math.cos(rad) * 6;
        const ctrlY = startPt.y - Math.cos(rad) * (length * 0.5) * sign + Math.sin(rad) * 6;
        const tVal = 0.55;
        const midX = (1 - tVal) * (1 - tVal) * startPt.x + 2 * (1 - tVal) * tVal * ctrlX + tVal * tVal * endX;
        const midY = (1 - tVal) * (1 - tVal) * startPt.y + 2 * (1 - tVal) * tVal * ctrlY + tVal * tVal * endY;
        const twigAngle = angle + (sign === -1 ? -90 : 90);
        const subLength = 16;
        const subAngle = twigAngle + 45 * sign;
        const subRad = subAngle * (Math.PI / 180);
        const subEndX = midX + Math.cos(subRad) * subLength;
        const subEndY = midY + Math.sin(subRad) * subLength;
        return {
          d: `M ${startPt.x} ${startPt.y} Q ${ctrlX} ${ctrlY}, ${endX} ${endY}`,
          subD: `M ${midX} ${midY} L ${subEndX} ${subEndY}`,
          endX, endY, midX, midY, subEndX, subEndY,
          angle: twigAngle, subAngle, side: sign
        };
      });
      setTwigs(computedTwigs);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    updateMetrics();
    const observer = new ResizeObserver(() => updateMetrics());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { updateMetrics(); }, [stageCoords, height]);

  const midY1 = (stageCoords.yAbout + stageCoords.yExp) / 2;
  const midY2 = (stageCoords.yExp + stageCoords.ySkills) / 2;
  const pathD = `
    M 100 ${stageCoords.yAbout}
    C 160 ${stageCoords.yAbout + 100}, 160 ${midY1 - 100}, 100 ${midY1}
    C 40 ${midY1 + 100}, 40 ${stageCoords.yExp - 100}, 100 ${stageCoords.yExp}
    C 160 ${stageCoords.yExp + 100}, 160 ${midY2 - 100}, 100 ${midY2}
    C 40 ${midY2 + 100}, 40 ${stageCoords.ySkills - 100}, 100 ${stageCoords.ySkills}
    L 100 ${stageCoords.ySkills + 45}
  `;

  const crawlPhase = useRef(0);
  const prevDist = useRef(0);

  useEffect(() => {
    if (reduced || pathLength === 0 || !pathRef.current) return;
    const unsubscribe = scrollY.on("change", () => {
      if (!containerRef.current || !pathRef.current || pathLength === 0) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const yViewportCenter = window.innerHeight * 0.5 - containerRect.top;
      const startY = stageCoords.yAbout;
      const endY = stageCoords.ySkills;
      const clampedT = Math.max(0, Math.min(1, (yViewportCenter - startY) / (endY - startY)));
      const targetDist = clampedT * pathLength;
      const delta = targetDist - prevDist.current;
      if (Math.abs(delta) > 0.05) { crawlPhase.current += Math.abs(delta) * 0.16; }
      prevDist.current = targetDist;
      const currentY = pathRef.current.getPointAtLength(targetDist).y;
      const distToLeaf = Math.abs(currentY - stageCoords.yExp);
      const isEating = distToLeaf < 45 && clampedT > 0.2 && clampedT < 0.8;
      const cocoonStartDist = pathLength - 60;
      const isCocoon = targetDist >= cocoonStartDist;
      const cocoonMorph = isCocoon ? Math.min(1, (targetDist - cocoonStartDist) / 60) : 0;
      let opacity = 1;
      if (clampedT < 0.05) { opacity = clampedT / 0.05; }
      else if (clampedT > 0.97) { opacity = Math.max(0, (1 - clampedT) / 0.03); }
      const segments = SEGS.map((s, idx) => {
        const baseSpacing = idx * 12;
        const contraction = Math.sin(crawlPhase.current - idx * 0.7) * 2.5;
        const spacingFactor = 1 - cocoonMorph * 0.75;
        let segDist = targetDist - (baseSpacing + contraction) * spacingFactor;
        segDist = Math.max(0, Math.min(pathLength, segDist));
        const pt = pathRef.current.getPointAtLength(segDist);
        let segX = pt.x, segY = pt.y;
        if (cocoonMorph > 0) {
          segX = 100 + (pt.x - 100) * (1 - cocoonMorph);
          segY = pt.y - (idx * 2) * cocoonMorph;
        }
        return { x: segX, y: segY, r: s.r };
      });
      const headDist = Math.max(0, Math.min(pathLength, targetDist));
      const p1 = pathRef.current.getPointAtLength(Math.max(0, headDist - 5));
      const p2 = pathRef.current.getPointAtLength(Math.min(pathLength, headDist + 5));
      let headAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
      if (cocoonMorph > 0) { headAngle = headAngle * (1 - cocoonMorph) + 90 * cocoonMorph; }
      let finalHeadAngle = headAngle;
      if (isEating) { finalHeadAngle += Math.sin(Date.now() * 0.05) * 8; }
      setCaterpillarPos({ segments, headAngle: finalHeadAngle, isEating, isCocoon, cocoonMorph, opacity, clampedT });
    });
    return () => unsubscribe();
  }, [scrollYProgress, pathLength, stageCoords, reduced]);

  return (
    <div className="journey-branch-wrapper" ref={containerRef} aria-hidden="true">
      <svg className="journey-branch-svg" style={{ height: `${height}px` }} viewBox={`0 0 200 ${height}`}>
        <defs>
          <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="twigGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--sage-muted)" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <linearGradient id="bgLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--sage)" />
            <stop offset="100%" stopColor="var(--sage-muted)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="bgFlowerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-muted)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="eatLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="var(--sage)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="caterpillarBodyGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--sage)" />
            <stop offset="55%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-hover)" />
          </linearGradient>
          <linearGradient id="caterpillarHeadGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          <radialGradient id="caterpillarShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="58%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
          </radialGradient>
          <mask id="eatingBiteMask">
            <rect x="0" y="0" width="500" height="400" fill="white" />
            {caterpillarPos.clampedT > 0.42 && <circle cx="236" cy="196" r="16" fill="black" />}
            {caterpillarPos.clampedT > 0.48 && <circle cx="250" cy="172" r="13" fill="black" />}
            {caterpillarPos.clampedT > 0.54 && <circle cx="228" cy="218" r="11" fill="black" />}
          </mask>
        </defs>

        <path ref={pathRef} d={pathD} className="journey-main-branch" fill="none"
          stroke="url(#branchGrad)" strokeWidth="6" strokeLinecap="round" />
        <path d={pathD} fill="none" stroke="var(--gold)" strokeWidth="1.6"
          strokeOpacity="0.35" strokeLinecap="round" />

        {leafPoints.map((pt, idx) => (
          <JourneyLeaf key={`bl-${idx}`} x={pt.x} y={pt.y} rotate={pt.angle} scale={pt.scale} />
        ))}
        {flowerPoints.map((pt, idx) => (
          <JourneyFlower key={`bf-${idx}`} x={pt.x} y={pt.y} scale={pt.scale} />
        ))}

        {twigs.map((t, idx) => (
          <g key={`dt-${idx}`}>
            <path d={t.d} stroke="var(--gold)" strokeWidth="2.8" strokeOpacity="0.45" fill="none" strokeLinecap="round" />
            <path d={t.subD} stroke="var(--gold)" strokeWidth="2.0" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
            <JourneyFlower x={t.endX} y={t.endY} scale={0.8} />
            <JourneyLeaf x={t.endX - Math.cos(t.angle * Math.PI / 180) * 4}
              y={t.endY - Math.sin(t.angle * Math.PI / 180) * 4}
              rotate={t.angle + 30 * t.side} scale={0.7} />
            <JourneyFlower x={t.subEndX} y={t.subEndY} scale={0.65} />
            <JourneyLeaf x={t.subEndX - Math.cos(t.subAngle * Math.PI / 180) * 3}
              y={t.subEndY - Math.sin(t.subAngle * Math.PI / 180) * 3}
              rotate={t.subAngle - 30 * t.side} scale={0.6} />
            <JourneyLeaf x={t.midX} y={t.midY} rotate={t.angle - 45 * t.side} scale={0.65} />
          </g>
        ))}

        <g transform={`translate(100, ${stageCoords.yExp}) scale(0.35) rotate(15) translate(-236, -196)`}>
          <path d="M 300 30 C 360 60 400 130 396 200 C 392 258 330 288 286 286 C 240 284 226 240 246 200 C 258 176 268 120 300 30 Z"
            fill="url(#eatLeafGrad)" mask="url(#eatingBiteMask)" />
          <path d="M 292 40 C 300 120 296 190 286 282" stroke="var(--sage)" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
          <path d="M 296 130 C 330 110 358 120 372 140" stroke="var(--sage)" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
          <path d="M 292 200 C 320 186 352 196 366 218" stroke="var(--sage)" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
        </g>

        {caterpillarPos.isEating && (
          <g transform={`translate(100, ${stageCoords.yExp}) scale(0.35) rotate(15) translate(-236, -196)`}>
            <circle cx="226" cy="196" r="2.2" fill="var(--sage)" className="eating-crumb" style={{ animationDelay: "0s" }} />
            <circle cx="232" cy="186" r="1.5" fill="var(--sage)" className="eating-crumb" style={{ animationDelay: "0.25s" }} />
            <circle cx="220" cy="206" r="1.8" fill="var(--sage)" className="eating-crumb" style={{ animationDelay: "0.5s" }} />
          </g>
        )}

        <JourneyLeaf x={100} y={stageCoords.ySkills - 90} rotate={75} scale={0.8} />
        <JourneyLeaf x={82} y={stageCoords.ySkills - 65} rotate={-35} scale={0.75} />
        <JourneyFlower x={118} y={stageCoords.ySkills - 75} scale={0.75} />

        {caterpillarPos.opacity > 0.01 && (
          <g style={{ opacity: caterpillarPos.opacity }}>
            {caterpillarPos.segments.map((seg, idx) => (
              <ellipse key={`cs-${idx}`} cx={seg.x} cy={seg.y + 9} rx={seg.r * 1.0} ry="3" fill="url(#shadowGrad)" />
            ))}
            {caterpillarPos.segments.slice(1, 5).map((seg, idx) => (
              <g key={`cl-${idx}`} stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" fill="none" strokeOpacity="0.8">
                <path d={`M ${seg.x - 2} ${seg.y + 3} q -1 6 -4 7`} />
                <path d={`M ${seg.x + 2} ${seg.y + 3} q 1 6 4 7`} />
              </g>
            ))}
            {caterpillarPos.segments.map((seg, idx) => (
              <g key={`cg-${idx}`}>
                <circle cx={seg.x} cy={seg.y} r={seg.r} fill={SEGS[idx].fill}
                  stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))" />
                <circle cx={seg.x} cy={seg.y} r={seg.r} fill="url(#caterpillarShadowGrad)" />
              </g>
            ))}
            {caterpillarPos.segments.map((seg, idx) => (
              <g key={`cd-${idx}`}>
                <ellipse cx={seg.x - seg.r * 0.32} cy={seg.y - seg.r * 0.4}
                  rx={seg.r * 0.42} ry={seg.r * 0.26} fill="rgba(255, 255, 255, 0.16)" />
                {idx > 0 && idx < 6 && (
                  <circle cx={seg.x} cy={seg.y - 1.5} r="1.8" fill="var(--gold)" fillOpacity="0.8" />
                )}
              </g>
            ))}
            <g transform={`translate(${caterpillarPos.segments[0].x}, ${caterpillarPos.segments[0].y}) rotate(${caterpillarPos.headAngle - 90})`}>
              <circle cx="0" cy="0" r="16" fill="url(#caterpillarHeadGrad)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="16" fill="url(#caterpillarShadowGrad)" />
              <ellipse cx="-5" cy="-5" rx="5" ry="3.2" fill="rgba(255,255,255,0.18)" />
              <g className="journey-antenna">
                <path d="M -5 -14 C -10 -24, -14 -32, -10 -38" stroke="var(--gold)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <circle cx="-10" cy="-39" r="2.2" fill="var(--accent)" />
                <circle cx="-10" cy="-39" r="1" fill="#fff" fillOpacity="0.5" />
              </g>
              <g className="journey-antenna" style={{ animationDelay: "0.2s" }}>
                <path d="M 5 -14 C 10 -24, 14 -32, 10 -38" stroke="var(--gold)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <circle cx="10" cy="-39" r="2.2" fill="var(--accent)" />
                <circle cx="10" cy="-39" r="1" fill="#fff" fillOpacity="0.5" />
              </g>
              <g>
                <circle cx="-4.5" cy="-4.5" r="3.2" fill="#110f17" />
                <circle cx="-5.5" cy="-5.5" r="1.0" fill="#fff" />
              </g>
              <g>
                <circle cx="4.5" cy="-4.5" r="3.2" fill="#110f17" />
                <circle cx="3.5" cy="-5.5" r="1.0" fill="#fff" />
              </g>
              <circle cx="-8" cy="1" r="2.6" fill="var(--accent)" fillOpacity="0.65" />
              <circle cx="8" cy="1" r="2.6" fill="var(--accent)" fillOpacity="0.65" />
              {caterpillarPos.isEating ? (
                <path d="M -3 4 Q 0 9 3 4 Q 0 7 -3 4 Z" fill="var(--accent)" />
              ) : (
                <path d="M -3 4 q 3 2 6 0" stroke="var(--text-secondary)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN — Chooses Mobile or Desktop
   ═══════════════════════════════════════ */
export function JourneyBranch() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  if (reduced) return null;

  if (isMobile) {
    return <MobileCrawler reduced={reduced} />;
  }

  return <DesktopBranch reduced={reduced} />;
}
