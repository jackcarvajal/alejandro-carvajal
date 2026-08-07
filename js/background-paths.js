/* Alejandro CAD/CAM — Background paths (Vanilla JS)
   Líneas curvas fluyendo como fondo de hero. Animación CSS (sin framer-motion).
   Uso: <div data-bg-paths></div> como primer hijo del hero + este script.
   Respeta prefers-reduced-motion (líneas estáticas y sutiles). */
(function(){
  "use strict";
  if (window.__bgPaths) return; window.__bgPaths = 1;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  if(!document.getElementById('bgp-css')){
    var st=document.createElement('style'); st.id='bgp-css';
    st.textContent =
      ".bgp{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;color:var(--gold,#D4AF37)}"+
      ".bgp-svg{width:100%;height:100%;display:block}"+
      ".bgp-line{stroke-dasharray:180 220}"+
      "@media(prefers-reduced-motion:no-preference){.bgp-line{stroke-dasharray:180 220;animation-name:bgp-flow;animation-timing-function:linear;animation-iteration-count:infinite}"+
      "@keyframes bgp-flow{from{stroke-dashoffset:0}to{stroke-dashoffset:-400}}}"+
      "@media(prefers-reduced-motion:reduce){.bgp-line{stroke-dasharray:none;animation:none}}";
    document.head.appendChild(st);
  }

  function pathD(i, pos){
    var a=380-i*5*pos, b=189+i*6, c=312-i*5*pos, e=216-i*6, f=152-i*5*pos, g=343-i*6, h=616-i*5*pos, k=470-i*6, m=684-i*5*pos, n=875-i*6;
    return "M-"+a+" -"+b+"C-"+a+" -"+b+" -"+c+" "+e+" "+f+" "+g+"C"+h+" "+k+" "+m+" "+n+" "+m+" "+n;
  }

  function build(mount){
    mount.classList.add('bgp');
    var svg='<svg class="bgp-svg" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
    [1,-1].forEach(function(pos){
      for(var i=0;i<36;i++){
        var w=(0.5+i*0.03).toFixed(2), op=(0.08+i*0.028).toFixed(3), dur=(16+(i%12)*1.3).toFixed(1);
        svg+='<path d="'+pathD(i,pos)+'" stroke="currentColor" stroke-width="'+w+'" stroke-opacity="'+op+'" fill="none" class="bgp-line"'+(reduce?'':' style="animation-duration:'+dur+'s"')+'/>';
      }
    });
    svg+='</svg>';
    mount.innerHTML=svg;
  }

  function init(){
    var list=document.querySelectorAll('[data-bg-paths]');
    for(var i=0;i<list.length;i++) build(list[i]);
  }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
