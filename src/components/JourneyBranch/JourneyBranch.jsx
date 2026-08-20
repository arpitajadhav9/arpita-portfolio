import { useRef, useState, useEffect } from "react";
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
      {/* Delicate inner leaf veins */}
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
      {/* 5-petaled soft rose flower */}
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
      {/* Glowing yellow stamen center */}
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
  { r: 9, fill: "var(--gold)" } // tail segment
];

export function JourneyBranch() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const reduced = useReducedMotion();
  
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

  // Calculate pixel coordinates of stages relative to this container
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

      // Compute 8 points along the path for leaves growing directly out of it
      const leafPcts = [0.08, 0.22, 0.35, 0.48, 0.62, 0.75, 0.88];
      const leafPts = leafPcts.map((pct, i) => {
        const dist = pct * len;
        const pt = pathRef.current.getPointAtLength(dist);
        // Calculate tangent angle for leaf orientation
        const p1 = pathRef.current.getPointAtLength(Math.max(0, dist - 5));
        const p2 = pathRef.current.getPointAtLength(Math.min(len, dist + 5));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
        return {
          x: pt.x,
          y: pt.y,
          angle: angle + (i % 2 === 0 ? 55 : -125), // grow out perpendicular left/right
          scale: 0.65 + (i % 3) * 0.1
        };
      });
      setLeafPoints(leafPts);

      // Compute 4 points along the path for flowers
      const flowerPcts = [0.15, 0.42, 0.68, 0.92];
      const flowerPts = flowerPcts.map((pct, i) => {
        const dist = pct * len;
        const pt = pathRef.current.getPointAtLength(dist);
        // Tangent angle
        const p1 = pathRef.current.getPointAtLength(Math.max(0, dist - 5));
        const p2 = pathRef.current.getPointAtLength(Math.min(len, dist + 5));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
        const rad = angle * (Math.PI / 180);
        // Offset slightly perpendicular to the branch path
        const offset = 8;
        const sign = i % 2 === 0 ? 1 : -1;
        const ox = -Math.sin(rad) * offset * sign;
        const oy = Math.cos(rad) * offset * sign;
        return {
          x: pt.x + ox,
          y: pt.y + oy,
          scale: 0.7 + (i % 2) * 0.1
        };
      });
      setFlowerPoints(flowerPts);

      // Compute 4 twigs that branch off perfectly from the main branch
      const twigPcts = [0.12, 0.32, 0.58, 0.82];
      const computedTwigs = twigPcts.map((pct, i) => {
        const dist = pct * len;
        const startPt = pathRef.current.getPointAtLength(dist);
        
        // Perpendicular angle to path for natural growth direction
        const p1 = pathRef.current.getPointAtLength(Math.max(0, dist - 5));
        const p2 = pathRef.current.getPointAtLength(Math.min(len, dist + 5));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
        const rad = angle * (Math.PI / 180);
        
        const sign = i % 2 === 0 ? -1 : 1; // alternate left/right growth
        const length = 38; // Slightly longer for more sub-branch space!
        
        // End point curved outward
        const endX = startPt.x + Math.sin(rad) * length * sign;
        const endY = startPt.y - Math.cos(rad) * length * sign;
        
        // Control point for a beautiful curved path
        const ctrlX = startPt.x + Math.sin(rad) * (length * 0.5) * sign + Math.cos(rad) * 6;
        const ctrlY = startPt.y - Math.cos(rad) * (length * 0.5) * sign + Math.sin(rad) * 6;
        
        // Calculate mid-point at t = 0.55 along the quadratic curve for sub-branch
        const tVal = 0.55;
        const midX = (1 - tVal) * (1 - tVal) * startPt.x + 2 * (1 - tVal) * tVal * ctrlX + tVal * tVal * endX;
        const midY = (1 - tVal) * (1 - tVal) * startPt.y + 2 * (1 - tVal) * tVal * ctrlY + tVal * tVal * endY;
        
        // Growth direction at mid-point (approx tangent)
        const twigAngle = angle + (sign === -1 ? -90 : 90);
        
        // Grow sub-branch outwards from mid-point
        const subLength = 16;
        const subAngle = twigAngle + 45 * sign; // Angled further outward
        const subRad = subAngle * (Math.PI / 180);
        const subEndX = midX + Math.cos(subRad) * subLength;
        const subEndY = midY + Math.sin(subRad) * subLength;
        
        return {
          d: `M ${startPt.x} ${startPt.y} Q ${ctrlX} ${ctrlY}, ${endX} ${endY}`,
          subD: `M ${midX} ${midY} L ${subEndX} ${subEndY}`,
          endX,
          endY,
          midX,
          midY,
          subEndX,
          subEndY,
          angle: twigAngle,
          subAngle,
          side: sign
        };
      });
      setTwigs(computedTwigs);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    updateMetrics();

    const observer = new ResizeObserver(() => {
      updateMetrics();
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update path length and points when coordinates change
  useEffect(() => {
    updateMetrics();
  }, [stageCoords, height]);

  // Construct organic winding path d-attribute
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

  // Crawl wiggling simulation variables
  const crawlPhase = useRef(0);
  const prevDist = useRef(0);

  // Monitor scroll progress and update caterpillar position frame-by-frame
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
      
      // Calculate delta to drive wiggle phase
      const delta = targetDist - prevDist.current;
      if (Math.abs(delta) > 0.05) {
        crawlPhase.current += Math.abs(delta) * 0.16;
      }
      prevDist.current = targetDist;

      // Determine interactive states based on height coordinates
      const currentY = pathRef.current.getPointAtLength(targetDist).y;
      
      // Eating detection near Experience stage
      const distToLeaf = Math.abs(currentY - stageCoords.yExp);
      const isEating = distToLeaf < 45 && clampedT > 0.2 && clampedT < 0.8;

      // Cocoon morphing as it reaches Skills stage
      const cocoonStartDist = pathLength - 60;
      const isCocoon = targetDist >= cocoonStartDist;
      const cocoonMorph = isCocoon 
        ? Math.min(1, (targetDist - cocoonStartDist) / 60)
        : 0;

      // Opacity: fade in as it leaves start, stay visible through Skills, fade at very end when entering cocoon
      let opacity = 1;
      if (clampedT < 0.05) {
        opacity = clampedT / 0.05;
      } else if (clampedT > 0.97) {
        opacity = Math.max(0, (1 - clampedT) / 0.03);
      }

      // Compute positions of all 7 segments along path (scaled down to 12px spacing)
      const segments = SEGS.map((s, idx) => {
        // Base distance offset for each segment
        const baseSpacing = idx * 12;
        
        // Crawling contraction-expansion wave
        const contraction = Math.sin(crawlPhase.current - idx * 0.7) * 2.5;
        
        // Morphing compression as it folds into cocoon
        const spacingFactor = 1 - cocoonMorph * 0.75;
        
        let segDist = targetDist - (baseSpacing + contraction) * spacingFactor;
        
        // Clamp to path boundaries
        segDist = Math.max(0, Math.min(pathLength, segDist));
        
        const pt = pathRef.current.getPointAtLength(segDist);
        
        // Morph: fold segments vertically on top of each other when spinning cocoon
        let segX = pt.x;
        let segY = pt.y;
        if (cocoonMorph > 0) {
          segX = 100 + (pt.x - 100) * (1 - cocoonMorph);
          segY = pt.y - (idx * 2) * cocoonMorph;
        }

        return {
          x: segX,
          y: segY,
          r: s.r
        };
      });

      // Calculate tangent angle for head
      const headDist = Math.max(0, Math.min(pathLength, targetDist));
      const p1 = pathRef.current.getPointAtLength(Math.max(0, headDist - 5));
      const p2 = pathRef.current.getPointAtLength(Math.min(pathLength, headDist + 5));
      let headAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

      if (cocoonMorph > 0) {
        // Force vertical hang angle during cocoon spin
        headAngle = headAngle * (1 - cocoonMorph) + 90 * cocoonMorph;
      }

      // Head shaking wiggling while chewing
      let finalHeadAngle = headAngle;
      if (isEating) {
        finalHeadAngle += Math.sin(Date.now() * 0.05) * 8;
      }

      setCaterpillarPos({
        segments,
        headAngle: finalHeadAngle,
        isEating,
        isCocoon,
        cocoonMorph,
        opacity,
        clampedT
      });
    });

    return () => unsubscribe();
  }, [scrollYProgress, pathLength, stageCoords, reduced]);

  // If prefers-reduced-motion is active, hide crawling caterpillar
  if (reduced) return null;

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

        {/* Winding Main Branch */}
        <path
          ref={pathRef}
          d={pathD}
          className="journey-main-branch"
          fill="none"
          stroke="url(#branchGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* Highlight inner vein for depth */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.6"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />

        {/* Dynamic leaves growing directly out of the branch */}
        {leafPoints.map((pt, idx) => (
          <JourneyLeaf
            key={`branch-leaf-${idx}`}
            x={pt.x}
            y={pt.y}
            rotate={pt.angle}
            scale={pt.scale}
          />
        ))}

        {/* Dynamic flowers growing out of the branch */}
        {flowerPoints.map((pt, idx) => (
          <JourneyFlower
            key={`branch-flower-${idx}`}
            x={pt.x}
            y={pt.y}
            scale={pt.scale}
          />
        ))}

        {/* Twigs, Leaves & Flowers along the journey */}
        {twigs.map((t, idx) => (
          <g key={`dynamic-twig-${idx}`}>
            {/* Woody Twig Path connecting PERFECTLY to main branch */}
            <path
              d={t.d}
              stroke="var(--gold)"
              strokeWidth="2.8"
              strokeOpacity="0.45"
              fill="none"
              strokeLinecap="round"
            />
            {/* Woody Sub-Twig Path splitting from mid-point */}
            <path
              d={t.subD}
              stroke="var(--gold)"
              strokeWidth="2.0"
              strokeOpacity="0.4"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Main Twig Tip Flower */}
            <JourneyFlower x={t.endX} y={t.endY} scale={0.8} />
            {/* Leaf attached right under the main flower */}
            <JourneyLeaf 
              x={t.endX - Math.cos(t.angle * Math.PI / 180) * 4} 
              y={t.endY - Math.sin(t.angle * Math.PI / 180) * 4} 
              rotate={t.angle + 30 * t.side} 
              scale={0.7} 
            />

            {/* Sub-Branch Tip Flower */}
            <JourneyFlower x={t.subEndX} y={t.subEndY} scale={0.65} />
            {/* Leaf attached to sub-branch tip */}
            <JourneyLeaf 
              x={t.subEndX - Math.cos(t.subAngle * Math.PI / 180) * 3} 
              y={t.subEndY - Math.sin(t.subAngle * Math.PI / 180) * 3} 
              rotate={t.subAngle - 30 * t.side} 
              scale={0.6} 
            />

            {/* Middle Leaf on Main Branch where it splits */}
            <JourneyLeaf 
              x={t.midX} 
              y={t.midY} 
              rotate={t.angle - 45 * t.side} 
              scale={0.65} 
            />
          </g>
        ))}

        {/* Interactive Eating Leaf at Experience Stage (attached to main branch) */}
        <g transform={`translate(100, ${stageCoords.yExp}) scale(0.35) rotate(15) translate(-236, -196)`}>
          {/* Bitten Leaf Plate */}
          <path
            d="M 300 30 C 360 60 400 130 396 200 C 392 258 330 288 286 286 C 240 284 226 240 246 200 C 258 176 268 120 300 30 Z"
            fill="url(#eatLeafGrad)"
            mask="url(#eatingBiteMask)"
          />
          {/* Main Leaf Vein */}
          <path d="M 292 40 C 300 120 296 190 286 282" stroke="var(--sage)" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
          {/* Side Veins */}
          <path d="M 296 130 C 330 110 358 120 372 140" stroke="var(--sage)" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
          <path d="M 292 200 C 320 186 352 196 366 218" stroke="var(--sage)" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
        </g>

        {/* Crumbs falling while eating */}
        {caterpillarPos.isEating && (
          <g transform={`translate(100, ${stageCoords.yExp}) scale(0.35) rotate(15) translate(-236, -196)`}>
            <circle cx="226" cy="196" r="2.2" fill="var(--sage)" className="eating-crumb" style={{ animationDelay: "0s" }} />
            <circle cx="232" cy="186" r="1.5" fill="var(--sage)" className="eating-crumb" style={{ animationDelay: "0.25s" }} />
            <circle cx="220" cy="206" r="1.8" fill="var(--sage)" className="eating-crumb" style={{ animationDelay: "0.5s" }} />
          </g>
        )}

        {/* 5. Skills Section Cocoon Base Details */}
        {/* Leaves framing the cocoon hanging point */}
        <JourneyLeaf x={100} y={stageCoords.ySkills - 90} rotate={75} scale={0.8} />
        <JourneyLeaf x={82} y={stageCoords.ySkills - 65} rotate={-35} scale={0.75} />
        <JourneyFlower x={118} y={stageCoords.ySkills - 75} scale={0.75} />


        {/* Interactive Crawling Caterpillar */}
        {caterpillarPos.opacity > 0.01 && (
          <g style={{ opacity: caterpillarPos.opacity }}>
            
            {/* Shadows under body segments */}
            {caterpillarPos.segments.map((seg, idx) => (
              <ellipse
                key={`c-shadow-${idx}`}
                cx={seg.x}
                cy={seg.y + 9}
                rx={seg.r * 1.0}
                ry="3"
                fill="url(#shadowGrad)"
              />
            ))}

            {/* Prolegs extending down from middle segments (scaled for smaller size) */}
            {caterpillarPos.segments.slice(1, 5).map((seg, idx) => (
              <g key={`c-leg-${idx}`} stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" fill="none" strokeOpacity="0.8">
                <path d={`M ${seg.x - 2} ${seg.y + 3} q -1 6 -4 7`} />
                <path d={`M ${seg.x + 2} ${seg.y + 3} q 1 6 4 7`} />
              </g>
            ))}

            {/* Body Segments (overlapping circles with 3D gradients) */}
            {caterpillarPos.segments.map((seg, idx) => (
              <g key={`c-seg-group-${idx}`}>
                <circle
                  cx={seg.x}
                  cy={seg.y}
                  r={seg.r}
                  fill={SEGS[idx].fill}
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth="0.8"
                  filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))"
                />
                <circle
                  cx={seg.x}
                  cy={seg.y}
                  r={seg.r}
                  fill="url(#caterpillarShadowGrad)"
                />
              </g>
            ))}

            {/* Segment highlights & spots */}
            {caterpillarPos.segments.map((seg, idx) => (
              <g key={`c-details-${idx}`}>
                {/* 3D highlights */}
                <ellipse
                  cx={seg.x - seg.r * 0.32}
                  cy={seg.y - seg.r * 0.4}
                  rx={seg.r * 0.42}
                  ry={seg.r * 0.26}
                  fill="rgba(255, 255, 255, 0.16)"
                />
                {/* Spots */}
                {idx > 0 && idx < 6 && (
                  <circle
                    cx={seg.x}
                    cy={seg.y - 1.5}
                    r="1.8"
                    fill="var(--gold)"
                    fillOpacity="0.8"
                  />
                )}
              </g>
            ))}

            {/* Caterpillar Head Group (Scaled down to 16px radius) */}
            <g
              transform={`translate(${caterpillarPos.segments[0].x}, ${caterpillarPos.segments[0].y}) rotate(${caterpillarPos.headAngle - 90})`}
            >
              {/* Head Body */}
              <circle cx="0" cy="0" r="16" fill="url(#caterpillarHeadGrad)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="16" fill="url(#caterpillarShadowGrad)" />
              <ellipse cx="-5" cy="-5" rx="5" ry="3.2" fill="rgba(255,255,255,0.18)" />

              {/* Antennae — longer, curvier, more prominent */}
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

              {/* Eyes */}
              <g>
                <circle cx="-4.5" cy="-4.5" r="3.2" fill="#110f17" />
                <circle cx="-5.5" cy="-5.5" r="1.0" fill="#fff" />
              </g>
              <g>
                <circle cx="4.5" cy="-4.5" r="3.2" fill="#110f17" />
                <circle cx="3.5" cy="-5.5" r="1.0" fill="#fff" />
              </g>

              {/* Cheeks */}
              <circle cx="-8" cy="1" r="2.6" fill="var(--accent)" fillOpacity="0.65" />
              <circle cx="8" cy="1" r="2.6" fill="var(--accent)" fillOpacity="0.65" />

              {/* Interactive Mouth */}
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
