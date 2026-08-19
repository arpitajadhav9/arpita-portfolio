import { HiMail, HiPhone } from "react-icons/hi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { personal, social } from "../../data/portfolio";
import ChapterHeader from "../ChapterHeader/ChapterHeader";
import { ButterflyStage } from "../Metamorphosis/Metamorphosis";
import "./Contact.css";

function Contact() {
  const cards = [
    { icon: <HiPhone size={18} />, label: personal.phone, href: `tel:${personal.phone}` },
    { icon: <HiMail size={19} />, label: personal.email, href: `mailto:${personal.email}` },
    { icon: <FaLinkedin size={17} />, label: "LinkedIn", href: social.linkedin },
    { icon: <FaGithub size={17} />, label: "GitHub", href: social.github },
  ];

  return (
    <section className="contact" id="contact">
      <ChapterHeader
        number="V."
        title="Transforming"
        subtitle="Ready for what's next."
        color="gold"
      />

      <div className="contact-glow contact-glow-1" />

      <div className="contact-inner">
        <ButterflyStage className="meta--contact" caption="stage 05 · flight" />

        <h2 className="contact-heading">Let&apos;s connect</h2>
        <p className="contact-sub">Have a project in mind or just want to say hi?</p>

        <div className="contact-links">
          {cards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="contact-link"
            >
              {c.icon}
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;
