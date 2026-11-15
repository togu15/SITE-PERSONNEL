'use strict';
window.VRCard=(()=>{
 const types={professionnel:['Professionnel','icone-pro.png'],personnel:['Personnel','icone-perso.png'],formation:['Formation','icone-formation.png']};
 function text(parent,value){parent.append(document.createTextNode(value))}
 function highlight(node,value){node.replaceChildren();const parts=String(value||'').split(/(\*\*[^*]+\*\*)/g);for(const part of parts){if(part.startsWith('**')&&part.endsWith('**')&&part.length>4){const strong=document.createElement('strong');strong.textContent=part.slice(2,-2);node.append(strong)}else text(node,part)}}
 function safeFile(value){return typeof value==='string'&&/^assets\/[a-zA-Z0-9_.\/-]+$/.test(value)&&!value.split('/').includes('..')}
 function safeLink(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password}catch{return false}}
 function el(tag,cls,value){const n=document.createElement(tag);if(cls)n.className=cls;if(value)n.textContent=value;return n}
 function stop(node){node.querySelectorAll('video').forEach(v=>v.pause())}
 let lightbox=null;
 function arrow(button,base,left=false){const img=el('img','vr-arrow'+(left?' vr-arrow-left':''));img.src=base+'assets/fleche-frise.png';img.alt='';img.setAttribute('aria-hidden','true');button.replaceChildren(img)}
 function endDateLabel(end,now=new Date()) {const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);return !end||new Date(end+'T12:00:00')>=today?"Aujourd’hui":new Date(end+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
 function showPhotos(photos,selected,base,trigger){
  if(lightbox)lightbox.close();
  const dialog=el('dialog','vr-lightbox'),close=el('button','vr-lightbox-close','×'),image=el('img','vr-lightbox-image'),prev=el('button','vr-lightbox-prev'),next=el('button','vr-lightbox-next'),caption=el('p','vr-lightbox-caption');
  let index=Math.max(0,photos.findIndex(p=>p.src===selected));
  close.type=prev.type=next.type='button';close.setAttribute('aria-label','Fermer les photos');prev.setAttribute('aria-label','Photo précédente');next.setAttribute('aria-label','Photo suivante');dialog.setAttribute('aria-label','Photos en grand');arrow(prev,base,true);arrow(next,base);caption.setAttribute('aria-live','polite');
  function update(){image.src=base+photos[index].src;image.alt=photos[index].label||'Photo';caption.textContent=(index+1)+' / '+photos.length+(photos[index].label?' — '+photos[index].label:'');prev.disabled=index===0;next.disabled=index===photos.length-1}
  prev.onclick=()=>{if(index>0){index--;update()}};next.onclick=()=>{if(index<photos.length-1){index++;update()}};close.onclick=()=>dialog.close();
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();prev.onclick()}if(e.key==='ArrowRight'){e.preventDefault();next.onclick()}if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dialog.close()}});
  dialog.addEventListener('close',()=>{if(lightbox===dialog)lightbox=null;dialog.remove();trigger?.focus()},{once:true});
  dialog.append(close,prev,image,next,caption);document.body.append(dialog);lightbox=dialog;update();dialog.showModal();close.focus();
 }
 function photoAction(image,photos,src,base){image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label',(image.alt||'Photo')+' — agrandir');image.classList.add('vr-photo-action');image.onclick=()=>showPhotos(photos,src,base,image);image.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();image.onclick()}}}
 function render(node,entry,base=''){
  stop(node);node.replaceChildren();node.classList.add('vr-card');
  node.append(el('h2','vr-title',entry.titre||'Le titre de votre étape'));
  const media=(entry.media??(entry.image?[{src:entry.image,type:'image',label:entry.titre}]:[])).filter(m=>safeFile(m.src)&&['image','video'].includes(m.type));
  const photos=media.filter(m=>m.type==='image');
  const coverIndex=media.findIndex(m=>m.type==='image');
  node.classList.toggle('vr-has-cover',coverIndex>=0);
  if(coverIndex>=0){const cover=media.splice(coverIndex,1)[0];const img=el('img','vr-cover');img.src=base+cover.src;img.alt=cover.label||entry.titre||'Photo de l’étape';photoAction(img,photos,cover.src,base);node.append(img)}
  const identity=el('div','vr-identity');const type=types[entry.categorie]||['Catégorie','icone-perso.png'];
  function row(icon,value,label){const line=el('div','vr-fact');const visual=el('span','vr-fact-icon');visual.setAttribute('aria-hidden','true');if(icon.endsWith('.png')){const img=el('img');img.src=base+'assets/'+icon;img.alt='';visual.append(img)}else{visual.innerHTML=icon}line.append(visual,el('span','',value));line.setAttribute('aria-label',label+': '+value);identity.append(line)}
  const calendar='icone-date.png',pin='icone-lieu.png';
  function date(s){return s?new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):''}
  row(type[1],type[0],'Catégorie');row(calendar,[date(entry.debut),endDateLabel(entry.fin)].filter(Boolean).join(' — ')||'Dates à renseigner','Dates');row(pin,entry.lieu||'Lieu à renseigner','Lieu');node.append(identity);
  const description=el('p','vr-description');highlight(description,entry.description||'Votre texte apparaîtra ici.');node.append(description);

  if(media.length){const gallery=el('section','vr-gallery'),frame=el('div','vr-media-frame'),controls=el('div','vr-gallery-controls'),prev=el('button','','←'),next=el('button','','→'),count=el('span');let index=0;gallery.setAttribute('aria-label','Photos et vidéos');prev.type=next.type='button';arrow(prev,base,true);arrow(next,base);prev.setAttribute('aria-label','Média précédent');next.setAttribute('aria-label','Média suivant');count.setAttribute('aria-live','polite');function show(){stop(frame);frame.replaceChildren();const m=media[index];const asset=el(m.type==='video'?'video':'img');asset.src=base+m.src;if(m.type==='video'){asset.controls=true;asset.preload='metadata';asset.playsInline=true;asset.setAttribute('aria-label',m.label||'Vidéo')}else{asset.alt=m.label||entry.titre;asset.loading='lazy';photoAction(asset,photos,m.src,base)}frame.append(asset);count.textContent=(index+1)+' / '+media.length;prev.disabled=index===0;next.disabled=index===media.length-1}prev.onclick=()=>{if(index>0){index--;show()}};next.onclick=()=>{if(index<media.length-1){index++;show()}};controls.append(prev,count,next);gallery.append(frame);if(media.length>1)gallery.append(controls);node.append(gallery);show()}
  const resources=(entry.resources||[]).filter(r=>r.kind==='pdf'?safeFile(r.url):r.kind==='link'&&safeLink(r.url));
  if(resources.length){const section=el('section','vr-resources');section.append(el('h3','','En savoir plus'));for(const r of resources){const link=el('a','vr-resource');link.href=r.kind==='pdf'?base+r.url:r.url;link.target='_blank';link.rel='noopener noreferrer';link.append(el('span','',r.label));link.setAttribute('aria-label',(r.label+' (nouvel onglet)'));section.append(link)}node.append(section)}
 }
 return {render,highlight,stop,safeFile,safeLink,endDateLabel,isLightboxOpen:()=>Boolean(lightbox?.open)};
})();
