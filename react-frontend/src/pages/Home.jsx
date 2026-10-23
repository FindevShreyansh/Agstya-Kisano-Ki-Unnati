import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const navRef = useRef(null);
  const heroImageRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const revealElements = page.querySelectorAll(".scroll-reveal");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = ["top", "about", "features", "how-it-works"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.15, 0.35] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const heroImage = heroImageRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const updateScrollEffects = () => {
      frameId = 0;
      const scrollY = window.scrollY;
      nav?.classList.toggle("is-scrolled", scrollY > 8);

      if (!motionPreference.matches && heroImage) {
        heroImage.style.setProperty("--hero-parallax-y", `${Math.min(scrollY * 0.045, 24)}px`);
      }
    };

    const handleScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateScrollEffects);
    };

    updateScrollEffects();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div ref={pageRef} className="home-redesign min-h-screen bg-[#F7FAF7] text-gray-800">
      {/* Navbar */}
      <nav ref={navRef} className="redesign-nav sticky top-0 z-50 px-5 md:px-10">
        <div className="redesign-nav-inner mx-auto grid min-h-[78px] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <a href="#top" aria-label="AGSTYA home" onClick={closeMobileMenu} className="brand-lockup min-w-0 justify-self-start">
            <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-14 w-auto max-w-full object-contain sm:h-[62px]" />
            <span className="brand-divider" aria-hidden="true" />
           
          </a>

          <div className="redesign-nav-links items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#top" className={`home-nav-link ${activeSection === "top" ? "is-active" : ""}`} aria-current={activeSection === "top" ? "page" : undefined}>Home</a>
            <a href="#about" className={`home-nav-link ${activeSection === "about" ? "is-active" : ""}`} aria-current={activeSection === "about" ? "location" : undefined}>Our purpose</a>
            <a href="#features" className={`home-nav-link ${activeSection === "features" ? "is-active" : ""}`} aria-current={activeSection === "features" ? "location" : undefined}>What you can do</a>
            <a href="#how-it-works" className={`home-nav-link ${activeSection === "how-it-works" ? "is-active" : ""}`} aria-current={activeSection === "how-it-works" ? "location" : undefined}>How it works</a>
          </div>

          <div className="redesign-nav-actions justify-self-end">
            <button type="button" onClick={() => navigate("/roles")} className="nav-join">
              Get started <span aria-hidden="true">↗</span>
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="home-mobile-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="redesign-menu-toggle justify-self-end"
          >
            <span className={`home-menu-icon ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <div id="home-mobile-menu" className={`redesign-mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden={!mobileMenuOpen}>
          <div className="mx-auto grid max-w-7xl gap-1 py-3">
            <a href="#top" onClick={closeMobileMenu} tabIndex={mobileMenuOpen ? 0 : -1} className="home-mobile-link">Home <span>↗</span></a>
            <a href="#about" onClick={closeMobileMenu} tabIndex={mobileMenuOpen ? 0 : -1} className="home-mobile-link">Our purpose <span>↗</span></a>
            <a href="#features" onClick={closeMobileMenu} tabIndex={mobileMenuOpen ? 0 : -1} className="home-mobile-link">What you can do <span>↗</span></a>
            <a href="#how-it-works" onClick={closeMobileMenu} tabIndex={mobileMenuOpen ? 0 : -1} className="home-mobile-link">How it works <span>↗</span></a>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                navigate("/roles");
              }}
              tabIndex={mobileMenuOpen ? 0 : -1}
              className="mobile-join mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-colors"
            >
              Get Started <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="top" className="redesign-hero relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-12 sm:px-8 md:grid-cols-2 md:px-12 md:py-20">
        <div className="hero-grain" aria-hidden="true" />

        {/* Left */}
        <div className="hero-copy min-w-0">

          <span style={{ "--enter-delay": "0ms" }} className="hero-enter hero-kicker mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em]">
            <span className="kicker-sun">✳</span> A brighter way to grow
          </span>

          <h1 className="hero-title text-4xl font-extrabold leading-[1.04] tracking-[-0.055em] text-gray-900 sm:text-5xl md:text-6xl xl:text-7xl">
            <span style={{ "--enter-delay": "100ms" }} className="hero-heading-line block">The future of</span>
            <span style={{ "--enter-delay": "210ms" }} className="hero-heading-line hero-title-accent block">
              farming starts<br className="hidden sm:block" /> with your soil.
            </span>
          </h1>

          <p style={{ "--enter-delay": "300ms" }} className="hero-enter mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            Make confident choices for your farm. Understand your soil, plan your crops, and find new ways to reach buyers—all in one place.
          </p>

          <div className="hero-actions mt-8 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => navigate("/roles")}
              style={{ "--enter-delay": "410ms" }}
              className="hero-enter hero-primary rounded-full px-6 py-3.5 text-sm font-extrabold text-white transition-all duration-200"
            >
              Find your way in <span aria-hidden="true">↗</span>
            </button>

            <button
              type="button"
              style={{ "--enter-delay": "490ms" }}
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
              }}
              className="hero-enter hero-secondary rounded-full px-6 py-3.5 text-sm font-bold transition-colors duration-200"
            >
              See how it works <span aria-hidden="true">↓</span>
            </button>

          </div>

          <div className="hero-signoff"><span className="signoff-line" /> Built around the people who grow our food</div>

        </div>


        {/* Right */}
        <div className="hero-image-enter hero-art relative min-w-0">
          <div className="hero-art-halo" />
          <div className="hero-image-frame hero-image-wrap">
            <img
              ref={heroImageRef}
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=85"
              alt="Sunlight over a green agricultural field"
              className="hero-parallax-image h-[360px] w-full object-cover sm:h-[470px]"
            />
          </div>

          <div className="hero-art-stamp" aria-hidden="true"><span>GROW</span><span>WITH</span><strong>AGSTYA</strong></div>
          <div className="smart-farming-float floating-note note-soil">
            <span className="note-icon">✳</span>
            <span><b>Start with the soil</b><small>Understand your field</small></span>
          </div>
          <div className="floating-note note-market">
            <span className="note-icon">↗</span>
            <span><b>Grow your options</b><small>Plan · list · connect</small></span>
          </div>
          <span className="hero-spark spark-one" aria-hidden="true">✳</span>
          <span className="hero-spark spark-two" aria-hidden="true">✦</span>
        </div>

        <a href="#about" className="hero-scroll-cue"><span /> Scroll to explore</a>
      </section>

      <section className="promise-ribbon" aria-label="AGSTYA platform focus">
        <span>SOIL INSIGHTS</span><i aria-hidden="true">✳</i><span>CROP PLANNING</span><i aria-hidden="true">✳</i><span>MARKET CONNECTIONS</span><i aria-hidden="true">✳</i><span>FARMER FIRST</span>
      </section>


      {/* About */}
      <section
        id="about"
        className="purpose-section relative overflow-hidden bg-white px-6 py-20 md:px-12"
      >

        <div className="purpose-grid relative z-10 mx-auto max-w-6xl">

          <span className="section-index scroll-reveal block font-extrabold">
            01 <span>—</span> OUR PURPOSE
          </span>

          <h2 style={{ "--reveal-delay": "100ms" }} className="scroll-reveal text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Good decisions<br />deserve <em>good tools.</em>
          </h2>

          <div className="purpose-copy scroll-reveal" style={{ "--reveal-delay": "200ms" }}>
            <p>Every season brings important choices: what to grow, how to care for the land, and where to sell. AGSTYA brings practical tools for those choices into one farmer-focused experience.</p>
            <button type="button" className="text-link" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Explore the platform <span aria-hidden="true">↘</span></button>
          </div>

        </div>
        <div className="purpose-orbit" aria-hidden="true"><span>GROW</span><i>✳</i></div>

      </section>


      {/* Features */}
      <section
        id="features"
        className="feature-section mx-auto max-w-7xl px-5 py-20 sm:px-8 md:px-12"
      >

        <div className="feature-heading mb-12">
          <div>

          <span className="section-index scroll-reveal block font-extrabold">
            02 <span>—</span> YOUR TOOLKIT
          </span>

          <h2 style={{ "--reveal-delay": "100ms" }} className="scroll-reveal mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            A whole season,<br /><em>in your hands.</em>
          </h2>
          </div>
          <p className="scroll-reveal max-w-sm text-left text-sm leading-6 text-gray-600 sm:text-base" style={{ "--reveal-delay": "180ms" }}>
            Thoughtful tools that bring farm insights and market opportunities closer together.
          </p>

        </div>


        <div className="feature-grid grid gap-5 md:grid-cols-3">

          {[
            {
              number: "01",
              icon: "🌱",
              title: "Know your soil",
              text: "Make sense of soil readings and see which crops may suit your field.",
              tone: "mint",
            },
            {
              number: "02",
              icon: "🧪",
              title: "Plan with purpose",
              text: "Explore crop choices and estimate revenue from your own inputs.",
              tone: "sun",
            },
            {
              number: "03",
              icon: "🤝",
              title: "Reach the market",
              text: "Show available produce and discover buyer opportunities in one place.",
              tone: "blue",
            }
          ].map((feature, index) => (

            <div
              key={feature.title}
              style={{ "--reveal-delay": `${index * 120}ms`, "--tile-delay": `${index * 110}ms` }}
              className={`scroll-reveal feature-tile ${feature.tone}`}
            >
              <div className="tile-topline"><span>{feature.number} / 03</span><span className="tile-arrow" aria-hidden="true">↗</span></div>
              <div className="tile-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3>
                {feature.title}
              </h3>
              <p>
                {feature.text}
              </p>
              <span className="tile-bottom-line" />
            </div>

          ))}

        </div>

      </section>


      {/* How It Works */}
      <section
        id="how-it-works"
        className="journey-section relative overflow-hidden bg-green-950 px-5 py-20 text-white sm:px-8 md:px-12"
      >
        <div className="journey-orb" aria-hidden="true" />

        <div className="journey-header relative z-10 mx-auto max-w-6xl">

          <span className="section-index scroll-reveal block font-extrabold text-green-300">
            03 <span>—</span> THE JOURNEY
          </span>

          <h2 style={{ "--reveal-delay": "100ms" }} className="scroll-reveal mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            From the ground up.
          </h2>
          <p className="scroll-reveal mt-4 text-sm leading-6 text-green-100/75 sm:text-base" style={{ "--reveal-delay": "180ms" }}>A simple path from understanding your farm to exploring the market.</p>


          <div className="journey-track relative z-10 mt-14 grid gap-8 sm:grid-cols-2 md:grid-cols-4">

            {[
              ["01", "Understand", "Start with your farm and soil"],
              ["02", "Plan", "Explore crops and estimates"],
              ["03", "Prepare", "List the produce you have"],
              ["04", "Connect", "Explore buyer opportunities"]
            ].map(([number, title, text], index) => (

              <div
                key={number}
                style={{ "--reveal-delay": `${index * 120}ms`, "--tile-delay": `${index * 100}ms` }}
                className="scroll-reveal journey-step"
              >

                <div className="step-marker"><span>{number}</span><i /></div>

                <h3>
                  {title}
                </h3>

                <p>
                  {text}
                </p>

              </div>

            ))}

          </div>
          <div className="journey-footer scroll-reveal"><span>One farm. Many possibilities.</span><span aria-hidden="true">✳</span></div>

        </div>

      </section>


      {/* CTA */}
      <section className="closing-section home-cta-section relative px-6 py-20 text-center">

        <div className="closing-sun" aria-hidden="true">✳</div>
        <div className="home-cta-content relative mx-auto max-w-3xl">
        <span className="section-index scroll-reveal block font-extrabold">YOUR NEXT SEASON STARTS HERE</span>
        <h2 style={{ "--reveal-delay": "0ms" }} className="scroll-reveal mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Let’s grow<br /><em>something better.</em>
        </h2>

        <p style={{ "--reveal-delay": "120ms" }} className="scroll-reveal mt-4 text-sm leading-6 text-gray-600 sm:text-base">
          Step into a more connected way to plan, grow, and find opportunity.
        </p>

        <button
          onClick={() => navigate("/roles")}
          style={{ "--reveal-delay": "240ms" }}
          className="scroll-reveal closing-cta mt-7 rounded-full px-8 py-4 text-sm font-extrabold text-white transition-all duration-200"
        >
          Explore AGSTYA <span aria-hidden="true">↗</span>
        </button>
        </div>

      </section>


      {/* Footer */}
      <footer className="redesign-footer">
        <a href="#top" className="footer-brand"><img src="/agstya-logo.png" alt="AGSTYA" /></a>
        <p>Tools for a more informed, connected farming journey.</p>
        <a href="#top" className= "back-to-top">Back to top ↑</a>
      </footer>

    </div>
  );
}

export default Home;
