/* Accessibility presentation only. Original diagnosis and calculation rules remain unchanged. */
(()=>{
 'use strict';
 const sync=()=>{
  document.querySelectorAll('.choice-btn').forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('sel'))));
  document.querySelectorAll('.faq-item').forEach(item=>item.querySelector('.faq-q')?.setAttribute('aria-expanded',String(item.classList.contains('open'))));
 };
 document.querySelectorAll('.faq-item').forEach((item,index)=>{
  const answer=item.querySelector('.faq-a'),button=item.querySelector('.faq-q');
  if(answer&&button){answer.id='faq-answer-'+index;button.setAttribute('aria-controls',answer.id);}
 });
 document.querySelectorAll('.err').forEach(error=>error.setAttribute('role','alert'));
 document.querySelectorAll('label').forEach(label=>{
  if(label.htmlFor||label.querySelector('input'))return;
  const fields=label.parentElement.querySelectorAll('input:not([type="hidden"]),select,textarea');
  const field=fields.length===1?fields[0]:null;
  if(field?.id)label.htmlFor=field.id;
 });
 sync();
 new MutationObserver(sync).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
})();
