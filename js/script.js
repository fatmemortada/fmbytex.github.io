const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const ham = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-menu');
if(ham && menu) {
  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('mobile-open');
    if(open) {
      Object.assign(menu.style, {
        display:'flex', flexDirection:'column', alignItems:'flex-start',
        position:'fixed', top:'76px', left:'0', right:'0',
        background:'rgba(8,12,20,.97)', padding:'20px 5%',
        borderBottom:'1px solid rgba(255,255,255,.06)',
        backdropFilter:'blur(24px)', zIndex:'800', gap:'4px',
      });
    } else { menu.removeAttribute('style'); }
  });
}
