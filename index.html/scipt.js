document.addEventListener("DOMContentLoaded", () => {

  // ===== SELECTORS =====
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");
  const header = document.querySelector("header");
  const wrapper = document.querySelector(".projects-wrapper");
  const grid = document.querySelector(".project-grid");

  // ===== SMOOTH SCROLL =====
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(link.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    });
  });

  // ===== ACTIVE NAV =====
  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // ===== NAVBAR EFFECT =====
  window.addEventListener("scroll", () => {
    header.style.background =
      window.scrollY > 50
        ? "rgba(15,15,15,0.95)"
        : "rgba(15,15,15,0.9)";
  });

  // ===== SCROLL REVEAL =====
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  });

  document.querySelectorAll("section, .case").forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
  });

  // ===== TYPING EFFECT =====
  const heroText = document.querySelector("#home h2");
  const text = "Full Stack Web Developer";
  let i = 0;

  heroText.textContent = "";

  function type() {
    if (i < text.length) {
      heroText.textContent += text[i++];
      setTimeout(type, 60);
    }
  }
  type();

  // ===== AUTO SCROLL SYSTEM =====
  let scrollX = 0;
  let speed = 0.4;
  let velocity = 0;
  let friction = 0.92;
  let isPaused = false;

  grid.innerHTML += grid.innerHTML;

  // ===== TRANSFORM ENGINE =====
  const cards = document.querySelectorAll(".project-card");

  cards.forEach(card => {
    card.state = {
      floatX: 0,
      tiltX: 0,
      tiltY: 0,
      scale: 1,
      magX: 0,
      magY: 0
    };

    card.style.willChange = "transform";
  });

  function applyTransform(card) {
    const s = card.state;

    card.style.transform = `
      translateX(${s.floatX}px)
      translate(${s.magX}px, ${s.magY}px)
      rotateX(${s.tiltX}deg)
      rotateY(${s.tiltY}deg)
      scale(${s.scale})
    `;
  }

  // ===== VISIBILITY CONTROL =====
  let active = false;

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => active = entry.isIntersecting);
  });

  sectionObserver.observe(document.querySelector("#projects"));

  // ===== MAIN LOOP =====
  function animate() {
    if (!isPaused && active) {
      scrollX += speed + velocity;
      velocity *= friction;

      if (scrollX >= grid.scrollWidth / 2) scrollX = 0;
    }

    cards.forEach(card => {
      card.state.floatX = -scrollX;
      applyTransform(card);
    });

    requestAnimationFrame(animate);
  }

  animate();

  // ===== WHEEL =====
  wrapper.addEventListener("wheel", e => {
    e.preventDefault();
    velocity += e.deltaY * 0.01;
  });

  // ===== DRAG =====
  let isDown = false;
  let startX;

  wrapper.addEventListener("mousedown", e => {
    isDown = true;
    startX = e.pageX;
  });

  window.addEventListener("mouseup", () => isDown = false);

  window.addEventListener("mousemove", e => {
    if (!isDown) return;

    const move = e.pageX - startX;
    scrollX -= move * 0.5;
    startX = e.pageX;
  });

  // ===== HOVER PAUSE =====
  wrapper.addEventListener("mouseenter", () => isPaused = true);
  wrapper.addEventListener("mouseleave", () => isPaused = false);

  // ===== TILT + MAGNETIC =====
  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.state.tiltX = -(y - rect.height / 2) / 12;
      card.state.tiltY = (x - rect.width / 2) / 12;

      card.state.magX = (x / rect.width - 0.5) * 10;
      card.state.magY = (y / rect.height - 0.5) * 10;

      applyTransform(card);
    });

    card.addEventListener("mouseleave", () => {
      card.state.tiltX = 0;
      card.state.tiltY = 0;
      card.state.magX = 0;
      card.state.magY = 0;

      applyTransform(card);
    });
  });

  // ===== CENTER SCALE =====
  function focusLoop() {
    const center = window.innerWidth / 2;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;

      const dist = Math.abs(center - cardCenter);
      const scale = Math.max(1, 1.2 - dist / 600);

      card.state.scale = scale;
      applyTransform(card);
    });

    requestAnimationFrame(focusLoop);
  }

  focusLoop();

  // ===== CURSOR GLOW =====
  const glow = document.createElement("div");

  Object.assign(glow.style, {
    position: "fixed",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,255,204,0.15), transparent 70%)",
    zIndex: "0"
  });

  document.body.appendChild(glow);

  document.addEventListener("mousemove", e => {
    glow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
  });

  // ===== SIDE PROGRESS BAR =====
  const bar = document.createElement("div");

  bar.style.cssText = `
    position: fixed;
    right: 10px;
    top: 50%;
    width: 4px;
    height: 200px;
    background: #222;
    z-index: 2000;
  `;

  const indicator = document.createElement("div");

  indicator.style.cssText = `
    width: 100%;
    height: 20px;
    background: #00ffcc;
    position: absolute;
    top: 0;
  `;

  bar.appendChild(indicator);
  document.body.appendChild(bar);

  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    indicator.style.top = (window.scrollY / h) * 180 + "px";
  });

});