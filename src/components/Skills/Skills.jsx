import { HiPencil, HiCode, HiChartBar, HiGlobe } from "react-icons/hi";
import { skills } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { CocoonStage } from "../Metamorphosis/Metamorphosis";
import { SkillsBackground } from "../BotanicalBackground/BotanicalBackground";
import { useTilt } from "../../hooks/useTilt";
import "./Skills.css";

const icons = [<HiPencil size={17} />, <HiCode size={17} />, <HiChartBar size={17} />, <HiGlobe size={17} />];

function SkillCard({ group, icon }) {
  const tilt = useTilt(1.02, 6);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className="skill-card-wrapper card-double-bezel"
    >
      <div className="skill-card inner-core" style={tilt.glareStyle}>
        <div className="card-glare" />
        <div className="sk-head">
          <span className="sk-icon">{icon}</span>
          <span className="sk-category">{group.category}</span>
        </div>
        <div className="sk-tags">
          {group.items.map((s) => (
            <span key={s} className="sk-tag">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section className="skills" id="skills">
      <SkillsBackground />
      <ChapterHeader
        number="III."
        title="Experimenting"
        subtitle="Where I'm pointing next."
        color="sage"
      />

      <div className="skills-grid-bg" />

      <CocoonStage className="meta--stage" />

      <div className="skills-inner">
        <div className="skills-cards">
          {skills.map((group, gi) => (
            <SkillCard key={group.category} group={group} icon={icons[gi]} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
