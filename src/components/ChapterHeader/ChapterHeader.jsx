import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./ChapterHeader.css";

const easing = [0.22, 1, 0.36, 1];

function ChapterHeader({ number, title, subtitle, color }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div className={`chapter ${color ? `chapter--${color}` : ""}`} ref={ref}>
      <motion.span
        className="chapter-number"
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease: easing }}
      >
        {number}
      </motion.span>

      <motion.h2
        className="chapter-title"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: easing }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="chapter-subtitle"
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: easing }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export default ChapterHeader;
