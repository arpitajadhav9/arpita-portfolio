import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import "./Cursor.css";

function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 150, damping: 15 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return (
    <motion.div className="custom-cursor" style={{ left: springX, top: springY }}>
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </motion.div>
  );
}

export default Cursor;
