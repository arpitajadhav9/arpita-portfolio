import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { experience } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { EatingStage } from "../Metamorphosis/Metamorphosis";
import { ExperienceBackground } from "../BotanicalBackground/BotanicalBackground";
import { useTilt } from "../../hooks/useTilt";
import "./Experience.css";

const COLLAPSED = 155;
const MAX_VISIBLE_TAGS = 5;

function getShortDesc(text) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  let r = "";
  for (const s of sentences) {
    if ((r + " " + s).length > 120) break;
    r = r ? r + " " + s : s;
  }
  return r || text.slice(0, 120);
}

function ExpCard({ exp, index }) {
  const [open, setOpen] = useState(false);
  const [expandedH, setExpandedH] = useState(COLLAPSED);
  const clipRef = useRef(null);
  const measured = useRef(false);
  
  // Use custom tilt for card w/ glossy glare
  const tilt = useTilt(1.01, 4);

  const measure = useCallback(() => {
    if (!measured.current && clipRef.current) {
      setExpandedH(clipRef.current.scrollHeight + 20);
      measured.current = true;
    }
  }, []);

  const visTags = exp.skillsGained.slice(0, MAX_VISIBLE_TAGS);
  const hidTags = exp.skillsGained.slice(MAX_VISIBLE_TAGS);
  const short = getShortDesc(exp.description);

  return (
    <motion.article
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={() => {
        tilt.onMouseLeave();
        setOpen(false);
      }}
      style={tilt.style}
      className={`exp-card-wrapper card-double-bezel ${open ? "exp-card--wrapper-open" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => { setOpen(true); setTimeout(measure, 50); }}
    >
      <div className={`exp-card inner-core ${open ? "exp-card--open" : ""}`} style={tilt.glareStyle}>
        <div className="card-glare" />
        <div className="exp-tape" aria-hidden="true" />

        <div className="exp-card-clip" ref={clipRef}>
          <div
            className="exp-card-inner"
            style={{ height: open ? expandedH : COLLAPSED }}
          >
            {/* Row 1: Title */}
            <div className="exp-row exp-row--title">
              <h3 className="exp-role">{exp.role}</h3>
            </div>

            {/* Row 2: Company + Date */}
            <div className="exp-row exp-row--meta">
              <span className="exp-company">{exp.company}</span>
              {exp.location && <span className="exp-sep">|</span>}
              {exp.location && <span className="exp-location">{exp.location}</span>}
              <span className="exp-date-badge">{exp.period}</span>
            </div>

            <div className="exp-divider" />

            {/* Row 3: Short description */}
            <div className="exp-row exp-row--desc">
              <p className="exp-desc">
                {open ? exp.description : short}
                {!open && short.length < exp.description.length && " …"}
              </p>
            </div>

            <div className="exp-divider" />

            {/* Row 4: Visible skill chips */}
            <div className="exp-row exp-row--tags">
              <div className="exp-tags">
                {visTags.map((s) => (
                  <span key={s} className="exp-tag">{s}</span>
                ))}
                {!open && hidTags.length > 0 && (
                  <span className="exp-tag exp-tag--more">+{hidTags.length}</span>
                )}
              </div>
            </div>

            {/* Expanded content */}
            <div className={`exp-extra ${open ? "exp-extra--open" : ""}`}>
              {hidTags.length > 0 && (
                <div className="exp-tags exp-tags--extra">
                  {hidTags.map((s) => (
                    <span key={s} className="exp-tag">{s}</span>
                  ))}
                </div>
              )}
              <div className="exp-divider" />
              <div className="exp-lesson">
                <span className="exp-label">Lesson Learned</span>
                <p className="exp-lesson-text">{exp.lessonsLearned}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Experience() {
  return (
    <section className="experience" id="experience">
      <ExperienceBackground />
      <ChapterHeader
        number="II."
        title="Growing"
        subtitle="Learning what real teams need."
        color="gold"
      />

      <div className="exp-glow exp-glow-1" />
      <div className="exp-glow exp-glow-2" />

      <EatingStage className="meta--stage" />

      <div className="exp-inner">
        <div className="exp-stack">
          {experience.map((exp, i) => (
            <ExpCard key={exp.role} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
