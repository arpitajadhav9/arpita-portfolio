import { useEffect } from "react";
import "./Background.css";

function Background() {
  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-orb bg-orb-rose" />
      <div className="bg-orb bg-orb-gold" />
      <div className="bg-orb bg-orb-sage" />
      <div className="bg-wing-pattern" />
      <div className="bg-noise" />
    </div>
  );
}

export default Background;
