const body=document.body;
const theme=document.getElementById('theme');
const sidebar=document.getElementById('sidebar');
const mobileMenu=document.getElementById('mobileMenu');
const saved=localStorage.getItem('rintu-theme');
if(saved==='light') body.classList.add('light');
const updateThemeControl=()=>{
  if(!theme) return;
  const light=body.classList.contains('light');
  const icon=theme.querySelector('.theme-icon');
  const copy=theme.querySelector('.theme-copy small');
  if(icon) icon.textContent=light?'☀':'☾';
  if(copy) copy.textContent=light?'Switch to dark mode':'Switch to light mode';
  theme.setAttribute('aria-label', light?'Switch to dark mode':'Switch to light mode');
};
updateThemeControl();
theme?.addEventListener('click',()=>{
  body.classList.toggle('light');
  localStorage.setItem('rintu-theme',body.classList.contains('light')?'light':'dark');
  updateThemeControl();
});
const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.1});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
document.getElementById('year').textContent=new Date().getFullYear();

const sections=[...document.querySelectorAll('section[id]')];
const links=[...document.querySelectorAll('.side-nav a')];
const setActiveLink=id=>links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+id));
const updateActiveLink=()=>{
  const marker=window.scrollY+window.innerHeight*.35;
  let current='home';
  sections.forEach(section=>{
    if(section.offsetTop<=marker) current=section.id;
  });
  setActiveLink(current);
};
window.addEventListener('scroll',updateActiveLink,{passive:true});
window.addEventListener('resize',updateActiveLink);
links.forEach(link=>link.addEventListener('click',()=>{
  setActiveLink(link.getAttribute('href').slice(1));
  requestAnimationFrame(updateActiveLink);
}));
updateActiveLink();


const stickyTheme = document.getElementById('stickyTheme');
const mobileOverlay = document.getElementById('mobileOverlay');

function syncThemeUI(){
  const isLight = document.body.classList.contains('light');
  if (typeof theme !== 'undefined' && theme) {
    theme.innerHTML = isLight
      ? '<span class="theme-icon" aria-hidden="true">☾</span><span class="theme-copy"><b>Appearance</b><small>Switch to dark mode</small></span>'
      : '<span class="theme-icon" aria-hidden="true">☼</span><span class="theme-copy"><b>Appearance</b><small>Switch to light mode</small></span>';
  }
  if (stickyTheme){
    stickyTheme.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    stickyTheme.innerHTML = isLight
      ? '<span class="sticky-theme-icon" aria-hidden="true">☾</span><span class="sticky-label">Dark mode</span>'
      : '<span class="sticky-theme-icon" aria-hidden="true">☼</span><span class="sticky-label">Light mode</span>';
  }
}
function toggleTheme(){
  document.body.classList.toggle('light');
  localStorage.setItem('rintu-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  syncThemeUI();
}
stickyTheme?.addEventListener('click', toggleTheme);

const originalThemeButton = document.getElementById('theme');
originalThemeButton?.addEventListener('click', toggleTheme);

function setMobileNavigation(open){
  const isMobile=window.matchMedia('(max-width: 900px)').matches;
  const shouldOpen=isMobile&&open;
  sidebar?.classList.toggle('open',shouldOpen);
  mobileOverlay?.classList.toggle('show',shouldOpen);
  body.classList.toggle('menu-open',shouldOpen);
  mobileMenu?.setAttribute('aria-expanded',String(shouldOpen));
  mobileMenu?.setAttribute('aria-label',shouldOpen?'Close navigation':'Open navigation');
}

mobileMenu?.addEventListener('click',()=>setMobileNavigation(!sidebar?.classList.contains('open')));
mobileOverlay?.addEventListener('click',()=>setMobileNavigation(false));
document.querySelectorAll('.side-nav a').forEach(a=>a.addEventListener('click',()=>setMobileNavigation(false)));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape') setMobileNavigation(false);
});
window.addEventListener('resize',()=>setMobileNavigation(sidebar?.classList.contains('open')));
syncThemeUI();
