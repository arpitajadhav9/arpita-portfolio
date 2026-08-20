import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { personal } from "../../data/portfolio";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

const links = [
  { id: "about", label: "I. Learning", short: "Learning" },
  { id: "experience", label: "II. Growing", short: "Growing" },
  { id: "skills", label: "III. Experimenting", short: "Experimenting" },
  { id: "projects", label: "IV. Building", short: "Building" },
  { id: "contact", label: "V. Transforming", short: "Transforming" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [active, setActive] = useState("");
  const lastY = useRef(0);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const y = window.scrollY;
    const diff = y - lastY.current;

    if (y < 80) {
      setHidden(false);
      setAtTop(true);
    } else {
      setAtTop(false);
      if (diff > 12) setHidden(true);
      else if (diff < -12) setHidden(false);
    }

    lastY.current = y;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  useEffect(() => {
    const ids = [
      "hero",
      "about",
      "experience",
      "skills",
      "projects",
      "contact",
    ];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className={`navbar ${hidden ? "navbar--hidden" : ""} ${!atTop ? "navbar--scrolled" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-container">
        <button
          className="navbar-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {personal.name}
          <span className="navbar-logo-dot">.</span>
        </button>

        <div className="navbar-links">
          {links.map((l) => (
            <button
              key={l.id}
              className={active === l.id ? "active" : ""}
              onClick={() => scrollTo(l.id)}
            >
              <span className="nav-num">{l.label.split(". ")[0]}.</span>
              <span className="nav-label">{l.label.split(". ")[1]}</span>
            </button>
          ))}
          <ThemeToggle />
          <a href="/Arpita_Jadhav_Resume.pdf" download className="resume-btn">
            Resume
          </a>
        </div>

        <div className="navbar-mobile-right">
          <ThemeToggle />
          <button
            className="menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {links.map((l) => (
              <button
                key={l.id}
                className="mobile-link"
                onClick={() => scrollTo(l.id)}
              >
                <span className="mobile-link-num">
                  {l.label.split(". ")[0]}.
                </span>
                {l.label.split(". ")[1]}
              </button>
            ))}
            <a
              href="/Arpita_Jadhav_Resume.pdf"
              download
              className="resume-btn mobile-resume"
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
