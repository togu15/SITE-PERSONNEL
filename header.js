'use strict';
// Both pages use this exact header sizing and scroll behaviour.
(() => {
  const root=document.documentElement;
  let queued=false;
  function update(){
    const mobile=matchMedia('(max-width:600px)').matches;
    const scale=root.clientWidth/(mobile?1117:1920);
    const y=Math.max(0,window.scrollY);
    const progress=Math.min(1,y/280);
    const compact=Math.min(1,Math.max(0,(y-280)/160));
    root.style.setProperty('--scale',scale);
    root.style.setProperty('--progress',progress);
    root.style.setProperty('--compact',compact);
    // Use the window width for the header on both pages, independent of scrollbars.
    // Round rendered text metrics to whole pixels; never zoom the text container.
    const headerScale=window.innerWidth/(mobile?1117:1920);
    const px=n=>Math.round(n*headerScale);
    const height=px((mobile?180:132)-(mobile?27:30)*compact);
    const logoFactor=mobile?1.5:1;
    const logoHeight=px(72*logoFactor);
    const line=px(mobile?38.4:30),padding=px(16);
    const values={
      '--header-height':height,
      '--brand-width':px(210*logoFactor),'--logo-width':px(150*logoFactor),
      '--logo-height':logoHeight,'--logo-left':px(30*logoFactor),
      '--logo-top':Math.round((height-logoHeight)/2),
      '--menu-outer':mobile?Math.max(0,Math.round((height-line)/2)-padding):px(20),
      '--menu-padding':padding,'--menu-font':px(mobile?32:25),'--menu-line':line
    };
    for(const [name,value] of Object.entries(values))root.style.setProperty(name,value+'px');
    queued=false;
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}
  update();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  new ResizeObserver(schedule).observe(root);
})();
