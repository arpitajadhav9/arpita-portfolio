import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import "./Cursor.css";

function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  const springX = useSpring(cursorX, { stiffness: 250, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 250, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const onOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".skill-card-wrapper") ||
        target.closest(".exp-card-wrapper") ||
        target.closest(".theme-toggle") ||
        target.closest(".nav-link") ||
        target.closest(".contact-link");

      setHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div 
      className={`custom-cursor ${hovered ? "cursor-hovered" : ""}`} 
      style={{ left: springX, top: springY }}
    >
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </motion.div>
  );
}

export default Cursor;
