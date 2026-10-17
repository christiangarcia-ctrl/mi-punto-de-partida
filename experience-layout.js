/* Recompose the existing diagnosis. Original inputs, selection rules and calculations stay in place. */
(()=>{
 'use strict';
 document.body.classList.add('pdp-experience');
 const stages=[
  ['vDolor','01','Tu historia, antes que tus números.','Antes de diseñar una estrategia, entendamos la vida que quieres construir.'],
  ['vGoal','02','Dale una cifra a tu tranquilidad.','La meta no es un producto. Es la vida que te gustaría poder elegir.'],
  ['vReality','03','Un plan que puedas sostener.','El punto de partida es una cantidad realista, compatible con tu vida de hoy.'],
  ['vRes','04','Ya tenemos un punto de partida.','Con tu historia y tus números, la siguiente conversación puede ir más lejos.']
 ];
 const originalPhoto=document.querySelector('#vGoal .photo-card img');
 stages.forEach(([id,number,title,copy])=>{
  const view=document.getElementById(id),wrap=view.querySelector('.wrap');
  wrap.classList.add('pdp-workspace');
  const story=document.createElement('aside');story.className='pdp-story';
  story.innerHTML=`<div class="pdp-story-copy"><span class="pdp-overline">PUNTO DE PARTIDA · ${number} / 04</span><h1>${title}</h1><p>${copy}</p></div>`;
  const photo=wrap.querySelector('.photo-card');if(photo)story.append(photo);else if(originalPhoto){const figure=document.createElement('div');figure.className='photo-card';figure.append(originalPhoto.cloneNode());story.append(figure)}
  const stepper=wrap.querySelector('.stepper');if(stepper)story.append(stepper);
  const oldHero=wrap.querySelector('.hero');if(oldHero)oldHero.hidden=true;
  const stage=document.createElement('main');stage.className='pdp-stage';
  [...wrap.children].forEach(child=>stage.append(child));
  wrap.append(story,stage);
  const label=document.createElement('div');label.className='pdp-stage-marker';label.innerHTML=`<span>${number}</span><b>${['Tu situación','Tu meta','Tu realidad','Tu diagnóstico'][Number(number)-1]}</b><small>Christian GarBa · Consultoría patrimonial</small>`;stage.prepend(label);
 });
 const groups=[...document.querySelectorAll('.choice-grid')];
 groups.forEach(group=>group.querySelectorAll('.choice-btn').forEach((button,i)=>{
  const icon=document.createElement('span');icon.className='pdp-choice-marker';icon.setAttribute('aria-hidden','true');icon.textContent=String(i+1).padStart(2,'0');button.prepend(icon);
 }));
})();
