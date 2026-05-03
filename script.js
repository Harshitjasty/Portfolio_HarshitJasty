const reveals = document.querySelectorAll(".reveal");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const magneticItems = document.querySelectorAll(".magnetic");
const cursorGlow = document.querySelector(".cursor-glow");
const sections = [...document.querySelectorAll("main section[id]")];
const internalLinks = document.querySelectorAll('a[href^="#"]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(index * 90, 280)}ms`;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

reveals.forEach((item) => revealObserver.observe(item));

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const getHeaderOffset = () => (siteHeader ? siteHeader.offsetHeight + 20 : 96);

const syncActiveSection = () => {
  const headerOffset = getHeaderOffset();
  const scrollPosition = window.scrollY + headerOffset + window.innerHeight * 0.2;

  let currentSection = sections[0];

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section;
    }
  });

  if (currentSection) {
    setActiveLink(currentSection.id);
  }
};

const closeMobileMenu = () => {
  if (!siteHeader || !navToggle) {
    return;
  }

  siteHeader.classList.remove("is-menu-open");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const handleAnchorNavigation = (event) => {
  const targetId = event.currentTarget.getAttribute("href");

  if (!targetId || !targetId.startsWith("#")) {
    return;
  }

  const targetElement = document.querySelector(targetId);

  if (!targetElement) {
    return;
  }

  event.preventDefault();

  const top = targetElement.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });

  setActiveLink(targetElement.id);
  closeMobileMenu();
};

internalLinks.forEach((link) => {
  link.addEventListener("click", handleAnchorNavigation);
});

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-menu-open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

window.addEventListener("scroll", () => {
  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  syncActiveSection();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMobileMenu();
  }

  syncActiveSection();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

document.addEventListener("pointermove", (event) => {
  const x = `${(event.clientX / window.innerWidth) * 100}%`;
  const y = `${(event.clientY / window.innerHeight) * 100}%`;
  document.documentElement.style.setProperty("--cursor-x", x);
  document.documentElement.style.setProperty("--cursor-y", y);
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const bounds = item.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;

    item.style.transform = `translate(${offsetX * 0.08}px, ${offsetY * 0.08}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -7;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;

    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && cursorGlow) {
  cursorGlow.style.display = "none";
}

syncActiveSection();
