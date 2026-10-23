const modal=document.getElementById('modal');
const opener=document.getElementById('open');
const closer=document.getElementById('close');
const finish=document.getElementById('finish');
const form=document.getElementById('rsvp');
const presence=document.getElementById('presence');
const formWrap=document.getElementById('formwrap');
const success=document.getElementById('success');
function openModal(){modal.classList.add('open');formWrap.style.display='block';success.style.display='none';setTimeout(()=>document.getElementById('name').focus(),50)}
function closeModal(){modal.classList.remove('open')}
opener.addEventListener('click',openModal);
closer.addEventListener('click',closeModal);
finish.addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal()});
document.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-choice]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');presence.value=btn.dataset.choice;}));
form.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim();if(!name)return;document.getElementById('successTitle').textContent=presence.value==='Sim'?'Perfeito, '+name.split(' ')[0]+'!':'Tudo certo, '+name.split(' ')[0]+'.';formWrap.style.display='none';success.style.display='block';});
