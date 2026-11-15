/* User-supplied SVG paths: only uniform scale and position change. */
(() => {
 const main=document.querySelector('.vision-main'),svg=main.querySelector('.vision-connections');
 const shapes=[{"width": 281.089, "height": 302.0}, {"width": 320.0, "height": 113.0}, {"width": 342.5, "height": 122.0}, {"width": 293.0, "height": 140.0}, {"width": 158.444, "height": 140.0}];
 const ids=['vision-connection-opening','vision-connection-1','vision-connection-2','vision-connection-3','vision-connection-ending'];
 let queued=false;
 function draw(){
  queued=false;
  const base=main.getBoundingClientRect(),mobile=innerWidth<=600;
  const box=s=>{const r=main.querySelector(s).getBoundingClientRect();return {left:r.left-base.left,right:r.right-base.left,top:r.top-base.top,bottom:r.bottom-base.top,cx:(r.left+r.right)/2-base.left,cy:(r.top+r.bottom)/2-base.top}};
  svg.setAttribute('viewBox',`0 0 ${base.width} ${main.scrollHeight}`);
  function place(i,x,y,scale){document.getElementById(ids[i]).setAttribute('transform',`translate(${x} ${y}) scale(${Math.max(.01,scale)})`)}
  const title=box('#vision-title span'),belief=box('.vision-beliefs h2 span');
  const sx=title.right+(mobile?12:24),sy=title.cy;
  const introScale=Math.min((belief.cy-sy)/297,(base.width-20-sx)/(shapes[0].width-2.5));
  place(0,sx-2.5*introScale,sy-2.5*introScale,introScale);
  const texts=[1,2,3,4].map(i=>box(`.skill-stop-${i}`));
  const rows=[1,2,3,4].map(i=>box(`.skill-row-${i}`));
  const photos=[1,2,3,4].map(i=>box(`.skill-row-${i} .skill-photo`));
  for(let i=1;i<=3;i++){
   const top=Math.max(rows[i-1].bottom,photos[i-1].bottom)+20;
   const bottom=Math.min(rows[i].top,photos[i].top)-20;
   const availableWidth=mobile?base.width*.65:Math.abs(texts[i].cx-texts[i-1].cx);
   const scale=Math.min(availableWidth/shapes[i].width,(bottom-top)/shapes[i].height);
   const center=mobile?base.width*.5:(texts[i].cx+texts[i-1].cx)/2;
   place(i,center-shapes[i].width*scale/2,top+(bottom-top-shapes[i].height*scale)/2,scale);
  }
  const end=box('.vision-ending h2');
  const top=Math.max(rows[3].bottom,photos[3].bottom)+20,bottom=end.top-24;
  const scale=Math.min((bottom-top)/shapes[4].height,base.width*.32/shapes[4].width);
  // SVG 5 ends at x=2.5, y=137.5: align that endpoint with the final heading.
  place(4,end.cx-2.5*scale,bottom-137.5*scale,scale);
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(draw)}};
 new ResizeObserver(schedule).observe(main);
 window.addEventListener('resize',schedule);
 document.fonts.ready.then(schedule);
 main.querySelectorAll('img').forEach(img=>img.addEventListener('load',schedule));
 schedule();
})();
