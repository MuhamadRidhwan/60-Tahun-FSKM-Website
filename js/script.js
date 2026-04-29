const BASE_PATH =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
    ? "/"
    : "/sambutan-60-tahun-fskm/";

const COUNTER_PATH =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
    ? "/counter.php"
    : "/counter.php"; // sebab anda simpan di public_html root

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeader();
  await loadFooter();

  setupDynamicPaths();
  setActiveNav();
  setupScrollTopButton();
  revealOnScroll();
  loadVisitorCount();

  window.addEventListener("scroll", () => {
    toggleScrollButton();
    revealOnScroll();
  });
});

async function loadHeader() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  try {
    const response = await fetch(`${BASE_PATH}partials/header.html`);
    if (!response.ok) throw new Error("Gagal memuatkan header.html");
    const data = await response.text();
    headerPlaceholder.innerHTML = data;
  } catch (error) {
    console.error("Ralat header:", error);
  }
}

async function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  try {
    const response = await fetch(`${BASE_PATH}partials/footer.html`);
    if (!response.ok) throw new Error("Gagal memuatkan footer.html");
    const data = await response.text();
    footerPlaceholder.innerHTML = data;
  } catch (error) {
    console.error("Ralat footer:", error);
  }
}

function setupDynamicPaths() {
  document.querySelectorAll("[data-href]").forEach(element => {
    const relativePath = element.getAttribute("data-href");
    element.setAttribute("href", BASE_PATH + relativePath);
  });

  document.querySelectorAll("[data-src]").forEach(element => {
    const relativePath = element.getAttribute("data-src");
    element.setAttribute("src", BASE_PATH + relativePath);
  });
}

function loadVisitorCount() {
  const visitorCount = document.getElementById("visitor-count");
  if (!visitorCount) return;

  fetch(COUNTER_PATH)
    .then(response => {
      if (!response.ok) {
        throw new Error("Gagal memuatkan counter.php");
      }
      return response.text();
    })
    .then(data => {
      visitorCount.innerText = data;
    })
    .catch(error => {
      console.error("Ralat visitor count:", error);
      visitorCount.innerText = "Unavailable";
    });
}

function setActiveNav() {
  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  const currentHash = window.location.hash;

  const navLinks = document.querySelectorAll(".main-nav a");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  navLinks.forEach(link => {
    link.classList.remove("active");
  });

  if (currentPath.includes("/programs/")) {
    if (dropdownToggle) dropdownToggle.classList.add("active");
    return;
  }

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    const url = new URL(href, window.location.origin);
    const linkPath = url.pathname.replace(/\/index\.html$/, "/");
    const linkHash = url.hash;

    if (currentHash) {
      if (currentPath === linkPath && currentHash === linkHash) {
        link.classList.add("active");
      }
    } else {
      if (
        (currentPath === linkPath && !linkHash) ||
        (currentPath === linkPath && linkHash === "#home")
      ) {
        link.classList.add("active");
      }
    }
  });
}

function setupScrollTopButton() {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

function toggleScrollButton() {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
}

function revealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");

  revealElements.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("show");
    }
  });
}