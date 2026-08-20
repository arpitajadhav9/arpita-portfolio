import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiExternalLink, HiX, HiPhotograph } from "react-icons/hi";
import { FaGithub, FaBookOpen, FaFileAlt } from "react-icons/fa";
import { useTilt } from "../../hooks/useTilt";
import { projects } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { EmergingStage } from "../Metamorphosis/Metamorphosis";
import { ProjectsBackground } from "../BotanicalBackground/BotanicalBackground";
import "./Projects.css";

const linkIcons = {
  github: <FaGithub size={15} />,
  live: <HiExternalLink size={16} />,
  case: <FaFileAlt size={14} />,
};

const linkLabels = {
  github: "Repository",
  live: "Live Demo",
  case: "Case Study",
};

/* ── Card Component — minimal ── */
function ProjectCard({ p, index, onClick }) {
  const tilt = useTilt(1.02, 6);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className="project-card-wrapper card-double-bezel"
      onClick={onClick}
    >
      <div className="project-card inner-core">
        <div className="card-glare" />
        <div className="pc-top">
          <span className="pc-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="pc-click-hint">View details</span>
        </div>
        <h3 className="pc-title">{p.title}</h3>
        <span className="pc-sub">{p.subtitle}</span>
        <div className="pc-tags">
          {p.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="pc-tag">{tag}</span>
          ))}
          {p.tags.length > 3 && (
            <span className="pc-tag pc-tag--more">+{p.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  const handleEscape = useCallback((e) => {
    if (e.key === "Escape") setActiveProject(null);
  }, []);

  useEffect(() => {
    if (activeProject) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [activeProject, handleEscape]);

  return (
    <section className="projects" id="projects">
      <ProjectsBackground />
      <ChapterHeader
        number="IV."
        title="Building"
        subtitle="The collection, so far."
        color="accent"
      />

      <div className="projects-grid-bg" />

      <EmergingStage className="meta--stage" />

      <div className="projects-inner">
        <div className="projects-grid-cards">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} p={p} index={i} onClick={() => setActiveProject(p)} />
          ))}
        </div>
      </div>

      {/* ── Project Detail Modal ── */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              className="project-modal-wrapper card-double-bezel"
              initial={{ scale: 0.96, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 24, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="project-modal-close"
                onClick={() => setActiveProject(null)}
                aria-label="Close details"
              >
                <HiX size={18} />
              </button>

              <div className="project-modal-container inner-core">
                {/* ── Sticky header ── */}
                <div className="pm-sticky-header">
                  <div className="pm-sticky-left">
                    <span className="pm-eyebrow">{activeProject.subtitle}</span>
                    <h2 className="pm-title">{activeProject.title}</h2>
                  </div>
                  <div className="pm-sticky-tags">
                    {activeProject.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="pm-tag">{tag}</span>
                    ))}
                    {activeProject.tags.length > 4 && (
                      <span className="pm-tag pm-tag--more">+{activeProject.tags.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* ── Scrollable content ── */}
                <div className="pm-scroll-body">
                  {/* Description */}
                  <div className="pm-section-block">
                    <h4 className="pm-sec-label">About</h4>
                    <p className="pm-sec-text">{activeProject.description}</p>
                  </div>

                  {/* Features */}
                  <div className="pm-section-block">
                    <h4 className="pm-sec-label pm-sec-label--gold">Features</h4>
                    <ul className="pm-features">
                      {activeProject.features.map((item, i) => (
                        <li key={i} className="pm-feature-item">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div className="pm-section-block pm-section-block--sage">
                    <h4 className="pm-sec-label pm-sec-label--sage">Challenges & solutions</h4>
                    <p className="pm-sec-text">{activeProject.challenges}</p>
                  </div>

                  {/* Images — horizontal scroll strip */}
                  <div className="pm-images-section">
                    <h4 className="pm-sec-label">Screenshots</h4>
                    <div className="pm-images-scroll">
                      <div className="pm-img-slot">
                        <HiPhotograph size={24} className="pm-img-icon" />
                        <span>Screenshot 1</span>
                      </div>
                      <div className="pm-img-slot">
                        <HiPhotograph size={24} className="pm-img-icon" />
                        <span>Screenshot 2</span>
                      </div>
                      <div className="pm-img-slot">
                        <HiPhotograph size={24} className="pm-img-icon" />
                        <span>Screenshot 3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Links — sticky at bottom ── */}
                <div className="pm-action-footer">
                  <div className="pm-buttons">
                    {Object.entries(activeProject.links).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`pm-btn pm-btn--${key}`}
                      >
                        <span className="pm-btn-icon">{linkIcons[key]}</span>
                        <span className="pm-btn-label">{linkLabels[key]}</span>
                      </a>
                    ))}
                    {activeProject.researchMaterial && (
                      <a
                        href={activeProject.researchMaterial}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pm-btn pm-btn--research"
                      >
                        <span className="pm-btn-icon"><FaBookOpen size={13} /></span>
                        <span className="pm-btn-label">Research Paper</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;
