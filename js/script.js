// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile nav
const btn = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');
if(btn && links){
  btn.addEventListener('click', () => {
    const open = links.classList.contains('mobile-open');
    if(open){
      links.classList.remove('mobile-open');
      links.removeAttribute('style');
    } else {
      links.classList.add('mobile-open');
      Object.assign(links.style, {
        display:'flex', flexDirection:'column', alignItems:'flex-start',
        position:'fixed', top:'72px', left:'0', right:'0',
        background:'rgba(9,9,10,.96)', padding:'20px 5%',
        borderBottom:'1px solid rgba(255,255,255,.07)',
        gap:'4px', backdropFilter:'blur(20px)'
      });
    }
  });
}
