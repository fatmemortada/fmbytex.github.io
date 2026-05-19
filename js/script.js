
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => observer.observe(el));

document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const service = data.get("service") || "";
    const message = data.get("message") || "";
    const subject = encodeURIComponent("New FM Systems Website Request");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:fatmemortada88@gmail.com?subject=${subject}&body=${body}`;
  });
});




// FM Systems WhatsApp floating button - FINAL CONTACT BUTTONS
(function () {
  const fmsystemsWhatsAppUrl = "https://wa.me/14383736655?text=Hi%20FM Systems%2C%20I%20would%20like%20to%20request%20a%20website%20for%20my%20business.";

  if (!document.querySelector(".whatsapp-float")) {
    const whatsappButton = document.createElement("a");
    whatsappButton.href = fmsystemsWhatsAppUrl;
    whatsappButton.className = "whatsapp-float";
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
    whatsappButton.setAttribute("aria-label", "Contact FM Systems on WhatsApp");
    whatsappButton.innerHTML = "✆";
    document.body.appendChild(whatsappButton);
  }
})();
