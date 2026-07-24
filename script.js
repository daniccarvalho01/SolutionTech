const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .filter((link) => link.getAttribute("href").startsWith("#"))
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const formStatus = document.querySelector("[data-form-status]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

if (sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Contato pelo site - ${data.get("servico")}`);
    const body = encodeURIComponent(
      `Olá, conhecemos a SOLUTION TECH pelo site.\n\nNome: ${data.get("nome")}\nE-mail: ${data.get("email")}\nServiço de interesse: ${data.get("servico")}\n\nDemanda que queremos melhorar:\n${data.get("mensagem")}\n\nGostaríamos de agendar um diagnóstico gratuito de 20 minutos e receber uma orientação inicial sobre próximos passos.`
    );

    formStatus.textContent = "Abrindo o aplicativo de e-mail com a mensagem preparada...";
    window.location.href = `mailto:daniela.suppino@gmail.com?subject=${subject}&body=${body}`;
  });
}

const readCounter = document.querySelector("[data-read-counter]");

if (readCounter) {
  const countTarget = readCounter.querySelector("[data-read-count]");
  const baseCount = Number(readCounter.dataset.readBase || 0);
  const storageKey = `solution-tech-read-${window.location.pathname}`;
  const hasCounted = localStorage.getItem(storageKey);
  const currentCount = baseCount + (hasCounted ? 0 : 1);

  if (!hasCounted) {
    localStorage.setItem(storageKey, "1");
  }

  countTarget.textContent = new Intl.NumberFormat("pt-BR").format(currentCount);
}
