function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
  document.querySelector(".menu-toggle").classList.toggle("active");

  if (navLinks.classList.contains("active")) {
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 500);
  } else {
    document.removeEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const navLinks = document.querySelector(".nav-links");
  const menuToggle = document.querySelector(".menu-toggle");

  if (!navLinks.contains(event.target)) {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");

    document.removeEventListener("click", handleOutsideClick);
  }
}
