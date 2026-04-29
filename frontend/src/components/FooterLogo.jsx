import '../styles/footerLogo.css';

// Shows only the OCP star/leaf emblem, no "OCP" text below
export default function FooterLogo() {
  return (
    <footer className="app-footer">
      <div className="app-footer-icon-wrap">
        <img src="/ocp-logo.png" alt="OCP" className="app-footer-logo-img" />
      </div>
    </footer>
  );
}