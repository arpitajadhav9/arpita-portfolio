import { personal } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { AboutBackground } from "../BotanicalBackground/BotanicalBackground";
import { SleepingBranch } from "../Metamorphosis/Metamorphosis";
import "./About.css";

function About() {
  return (
    <section className="about" id="about">
      <AboutBackground />
      <ChapterHeader
        number="I."
        title="Learning"
        subtitle="What I'm formally building on."
        color="accent"
      />

      <div className="about-shapes">
        <div className="about-glow about-glow-1" />
        <div className="about-glow about-glow-2" />
      </div>

      <SleepingBranch className="meta--stage" />

      <div className="about-inner">
        <div className="about-layout">
          <div className="about-narrative">
            <p className="about-greeting">Hey, I&apos;m {personal.name}!</p>
            <p className="about-body">{personal.description}</p>
          </div>

          <div className="about-personal card-double-bezel">
            <div className="inner-core">
              <div className="card-glare" />
              <div className="about-quote-mark">*</div>
              <p className="about-personal-text">{personal.personalNote}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default About;
