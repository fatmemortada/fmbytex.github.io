// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
}, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Nav scroll solid
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => nav?.classList.toggle('solid', window.scrollY > 30), { passive: true });

// Custom cursor
const cur = document.getElementById('cur');
const curR = document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  if(cur){ cur.style.left=mx+'px'; cur.style.top=my+'px'; }
});
(function anim(){
  if(curR){ rx+=(mx-rx)*.13; ry+=(my-ry)*.13; curR.style.left=rx+'px'; curR.style.top=ry+'px'; }
  requestAnimationFrame(anim);
})();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter',()=>{ if(cur){cur.style.width='16px';cur.style.height='16px';}});
  el.addEventListener('mouseleave',()=>{ if(cur){cur.style.width='8px';cur.style.height='8px';}});
});

// Work row hover image
const hoverImg = document.getElementById('hoverImg');
const hoverSrc = document.getElementById('hoverImgSrc');
if(hoverImg && hoverSrc){
  document.querySelectorAll('.work-row[data-img]').forEach(row => {
    row.addEventListener('mouseenter', () => {
      const src = row.dataset.img;
      if(hoverSrc.src !== src) hoverSrc.src = src;
      hoverImg.classList.add('show');
    });
    row.addEventListener('mousemove', e => {
      hoverImg.style.left = (e.clientX + 24) + 'px';
      hoverImg.style.top  = (e.clientY - 110) + 'px';
    });
    row.addEventListener('mouseleave', () => hoverImg.classList.remove('show'));
  });
}

// Mobile nav
const ham = document.querySelector('.nav-ham');
const links = document.querySelector('.nav-links');
if(ham && links){
  ham.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
    ham.textContent = open ? '✕' : '☰';
    if(open){ Object.assign(links.style,{display:'flex',flexDirection:'column',position:'fixed',top:'64px',left:'0',right:'0',background:'rgba(251,247,239,.97)',padding:'20px 5%',borderBottom:'1px solid rgba(44,38,31,.1)',backdropFilter:'blur(20px)',zIndex:'700',gap:'0'}); }
    else { links.removeAttribute('style'); }
  });
}
