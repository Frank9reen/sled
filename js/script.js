(() => {
  const METRIKA_ID = 111886962;

  const reachGoal = (name) => {
    if (typeof ym === "function") {
      ym(METRIKA_ID, "reachGoal", name);
    }
  };

  document.querySelectorAll("[data-goal]").forEach((el) => {
    el.addEventListener("click", () => {
      reachGoal(el.dataset.goal);
    });
  });

  const scrollSections = [
    { id: "cases", goal: "scroll_cases" },
    { id: "kit", goal: "scroll_kit" },
    { id: "faq", goal: "scroll_faq" },
  ];

  if ("IntersectionObserver" in window) {
    const scrollIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reachGoal(entry.target.dataset.scrollGoal);
          scrollIo.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    scrollSections.forEach(({ id, goal }) => {
      const section = document.getElementById(id);
      if (!section) return;
      section.dataset.scrollGoal = goal;
      scrollIo.observe(section);
    });
  }

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  const hero = document.querySelector(".hero");
  const parallaxLayers = document.querySelectorAll(".hero-parallax");
  const heroContent = document.querySelector(".hero-content");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.matchMedia("(max-width: 768px)").matches;
  const useParallax = hero && parallaxLayers.length && !reduceMotion && !coarsePointer && !narrowViewport;

  if (useParallax) {
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

    const applyParallax = () => {
      const y = window.scrollY;

      parallaxLayers.forEach((layer) => {
        const speed = Number(layer.dataset.speed || 0.32);
        const mouseFactor = Number(layer.dataset.mouse || 18);
        const tx = mouseX * mouseFactor;
        const ty = y * speed + mouseY * (mouseFactor * 0.65);
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });

      if (heroContent) {
        heroContent.style.transform = `translate3d(${mouseX * -22}px, ${mouseY * -16}px, 0)`;
      }

      const stamp = document.querySelector(".hero-stamp");
      if (stamp) {
        stamp.style.transform = `rotate(-8deg) translate3d(${mouseX * 28}px, ${mouseY * 20}px, 0)`;
      }
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyParallax);
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });

    hero.addEventListener(
      "mousemove",
      (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        requestTick();
      },
      { passive: true }
    );

    hero.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
      requestTick();
    });

    applyParallax();
  } else if (hero) {
    hero.classList.add("hero--static");
  }

  const revealTargets = document.querySelectorAll(
    ".step, .case-tile, .case-row, .evidence-list li, .quotes blockquote"
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el, i) => {
      if (el.matches(".evidence-list li")) {
        el.style.transitionDelay = `${(i % 8) * 0.06}s`;
      }
      if (el.matches(".quotes blockquote")) {
        el.style.transitionDelay = `${(i % 3) * 0.1}s`;
      }
      io.observe(el);
    });
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }
})();
