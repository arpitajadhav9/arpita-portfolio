import { HiExternalLink, HiFolder } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { useTilt } from "../../hooks/useTilt";
import { projects } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { EmergingStage } from "../Metamorphosis/Metamorphosis";
import "./Projects.css";

const linkIcons = {
  github: <FaGithub size={13} />,
  live: <HiExternalLink size={14} />,
  case: <HiExternalLink size={14} />,
};

function Projects() {
  const tiltA = useTilt(1.03, 5);
  const tiltB = useTilt(1.03, 5);
  const tiltC = useTilt(1.03, 5);
  const tiltD = useTilt(1.03, 5);

  const tilts = [tiltA, tiltB, tiltC, tiltD];

  return (
    <section className="projects" id="projects">
      <ChapterHeader
        number="IV."
        title="Building"
        subtitle="The collection, so far."
        color="accent"
      />

      <div className="projects-grid-bg" />

      <EmergingStage className="meta--stage" caption="stage 04 · emerging" />

      <div className="projects-inner">
        <div className="projects-grid-cards">
          {projects.map((p, i) => {
            const t = tilts[i];
            return (
              <div
                key={p.title}
                className="project-card"
                ref={t.ref}
                onMouseMove={t.onMouseMove}
                onMouseLeave={t.onMouseLeave}
                style={t.style}
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Projects;
