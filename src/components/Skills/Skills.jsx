import { HiPencil, HiCode, HiChartBar, HiGlobe } from "react-icons/hi";
import { skills } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { CocoonStage } from "../Metamorphosis/Metamorphosis";
import "./Skills.css";

const icons = [<HiPencil size={17} />, <HiCode size={17} />, <HiChartBar size={17} />, <HiGlobe size={17} />];

function Skills() {
  return (
    <section className="skills" id="skills">
      <ChapterHeader
        number="III."
        title="Experimenting"
        subtitle="Where I'm pointing next."
        color="sage"
      />

      <div className="skills-grid-bg" />

      <CocoonStage className="meta--stage" caption="stage 03 · cocoon" />

      <div className="skills-inner">
        <div className="skills-cards">
          {skills.map((group, gi) => (
            <div key={group.category} className="skill-card">
              <div className="sk-head">
                <span className="sk-icon">{icons[gi]}</span>
                <span className="sk-category">{group.category}</span>
              </div>
              <div className="sk-tags">
                {group.items.map((s) => (
                  <span key={s} className="sk-tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
