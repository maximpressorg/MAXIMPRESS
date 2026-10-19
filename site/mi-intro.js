/* MaxImpress 11.12 — accessible, first-entry brand intro. */
(function(){
  'use strict';
  const root=document.documentElement;
  const splash=document.getElementById('mi-entry-splash');
  if(!splash) return;
  if(root.getAttribute('data-mi-splash')!=='show') { splash.remove(); return; }
  splash.setAttribute('aria-hidden','false');
  let ended=false, timer;
  const finish=()=>{
    if(ended)return;
    ended=true;
    clearTimeout(timer);
    try{ sessionStorage.setItem('maximpress-intro-seen-1112','1'); } catch(e){}
    splash.classList.add('mi-entry-exit');
    splash.setAttribute('aria-hidden','true');
    root.removeAttribute('data-mi-splash');
    setTimeout(()=>splash.remove(),480);
  };
  splash.querySelector('.mi-entry-skip')?.addEventListener('click',finish);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!ended)finish();});
  timer=setTimeout(finish,2350);
})();
