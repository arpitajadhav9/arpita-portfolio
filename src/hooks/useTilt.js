import { useState, useCallback, useRef } from "react";

export function useTilt(maxAngle = 8) {
  const [style, setStyle] = useState({});
  const ref = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setStyle({
        transform: `perspective(800px) rotateX(${-y * maxAngle}deg) rotateY(${x * maxAngle}deg)`,
      });
    },
    [maxAngle]
  );

  const onMouseLeave = useCallback(() => {
    setStyle({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg)" });
  }, []);

  return { ref, onMouseMove, onMouseLeave, style };
}
