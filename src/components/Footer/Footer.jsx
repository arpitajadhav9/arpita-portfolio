import { personal } from "../../data/portfolio";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">&copy; {year} {personal.fullName}.</p>
        <div className="footer-links">
          <a href="#hero" className="footer-link">Back to top</a>
          <span className="footer-divider">/</span>
          <a href="#" className="footer-link">Privacy</a>
          <span className="footer-divider">/</span>
          <a href="#" className="footer-link">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
