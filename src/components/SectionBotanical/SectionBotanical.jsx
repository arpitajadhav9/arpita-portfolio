import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./SectionBotanical.css";


export default function SectionBotanical({ children, parallaxIntensity = 12 }) {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [parallaxIntensity, 0, -parallaxIntensity]
  );

  useEffect(() => {
    if (reduced || !ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.01 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className="section-botanical" aria-hidden="true">
      <motion.svg
        ref={svgRef}
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", y: reduced ? 0 : y }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {children}
      </motion.svg>
    </div>
  );
}
