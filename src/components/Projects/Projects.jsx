import { HiExternalLink, HiFolder } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { useTilt } from "../../hooks/useTilt";
import { projects } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { EmergingStage } from "../Metamorphosis/Metamorphosis";
import { ProjectsBackground } from "../BotanicalBackground/BotanicalBackground";
import "./Projects.css";

const linkIcons = {
  github: <FaGithub size={13} />,
  live: <HiExternalLink size={14} />,
  case: <HiExternalLink size={14} />,
};

function ProjectCard({ p }) {
  const tilt = useTilt(1.02, 6);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className="project-card-wrapper card-double-bezel"
    >
      <div className="project-card inner-core" style={tilt.glareStyle}>
        <div className="card-glare" />
        <div className="pc-top">
          <HiFolder className="pc-folder" size={22} />
          <div className="pc-links">
            {Object.entries(p.links).map(([key, url]) =>
              url ? (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="pc-link">
                  {linkIcons[key]}
                </a>
              ) : null
            )}
          </div>
        </div>
        <h3 className="pc-title">{p.title}</h3>
        <span className="pc-sub">{p.subtitle}</span>
        <p className="pc-desc">{p.description}</p>
        <div className="pc-tags">
          {p.tags.map((tag) => (
            <span key={tag} className="pc-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects() {
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
          {projects.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
