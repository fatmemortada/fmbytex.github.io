// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
}, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Nav solid on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => nav?.classList.toggle('solid', window.scrollY > 30), { passive: true });

// Custom cursor
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  if(cursor){ cursor.style.left=mx+'px'; cursor.style.top=my+'px'; }
});
(function animRing(){ 
  if(ring){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; }
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter',()=>{ if(cursor){cursor.style.width='20px';cursor.style.height='20px';}});
  el.addEventListener('mouseleave',()=>{ if(cursor){cursor.style.width='10px';cursor.style.height='10px';}});
});

// Mobile nav
const ham = document.querySelector('.nav-ham');
const links = document.querySelector('.nav-links');
if(ham && links){
  ham.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    if(open){
      Object.assign(links.style,{
        display:'flex',flexDirection:'column',alignItems:'flex-start',
        position:'fixed',top:'76px',left:'0',right:'0',
        background:'rgba(251,247,239,.97)',padding:'20px 6%',
        borderBottom:'1px solid rgba(185,142,79,.22)',
        backdropFilter:'blur(24px)',zIndex:'700',gap:'4px'
      });
    } else { links.removeAttribute('style'); }
  });
}
