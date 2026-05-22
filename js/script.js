
document.querySelectorAll('.menu-btn').forEach(btn=>{
  btn.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open'));
});
const els=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
 const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.12});
 els.forEach((el,i)=>{el.style.transitionDelay=(i%5)*70+'ms';ob.observe(el)});
}else{els.forEach(el=>el.classList.add('visible'))}
