(() => {
  "use strict";

  const cursor = document.querySelector(".cursor");
  const progressBar = document.querySelector(".progress-bar");
  const revealElements = document.querySelectorAll("[data-reveal]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  const interactiveElements = document.querySelectorAll("a, button, .project-link");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && supportsFinePointer && !prefersReducedMotion) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const speed = 0.18;

    window.addEventListener(
      "mousemove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      },
      { passive: true }
    );

    function animateCursor() {
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hovering");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hovering");
      });
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  let scrollTicking = false;

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? scrollTop / documentHeight : 0;

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateScrollProgress);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateScrollProgress();

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const target = link.getAttribute("href");
          link.classList.toggle("active", target === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: "-40% 0px -50% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  document
    .querySelectorAll('.project-link[href="#"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });
})();
