import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function SmoothScroll({ children }) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    // Run initially and set a small timeout to let dynamic heights render
    handleResize();
    const timer = setTimeout(handleResize, 100);

    window.addEventListener("resize", handleResize);

    // Monitor DOM changes to update height automatically if elements expand/collapse
    const observer = new MutationObserver(handleResize);
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  
  // Apply a smooth spring transition to the scroll coordinate
  const smoothY = useSpring(scrollY, {
    stiffness: 45,
    damping: 18,
    restDelta: 0.001,
  });

  // Translate content upwards as page scrolls
  const y = useTransform(smoothY, (value) => -value);

  return (
    <>
      <motion.div
        ref={contentRef}
        className="smooth-scroll-content"
        style={{
          y,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
      {/* Spacer to preserve the page scroll bar and dimensions */}
      <div style={{ height: contentHeight }} />
    </>
  );
}
