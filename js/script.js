const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const nav = document.querySelector('.nav');
const onScroll = () => nav?.classList.toggle('solid', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if(cursor){ cursor.style.left = mx+'px'; cursor.style.top = my+'px'; }
});
const animRing = () => {
  if(ring){ rx += (mx-rx)*.12; ry += (my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; }
  requestAnimationFrame(animRing);
};
animRing();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => { if(cursor){ cursor.style.width='18px'; cursor.style.height='18px'; }});
  el.addEventListener('mouseleave', () => { if(cursor){ cursor.style.width='10px'; cursor.style.height='10px'; }});
});

document.querySelectorAll('.svc-item').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});

const ham = document.querySelector('.nav-ham');
const navLinks = document.querySelector('.nav-links');
if(ham && navLinks){
  ham.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    if(open){ Object.assign(navLinks.style,{display:'flex',flexDirection:'column',alignItems:'flex-start',position:'fixed',top:'72px',left:'0',right:'0',background:'rgba(5,5,10,.97)',padding:'20px 6%',borderBottom:'1px solid rgba(255,255,255,.06)',backdropFilter:'blur(30px)',zIndex:'700',gap:'4px'});
    } else { navLinks.removeAttribute('style'); }
  });
}
