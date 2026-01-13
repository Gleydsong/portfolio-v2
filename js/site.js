export function initSiteUI({ enableSectionSpy = true } = {}) {
  setupMobileMenu();
  setupScrollProgress();
  setupScrollHint();
  setupSmoothScroll();

  if (enableSectionSpy) setupSectionSpy();
}

export function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Fecha ao clicar em link (mobile)
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    close();
  });

  // Fecha com ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function setupScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupScrollHint() {
  const hint = document.getElementById("scrollHint");
  if (!hint) return;

  const update = () => {
    const hidden = window.scrollY > 120;
    hint.style.opacity = hidden ? "0" : "1";
    hint.style.visibility = hidden ? "hidden" : "visible";
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupSmoothScroll() {
  // Somente âncoras internas
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setupSectionSpy() {
  const links = [...document.querySelectorAll(".nav__link[data-section]")];
  const sections = links
    .map((l) => document.getElementById(l.dataset.section))
    .filter(Boolean);

  if (links.length === 0 || sections.length === 0) return;

  const setActive = (id) => {
    links.forEach((l) =>
      l.classList.toggle("is-active", l.dataset.section === id)
    );
  };

  // IntersectionObserver dá um highlight mais estável
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActive(visible.target.id);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] }
  );

  sections.forEach((s) => io.observe(s));
}
