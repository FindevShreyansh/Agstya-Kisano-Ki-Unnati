import { useNavigate } from "react-router-dom";

const roles = [
  {
    title: "Farmer",
    description: "Manage your farm, understand your soil, plan crops and connect with buyers.",
    icon: "🌾",
    label: "GROW",
    tone: "farmer",
    path: "/farmer/login",
  },
  {
    title: "Buyer",
    description: "Find farmers, post crop requirements and source agricultural products.",
    icon: "🧺",
    label: "SOURCE",
    tone: "buyer",
    path: "/buyer/login",
  },
  {
    title: "Admin",
    description: "Manage platform activities, users, crops and procurement operations.",
    icon: "⚙️",
    label: "STEWARD",
    tone: "admin",
    path: "/admin/login",
  },
];

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-selection-page">
      <header className="role-select-nav">
        <a href="/" className="role-brand" aria-label="AGSTYA home">
          <img src="/agstya-logo.png" alt="AGSTYA" />
          <span className="role-brand-divider" />
          <span>Kisano Ki Unnati</span>
        </a>
        <button type="button" className="role-back-link" onClick={() => navigate("/")}>
          <span aria-hidden="true">←</span> Back to home
        </button>
      </header>

      <main className="role-select-main">
        <div className="role-select-orbit role-orbit-one" aria-hidden="true">✳</div>
        <div className="role-select-orbit role-orbit-two" aria-hidden="true">✦</div>

        <section className="role-select-intro">
          <span className="role-select-kicker"><i aria-hidden="true" /> CHOOSE YOUR AGSTYA JOURNEY</span>
          <h1>Good things grow<br /><em>when we grow together.</em></h1>
          <p>Choose how you’d like to use AGSTYA. We’ll take you to the right place.</p>
        </section>

        <section className="role-select-grid" aria-label="Choose your role">
          {roles.map((role, index) => (
            <article className={`role-select-card role-${role.tone}`} key={role.title} style={{ "--role-delay": `${index * 100}ms` }}>
              <div className="role-card-topline"><span>0{index + 1} / 03</span><span>{role.label}</span></div>
              <div className="role-card-icon" aria-hidden="true"><span>{role.icon}</span><i>✳</i></div>
              <h2>{role.title}</h2>
              <p>{role.description}</p>
              <button type="button" onClick={() => navigate(role.path)}>
                Continue as {role.title} <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
        </section>

        <p className="role-select-note"><span aria-hidden="true">✳</span> Rooted in better decisions. Ready for what’s next.</p>
      </main>

      <footer className="role-select-footer">
        <span>AGSTYA <i>—</i> KISANO KI UNNATI</span>
        <span>Tools for a more informed, connected farming journey.</span>
      </footer>
    </div>
  );
}

export default RoleSelection;
