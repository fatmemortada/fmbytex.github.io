
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("visible"));
}

document.querySelectorAll("form").forEach(form => {
  if (form.dataset.fmbytexHandled === "true") return;
  if (form.id === "fmbytexContactForm") return;
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const business = data.get("business") || "";
    const service = data.get("service") || "";
    const message = data.get("message") || "";
    const subject = encodeURIComponent("New FMBytex Website Request");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBusiness: ${business}\nService: ${service}\n\nMessage:\n${message}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=fatmemortada88@gmail.com&su=${subject}&body=${body}`, "_blank", "noopener,noreferrer");
  });
});

(function () {
  const fmbytexWhatsAppUrl = "https://wa.me/14383736655?text=Hi%20FMBytex%2C%20I%20would%20like%20to%20request%20a%20website%20for%20my%20business.";
  if (!document.querySelector(".whatsapp-float")) {
    const whatsappButton = document.createElement("a");
    whatsappButton.href = fmbytexWhatsAppUrl;
    whatsappButton.className = "whatsapp-float";
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
    whatsappButton.setAttribute("aria-label", "Contact FMBytex on WhatsApp");
    whatsappButton.innerHTML = "✆";
    document.body.appendChild(whatsappButton);
  }
})();
