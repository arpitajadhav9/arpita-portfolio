import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={{ scale: 0.93 }}
    >
      <span className={`tt-track ${isDark ? "tt-track--dark" : ""}`}>
        <span className="tt-icon tt-icon--sun">
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.3 3.3l1.4 1.4M11.3 11.3l1.4 1.4M3.3 12.7l1.4-1.4M11.3 4.7l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="tt-knob" />
        <span className="tt-icon tt-icon--moon">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M13.5 9.5a5.5 5.5 0 0 1-7-7 5.5 5.5 0 1 0 7 7Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </motion.button>
  );
}

export default ThemeToggle;
