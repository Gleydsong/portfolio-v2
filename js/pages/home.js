import "/css/styles.css";
import { initSiteUI, setYear } from "../site.js";
import { createTimeline, utils } from "animejs";

initSiteUI({ enableSectionSpy: true });
setYear();

setupCardAnimations();
setupCopyEmail();
setupContactForm();

function setupCardAnimations() {
  const shuffleFn = utils?.shuffle || shuffleArray;

  const skillsGrid = document.querySelector(".cards-3");
  const projectsGrid = document.querySelector(".projects-grid");
  const skillsItems = skillsGrid ? [...skillsGrid.querySelectorAll(".card")] : [];
  const projectItems = projectsGrid ? [...projectsGrid.querySelectorAll(".project")] : [];
  if (skillsItems.length === 0 && projectItems.length === 0) return;

  if (skillsGrid) {
    setupShuffleOnHover(skillsGrid, ".card", shuffleFn);
  }
  if (projectsGrid) {
    setupShuffleOnHover(projectsGrid, ".project", shuffleFn);
  }

  const allCards = skillsItems.concat(projectItems);
  allCards.forEach((card) => setupHoverAnimation(card));
}

function shuffleCards(container, items, shuffleFn) {
  let list = items.slice();
  const result = shuffleFn(list);
  if (Array.isArray(result)) list = result;

  const fragment = document.createDocumentFragment();
  list.forEach((item) => fragment.appendChild(item));
  container.appendChild(fragment);
}

function shuffleArray(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function setupShuffleOnHover(container, itemSelector, shuffleFn) {
  const supportsPointer = "PointerEvent" in window;

  const runShuffle = (event) => {
    if (event?.pointerType && event.pointerType !== "mouse") return;
    const items = [...container.querySelectorAll(itemSelector)];
    if (items.length < 2) return;
    shuffleCards(container, items, shuffleFn);
  };

  if (supportsPointer) {
    container.addEventListener("pointerenter", runShuffle);
  } else {
    container.addEventListener("mouseenter", runShuffle);
  }
}

function setupHoverAnimation(card) {
  let active = null;
  card.style.willChange = "transform, box-shadow";
  const supportsPointer = "PointerEvent" in window;

  const playIn = () => {
    if (active?.pause) active.pause();
    active = createTimeline({
      autoplay: false,
      defaults: {
        duration: 140,
        ease: "outCubic",
      },
    });
    active
      .add(card, {
        translateY: -8,
        scale: 1.02,
        boxShadow: "0 18px 60px rgba(0, 0, 0, 0.45)",
      })
      .add(card, {
        translateY: -6,
        scale: 1.015,
        duration: 160,
        ease: "outExpo",
      });
    active.play();
  };

  const playOut = () => {
    if (active?.pause) active.pause();
    active = createTimeline({
      autoplay: false,
      defaults: {
        duration: 180,
        ease: "outCubic",
      },
    });
    active.add(card, {
      translateY: 0,
      scale: 1,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
    });
    active.play();
  };

  if (supportsPointer) {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      playIn();
    });
    card.addEventListener("pointerleave", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      playOut();
    });
  } else {
    card.addEventListener("mouseenter", playIn);
    card.addEventListener("mouseleave", playOut);
  }
  card.addEventListener("focusin", playIn);
  card.addEventListener("focusout", playOut);
}

function setupCopyEmail() {
  const btn = byId("btnCopyEmail");
  const hint = byId("copyEmailHint");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const email = btn.dataset.copy;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      if (hint) hint.textContent = "Copiado!";
      setTimeout(() => {
        if (hint) hint.textContent = "Clique para copiar";
      }, 1600);
    } catch {
      if (hint) hint.textContent = "Nao foi possivel copiar";
      setTimeout(() => {
        if (hint) hint.textContent = "Clique para copiar";
      }, 1600);
    }
  });
}

function setupContactForm() {
  const form = byId("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validacao simples no front (voce pode trocar por Zod no backend)
    const data = Object.fromEntries(new FormData(form));
    const errors = validateContact(data);

    clearErrors(form);
    if (Object.keys(errors).length > 0) {
      showErrors(form, errors);
      return;
    }

    // Placeholder: aqui voce conecta no backend (POST /api/contact)
    alert("Form pronto. Proximo passo: integrar com sua API (POST /api/contact).");
    form.reset();
  });
}

function validateContact({ name, email, message }) {
  const errs = {};
  if (!String(name || "").trim()) errs.name = "Informe seu nome.";
  if (!isEmail(String(email || ""))) errs.email = "Informe um email valido.";
  if (!String(message || "").trim()) errs.message = "Escreva uma mensagem.";
  return errs;
}

function clearErrors(form) {
  form.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
}

function showErrors(form, errors) {
  Object.entries(errors).forEach(([field, msg]) => {
    const el = form.querySelector("[data-error-for=\"" + field + "\"]");
    if (el) el.textContent = String(msg);
  });
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function byId(id) {
  return document.getElementById(id);
}
