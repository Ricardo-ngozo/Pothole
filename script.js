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

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  function closeMenu() {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    });
  });

  function updateHeaderAndProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progressWidth = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    header.classList.toggle("scrolled", window.scrollY > 35);
    progress.style.width = `${progressWidth}%`;
  }

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll("section, .case, .project-card, .skill").forEach((element) => {
    element.classList.add("hidden");
    revealObserver.observe(element);
  });

  function typeHeroText() {
    const text = "Full Stack Web Developer";
    let index = 0;

    heroTitle.textContent = "";

    function type() {
      heroTitle.textContent = text.slice(0, index);
      index += 1;

      if (index <= text.length) {
        window.setTimeout(type, 55);
      }
    }

    type();
  }

  function setupProjectCarousel() {
    if (!projectsWrapper || !projectGrid) return;

    const originalCards = Array.from(projectGrid.children);
    originalCards.forEach((card) => projectGrid.appendChild(card.cloneNode(true)));

    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;
    let lastTime = 0;

    const getLoopPoint = () => projectGrid.scrollWidth / 2;
    const getStep = () => {
      const card = projectGrid.querySelector(".project-card");
      const gap = parseFloat(getComputedStyle(projectGrid).gap) || 24;
      return card ? card.offsetWidth + gap : 320;
    };

    function keepInLoop() {
      const loopPoint = getLoopPoint();

      if (projectsWrapper.scrollLeft >= loopPoint) {
        projectsWrapper.scrollLeft -= loopPoint;
      }

      if (projectsWrapper.scrollLeft < 0) {
        projectsWrapper.scrollLeft += loopPoint;
      }
    }

    function highlightFocusedCard() {
      const center = projectsWrapper.getBoundingClientRect().left + projectsWrapper.clientWidth / 2;

      projectGrid.querySelectorAll(".project-card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        card.classList.toggle("in-focus", Math.abs(center - cardCenter) < rect.width * 0.55);
      });
    }

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;

      const elapsed = timestamp - lastTime;
      lastTime = timestamp;

      if (!isPaused && !isDragging && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        projectsWrapper.scrollLeft += elapsed * 0.035;
        keepInLoop();
      }

      highlightFocusedCard();
      requestAnimationFrame(animate);
    }

    projectButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = Number(button.dataset.direction);
        projectsWrapper.scrollBy({ left: direction * getStep(), behavior: "smooth" });
      });
    });

    projectsWrapper.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();
      projectsWrapper.scrollLeft += event.deltaY;
      keepInLoop();
    }, { passive: false });

    projectsWrapper.addEventListener("pointerdown", (event) => {
      isDragging = true;
      startX = event.clientX;
      startScroll = projectsWrapper.scrollLeft;
      projectsWrapper.classList.add("dragging");
      projectsWrapper.setPointerCapture(event.pointerId);
    });

    projectsWrapper.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      projectsWrapper.scrollLeft = startScroll - (event.clientX - startX);
      keepInLoop();
    });

    projectsWrapper.addEventListener("pointerup", () => {
      isDragging = false;
      projectsWrapper.classList.remove("dragging");
    });

    projectsWrapper.addEventListener("pointercancel", () => {
      isDragging = false;
      projectsWrapper.classList.remove("dragging");
    });

    projectsWrapper.addEventListener("mouseenter", () => {
      isPaused = true;
    });

    projectsWrapper.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    projectGrid.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = (x / rect.width - 0.5) * 10;
        const rotateX = (0.5 - y / rect.height) * 8;

        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    requestAnimationFrame(animate);
  }

  function setupCursorGlow() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    document.addEventListener("pointermove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();

    if (document.querySelector("#projects.show")) {
      if (event.key === "ArrowRight") {
        projectsWrapper.scrollBy({ left: 320, behavior: "smooth" });
      }

      if (event.key === "ArrowLeft") {
        projectsWrapper.scrollBy({ left: -320, behavior: "smooth" });
      }
    }
  });

  window.addEventListener("scroll", updateHeaderAndProgress, { passive: true });
  window.addEventListener("resize", closeMenu);

  updateHeaderAndProgress();
  typeHeroText();
  setupProjectCarousel();
  setupCursorGlow();
});
