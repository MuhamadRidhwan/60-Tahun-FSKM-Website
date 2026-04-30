const IS_LOCAL =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost";

const BASE_PATH = "/";

const COUNTER_PATH = "/counter.php";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeader();
  await loadFooter();

  setupScrollTopButton();
  revealOnScroll();
  loadVisitorCount();

  window.addEventListener("hashchange", setActiveNav);

  window.addEventListener("scroll", () => {
    toggleScrollButton();
    revealOnScroll();
  });
});

async function loadHeader() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  const possiblePaths = [
    `${BASE_PATH}partials/header.html`,
    `${BASE_PATH}header.html`,
    "partials/header.html",
    "header.html",
    "../partials/header.html",
    "../header.html"
  ];

  const html = await fetchFirstAvailable(possiblePaths, "header.html");

  if (!html) {
    headerPlaceholder.innerHTML = `
      <div style="padding:15px;background:#fee;color:#900;text-align:center;">
        Header failed to load. Check header.html path.
      </div>
    `;
    return;
  }

  headerPlaceholder.innerHTML = html;

  setupDynamicPaths();
  setActiveNav();
  setupMobileDropdown(); // <<< ADD THIS
}

async function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  const possiblePaths = [
    `${BASE_PATH}partials/footer.html`,
    `${BASE_PATH}footer.html`,
    "partials/footer.html",
    "footer.html",
    "../partials/footer.html",
    "../footer.html"
  ];

  const html = await fetchFirstAvailable(possiblePaths, "footer.html");

  if (!html) {
    footerPlaceholder.innerHTML = `
      <div style="padding:15px;background:#fee;color:#900;text-align:center;">
        Footer failed to load. Check footer.html path.
      </div>
    `;
    return;
  }

  footerPlaceholder.innerHTML = html;

  loadVisitorCount();
}

async function fetchFirstAvailable(paths, label) {
  for (const path of paths) {
    try {
      const response = await fetch(path, { cache: "no-store" });

      if (response.ok) {
        console.log(`${label} loaded from:`, path);
        return await response.text();
      }
    } catch (error) {
      console.warn(`${label} failed path:`, path);
    }
  }

  console.error(`${label} could not be loaded from any path.`);
  return null;
}

function setupDynamicPaths() {
  document.querySelectorAll("[data-href]").forEach(element => {
    const relativePath = element.getAttribute("data-href");
    if (!relativePath) return;

    element.setAttribute("href", makeFullPath(relativePath));
  });

  document.querySelectorAll("[data-src]").forEach(element => {
    const relativePath = element.getAttribute("data-src");
    if (!relativePath) return;

    element.setAttribute("src", makeFullPath(relativePath));
  });
}

function makeFullPath(relativePath) {
  if (
    relativePath.startsWith("http://") ||
    relativePath.startsWith("https://") ||
    relativePath.startsWith("#") ||
    relativePath.startsWith("mailto:") ||
    relativePath.startsWith("tel:")
  ) {
    return relativePath;
  }

  return BASE_PATH + relativePath.replace(/^\/+/, "");
}

function loadVisitorCount() {
  const visitorCount = document.getElementById("visitor-count");
  if (!visitorCount) return;

  fetch(COUNTER_PATH, { cache: "no-store" })
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
  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname.replace(/\/index\.html$/, "/");
  const currentHash = currentUrl.hash;

  const navLinks = document.querySelectorAll(".main-nav a");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  navLinks.forEach(link => link.classList.remove("active"));
  if (dropdownToggle) dropdownToggle.classList.remove("active");

  if (currentPath.includes("/programs/")) {
    if (dropdownToggle) dropdownToggle.classList.add("active");
    return;
  }

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    const linkUrl = new URL(href, window.location.origin);
    const linkPath = linkUrl.pathname.replace(/\/index\.html$/, "/");
    const linkHash = linkUrl.hash;

    if (currentHash) {
      if (currentPath === linkPath && currentHash === linkHash) {
        link.classList.add("active");
      }
      return;
    }

    if (
      currentPath === linkPath &&
      (!linkHash || linkHash === "#home")
    ) {
      link.classList.add("active");
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


function setupMobileDropdown() {
  const dropdown = document.querySelector(".dropdown");
  const toggle = document.querySelector(".dropdown-toggle");

  if (!dropdown || !toggle) return;

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", function () {
    dropdown.classList.remove("open");
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
