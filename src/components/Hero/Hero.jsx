import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { personal, social } from "../../data/portfolio";
import HeroSentence from "./HeroSentence";
import "./Hero.css";

function useParallax(mouseX, mouseY, range, stiffness) {
  const x = useTransform(mouseX, [0, 1], [-range, range]);
  const y = useTransform(mouseY, [0, 1], [range, -range]);
  return {
    x: useSpring(x, { stiffness, damping: 25 }),
    y: useSpring(y, { stiffness, damping: 25 }),
  };
}

function Hero() {
  const reduced = useReducedMotion();
  const [sparks, setSparks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [butterflyParticles, setButterflyParticles] = useState([]);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const sparkPositionsRef = useRef([]);
  const butterflyTimerRef = useRef(null);

  const [ambientParticles] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 1 + Math.random() * 1.5,
      dur: 60 + Math.random() * 30,
      delay: -(Math.random() * 60),
      hue: i < 5 ? "rose" : i < 8 ? "gold" : "sage",
    }))
  );

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const pAurora = useParallax(mouseX, mouseY, 22, 9);
  const pGrid = useParallax(mouseX, mouseY, 16, 11);
  const pMarkers = useParallax(mouseX, mouseY, 12, 14);
  const pRings = useParallax(mouseX, mouseY, 14, 12);

  const cursorGlowX = useMotionValue(0);
  const cursorGlowY = useMotionValue(0);
  const springGlowX = useSpring(cursorGlowX, { stiffness: 30, damping: 20 });
  const springGlowY = useSpring(cursorGlowY, { stiffness: 30, damping: 20 });

  const wingLeftRotate = useMotionValue(0);
  const wingRightRotate = useMotionValue(0);
  const springWingL = useSpring(wingLeftRotate, { stiffness: 40, damping: 12 });
  const springWingR = useSpring(wingRightRotate, { stiffness: 40, damping: 12 });

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.96]);

  const emitButterflyParticle = useCallback(() => {
    const id = performance.now() + Math.random();
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 50;
    setButterflyParticles((prev) => [
      ...prev.slice(-8),
      {
        id,
        startX: 0,
        startY: -10,
        endX: Math.cos(angle) * dist,
        endY: Math.sin(angle) * dist - 20,
        size: 1 + Math.random() * 1.5,
        hue: Math.random() < 0.5 ? "rose" : Math.random() < 0.7 ? "gold" : "sage",
      },
    ]);
    setTimeout(() => {
      setButterflyParticles((prev) => prev.filter((p) => p.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    if (reduced) return;
    butterflyTimerRef.current = setInterval(() => {
      if (Math.random() < 0.4) emitButterflyParticle();
    }, 2500);
    return () => clearInterval(butterflyTimerRef.current);
  }, [reduced, emitButterflyParticle]);

  const emitSpark = useCallback((x, y) => {
    const id = performance.now() + Math.random();
    const nearby = sparkPositionsRef.current.find((s) => {
      const dx = s.x - x;
      const dy = s.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 150;
    });
    if (nearby) {
      const connId = id + "c";
      setConnections((prev) => [...prev.slice(-5), { id: connId, x1: nearby.x, y1: nearby.y, x2: x, y2: y }]);
      setTimeout(() => setConnections((prev) => prev.filter((c) => c.id !== connId)), 800);
    }
    setSparks((prev) => [...prev.slice(-6), { id, x, y }]);
    setTimeout(() => setSparks((prev) => prev.filter((s) => s.id !== id)), 1000);
  }, []);

  useEffect(() => {
    sparkPositionsRef.current = sparks;
  }, [sparks]);

  useEffect(() => {
    if (reduced) return;
    const handleMouse = (e) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mouseX.set(nx);
      mouseY.set(ny);
      cursorGlowX.set(e.clientX);
      cursorGlowY.set(e.clientY);

      const butterflyEl = document.querySelector(".hero-butterfly-wrap");
      if (butterflyEl) {
        const rect = butterflyEl.getBoundingClientRect();
        const bcx = rect.left + rect.width / 2;
        const bcy = rect.top + rect.height / 2;
        const dx = e.clientX - bcx;
        const dy = e.clientY - bcy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 300;
        if (dist < maxDist) {
          const strength = 1 - dist / maxDist;
          const eased = strength * strength;
          wingLeftRotate.set(Math.max(-8, Math.min(3, -dy * eased * 0.04)));
          wingRightRotate.set(Math.max(-3, Math.min(8, dy * eased * 0.04)));
        } else {
          wingLeftRotate.set(0);
          wingRightRotate.set(0);
        }
      }

      const now = performance.now();
      const dt = now - lastPosRef.current.time;
      if (dt > 16) {
        const dx2 = e.clientX - lastPosRef.current.x;
        const dy2 = e.clientY - lastPosRef.current.y;
        const vel = Math.sqrt(dx2 * dx2 + dy2 * dy2) / dt;
        if (vel > 0.1 && Math.random() < 0.12) emitSpark(e.clientX, e.clientY);
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [reduced, mouseX, mouseY, wingLeftRotate, wingRightRotate, cursorGlowX, cursorGlowY, emitSpark]);

  const butterflyPathVariants = useMemo(() => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 1.8, delay: 0.1 + i * 0.12, ease: "easeInOut" }, opacity: { duration: 0.3, delay: 0.1 + i * 0.12 } },
    }),
  }), []);

  const roles = personal.roles;

  return (
    <section className="hero" id="hero">
      {!reduced && (
        <motion.div
          className="hero-cursor-glow"
          style={{ x: springGlowX, y: springGlowY }}
          aria-hidden="true"
        />
      )}

      <div className="hero-bg">
        <div className="hero-radial" />
        <div className="hero-grain" />
        <motion.div className="hero-grid" style={reduced ? {} : { x: pGrid.x, y: pGrid.y }} />
        {!reduced && ambientParticles.map((p) => (
          <div
            key={p.id}
            className={`hero-particle hero-particle--${p.hue}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animation: `particleDrift ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
        <div className="hero-markers-drift">
          <motion.div className="hero-wireframe" style={reduced ? {} : { x: pMarkers.x, y: pMarkers.y }} aria-hidden="true">
            <svg className="hero-wireframe-svg" viewBox="0 0 800 600" fill="none">
              {/* Horizontal scan lines */}
              <motion.line x1="0" y1="120" x2="800" y2="120" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.06" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.2 }} />
              <motion.line x1="0" y1="300" x2="800" y2="300" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.05" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.4 }} />
              <motion.line x1="0" y1="480" x2="800" y2="480" stroke="var(--sage)" strokeWidth="0.5" strokeOpacity="0.04" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.6 }} />
              {/* Vertical scan lines */}
              <motion.line x1="200" y1="0" x2="200" y2="600" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.04" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.3 }} />
              <motion.line x1="400" y1="0" x2="400" y2="600" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.03" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
              <motion.line x1="600" y1="0" x2="600" y2="600" stroke="var(--sage)" strokeWidth="0.5" strokeOpacity="0.04" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.7 }} />
              {/* Diagonal tech lines */}
              <motion.line x1="50" y1="50" x2="250" y2="200" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.05" strokeDasharray="4 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1 }} />
              <motion.line x1="550" y1="100" x2="750" y2="350" stroke="var(--gold)" strokeWidth="0.4" strokeOpacity="0.04" strokeDasharray="4 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.2 }} />
              <motion.line x1="100" y1="400" x2="350" y2="550" stroke="var(--sage)" strokeWidth="0.4" strokeOpacity="0.04" strokeDasharray="4 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.4 }} />
              <motion.line x1="500" y1="450" x2="700" y2="550" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.04" strokeDasharray="4 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.6 }} />
              {/* Intersection nodes */}
              <motion.circle cx="200" cy="120" r="2.5" fill="none" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.12" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} />
              <motion.circle cx="400" cy="300" r="2.5" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0 }} />
              <motion.circle cx="600" cy="480" r="2.5" fill="none" stroke="var(--sage)" strokeWidth="0.6" strokeOpacity="0.1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2 }} />
              <motion.circle cx="200" cy="300" r="1.8" fill="var(--accent)" fillOpacity="0.08" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} />
              <motion.circle cx="600" cy="120" r="1.8" fill="var(--gold)" fillOpacity="0.08" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.3 }} />
              <motion.circle cx="400" cy="480" r="1.8" fill="var(--sage)" fillOpacity="0.08" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4 }} />
            </svg>
          </motion.div>
        </div>
        <motion.div className="hero-aurora" style={reduced ? {} : { x: pAurora.x, y: pAurora.y }}>
          <motion.div
            className="hero-aurora-blob hero-aurora-blob--rose"
            animate={reduced ? {} : { x: [0, 40, -30, 0], y: [0, -50, 30, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="hero-aurora-blob hero-aurora-blob--gold"
            animate={reduced ? {} : { x: [0, -35, 45, 0], y: [0, 40, -40, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div className="hero-rings" style={reduced ? {} : { x: pRings.x, y: pRings.y }}>
          <div className="hero-ring hero-ring-1" />
          <div className="hero-ring hero-ring-2" />
          <div className="hero-ring hero-ring-3" />
        </motion.div>
      </div>

      <motion.div className="hero-body" style={reduced ? {} : { opacity: heroOpacity, scale: heroScale }}>
        <div className="hero-grid-layout">

          {/* ─── Left Column ─── */}
          <div className="hero-left">
            <motion.div
              className="hero-editorial-label"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>Mumbai, India</span>
            </motion.div>

            <motion.h1
              className="hero-name"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="hero-name-first">Arpita Jadhav</span>
            </motion.h1>

            <motion.div
              className="hero-roles"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {roles.map((role, i) => (
                <span key={role} className="hero-role-item">
                  {role}
                  {i < roles.length - 1 && <span className="hero-role-dot">&#183;</span>}
                </span>
              ))}
            </motion.div>

            <motion.p
              className="hero-intro"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {personal.heroIdentity}
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroSentence sentences={personal.heroSentences} reduced={reduced} />
            </motion.div>

            <motion.div
              className="hero-actions"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.a
                href="#projects"
                className="hero-btn-primary"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                View My Work
              </motion.a>
              <motion.a
                href="#contact"
                className="hero-btn-secondary"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                Let's Connect
              </motion.a>
              <motion.a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-icon"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin size={15} />
              </motion.a>
              <motion.a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-icon"
                aria-label="GitHub"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub size={15} />
              </motion.a>
            </motion.div>
          </div>

          {/* ─── Right Column ─── */}
          <div className="hero-right">
            <motion.div
              className="hero-butterfly-wrap"
              initial={reduced ? false : { opacity: 0, scale: 0.6, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 14, delay: 0.3 }}
            >
              <svg className="hero-butterfly" viewBox="-10 -10 220 200" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="wingGradL" x1="100" y1="90" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="wingGradR" x1="100" y1="90" x2="180" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="wingGradLower" x1="100" y1="90" x2="100" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <g className="hero-butterfly-wings" style={{ transformOrigin: "100px 90px" }}>
                  <motion.g style={{ transformOrigin: "100px 90px", rotate: springWingL }}>
                    <motion.path className="hero-wing-line hero-wing-line--upper" d="M100 90 C 82 52, 38 28, 18 58 C 8 78, 30 108, 60 110 C 78 111, 94 100, 100 90" stroke="url(#wingGradL)" strokeWidth="1" strokeLinecap="round" variants={butterflyPathVariants} custom={0} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--vein" d="M100 90 C 88 68, 55 48, 32 62 C 48 72, 68 82, 100 90" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.35" strokeLinecap="round" variants={butterflyPathVariants} custom={1} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--vein" d="M100 90 C 84 72, 50 55, 28 70" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.2" strokeLinecap="round" variants={butterflyPathVariants} custom={2} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--lower" d="M100 90 C 88 108, 60 135, 72 152 C 82 164, 98 130, 100 90" stroke="url(#wingGradLower)" strokeWidth="0.8" strokeLinecap="round" variants={butterflyPathVariants} custom={3} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--vein" d="M100 90 C 92 110, 72 130, 76 145" stroke="var(--sage)" strokeWidth="0.4" strokeOpacity="0.25" strokeLinecap="round" variants={butterflyPathVariants} custom={4} initial={reduced ? "visible" : "hidden"} animate="visible" />
                  </motion.g>
                  <motion.g style={{ transformOrigin: "100px 90px", rotate: springWingR }}>
                    <motion.path className="hero-wing-line hero-wing-line--upper" d="M100 90 C 118 52, 162 28, 182 58 C 192 78, 170 108, 140 110 C 122 111, 106 100, 100 90" stroke="url(#wingGradR)" strokeWidth="1" strokeLinecap="round" variants={butterflyPathVariants} custom={0} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--vein" d="M100 90 C 112 68, 145 48, 168 62 C 152 72, 132 82, 100 90" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.35" strokeLinecap="round" variants={butterflyPathVariants} custom={1} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--vein" d="M100 90 C 116 72, 150 55, 172 70" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.2" strokeLinecap="round" variants={butterflyPathVariants} custom={2} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--lower" d="M100 90 C 112 108, 140 135, 128 152 C 118 164, 102 130, 100 90" stroke="url(#wingGradLower)" strokeWidth="0.8" strokeLinecap="round" variants={butterflyPathVariants} custom={3} initial={reduced ? "visible" : "hidden"} animate="visible" />
                    <motion.path className="hero-wing-line hero-wing-line--vein" d="M100 90 C 108 110, 128 130, 124 145" stroke="var(--sage)" strokeWidth="0.4" strokeOpacity="0.25" strokeLinecap="round" variants={butterflyPathVariants} custom={4} initial={reduced ? "visible" : "hidden"} animate="visible" />
                  </motion.g>
                  <motion.line className="hero-body-stroke" x1="100" y1="60" x2="100" y2="148" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" variants={butterflyPathVariants} custom={0} initial={reduced ? "visible" : "hidden"} animate="visible" />
                  <motion.path className="hero-antenna-stroke" d="M100 62 C 92 44, 78 34, 70 38" stroke="var(--text-secondary)" strokeWidth="0.8" strokeLinecap="round" fill="none" variants={butterflyPathVariants} custom={5} initial={reduced ? "visible" : "hidden"} animate="visible" />
                  <motion.path className="hero-antenna-stroke" d="M100 62 C 108 44, 122 34, 130 38" stroke="var(--text-secondary)" strokeWidth="0.8" strokeLinecap="round" fill="none" variants={butterflyPathVariants} custom={5} initial={reduced ? "visible" : "hidden"} animate="visible" />
                  <motion.circle cx="70" cy="38" r="2" fill="var(--accent)" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ delay: 1.2, duration: 0.4 }} />
                  <motion.circle cx="130" cy="38" r="2" fill="var(--accent)" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ delay: 1.2, duration: 0.4 }} />
                  <motion.circle cx="100" cy="80" r="1.2" fill="var(--accent)" fillOpacity="0.4" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
                  <motion.circle cx="100" cy="100" r="1" fill="var(--accent)" fillOpacity="0.3" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
                  <motion.circle cx="100" cy="118" r="0.8" fill="var(--accent)" fillOpacity="0.2" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} />

                  {/* Tech: circuit traces extending from wing tips */}
                  <motion.line x1="18" y1="58" x2="4" y2="48" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="2 2" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} />
                  <motion.line x1="182" y1="58" x2="196" y2="48" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="2 2" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} />
                  <motion.line x1="72" y1="152" x2="60" y2="168" stroke="var(--sage)" strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="2 2" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
                  <motion.line x1="128" y1="152" x2="140" y2="168" stroke="var(--sage)" strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="2 2" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
                  <motion.line x1="70" y1="38" x2="56" y2="26" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="2 2" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} />
                  <motion.line x1="130" y1="38" x2="144" y2="26" stroke="var(--accent)" strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="2 2" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} />

                  {/* Tech: circuit node dots at wing vertices */}
                  <motion.circle cx="18" cy="58" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.7" strokeOpacity="0.5" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }} />
                  <motion.circle cx="182" cy="58" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.7" strokeOpacity="0.5" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }} />
                  <motion.circle cx="72" cy="152" r="2" fill="none" stroke="var(--sage)" strokeWidth="0.7" strokeOpacity="0.4" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.35 }} />
                  <motion.circle cx="128" cy="152" r="2" fill="none" stroke="var(--sage)" strokeWidth="0.7" strokeOpacity="0.4" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.35 }} />
                  <motion.circle cx="32" cy="62" r="1.5" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.35" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }} />
                  <motion.circle cx="168" cy="62" r="1.5" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.35" initial={reduced ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }} />

                  {/* Tech: dashed circuit connections across wings */}
                  <motion.path d="M32 62 L76 145" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="3 4" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
                  <motion.path d="M168 62 L124 145" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="3 4" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
                </g>
              </svg>
              <AnimatePresence>
                {!reduced && butterflyParticles.map((p) => (
                  <motion.div
                    key={p.id}
                    className={`hero-butterfly-particle hero-butterfly-particle--${p.hue}`}
                    initial={{ x: p.startX, y: p.startY, opacity: 0.6, scale: 0 }}
                    animate={{ x: p.endX, y: p.endY, opacity: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    style={{ width: p.size, height: p.size }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {!reduced && connections.map((conn) => {
          const dx = conn.x2 - conn.x1;
          const dy = conn.y2 - conn.y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <motion.div
              key={conn.id}
              className="hero-connection"
              initial={{ opacity: 0.04 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ left: conn.x1, top: conn.y1, width: length, transform: `rotate(${angle}deg)`, transformOrigin: "0 0" }}
            />
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {!reduced && sparks.map((s) => (
          <motion.div
            key={s.id}
            className="hero-spark"
            initial={{ opacity: 0.06, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ left: s.x, top: s.y }}
          />
        ))}
      </AnimatePresence>

      {!reduced && (
        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1.5, duration: 0.5 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }}
        >
          <HiArrowDown size={16} />
        </motion.div>
      )}
    </section>
  );
}

export default Hero;
