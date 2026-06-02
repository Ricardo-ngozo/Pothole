document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("main section");
  const projectsWrapper = document.querySelector(".projects-wrapper");
  const projectGrid = document.querySelector(".project-grid");
  const projectButtons = document.querySelectorAll(".project-btn");
  const heroTitle = document.querySelector("#home h2");

  if (!nav || !menuToggle) return; // prevent crash

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  function closeMenu() {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    });
  });

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;

    header?.classList.toggle("scrolled", window.scrollY > 35);
    progress.style.width = percent + "%";
  }

  window.addEventListener("scroll", updateProgress);

  // HERO TEXT
  function typeHero() {
    if (!heroTitle) return;

    const text = "Full Stack Web Developer";
    let i = 0;
    heroTitle.textContent = "";

    function type() {
      heroTitle.textContent = text.slice(0, i++);
      if (i <= text.length) setTimeout(type, 55);
    }

    type();
  }

  // SAFE CAROUSEL
  function setupCarousel() {
    if (!projectsWrapper || !projectGrid) return;

    const cards = [...projectGrid.children];
    cards.forEach((c) => projectGrid.appendChild(c.cloneNode(true)));

    let paused = false;

    function loop() {
      if (!paused) {
        projectsWrapper.scrollLeft += 1;
        if (projectsWrapper.scrollLeft >= projectGrid.scrollWidth / 2) {
          projectsWrapper.scrollLeft = 0;
        }
      }
      requestAnimationFrame(loop);
    }

    projectButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        projectsWrapper.scrollBy({
          left: Number(btn.dataset.direction) * 300,
          behavior: "smooth",
        });
      });
    });

    projectsWrapper.addEventListener("mouseenter", () => (paused = true));
    projectsWrapper.addEventListener("mouseleave", () => (paused = false));

    requestAnimationFrame(loop);
  }

  // KEYBOARD FIX
  window.addEventListener("keydown", (e) => {
    if (!projectsWrapper) return;

    if (e.key === "ArrowRight") {
      projectsWrapper.scrollBy({ left: 300, behavior: "smooth" });
    }

    if (e.key === "ArrowLeft") {
      projectsWrapper.scrollBy({ left: -300, behavior: "smooth" });
    }
  });

  typeHero();
  setupCarousel();
});