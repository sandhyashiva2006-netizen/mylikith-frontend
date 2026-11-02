(() => {
const API='https://mylikith-backend.onrender.com/api/writer-universe';
const MEDIA='https://mylikith-backend.onrender.com/api/audio/media';
const token=localStorage.getItem('token')||'';
const $=id=>document.getElementById(id);
const headers={'Content-Type':'application/json',Authorization:`Bearer ${token}`};
let currentProject=null;
function updateOriginalMediaFields(){
 const type=$('cMediaType').value;
 hidden('contentLabel',type==='text');
 hidden('originalVideoUploadLabel',type==='video');
}
$('cMediaType').addEventListener('change',updateOriginalMediaFields);
$('cVideoFile').addEventListener('change',()=>{
 const f=$('cVideoFile').files[0];
 if(f){$('videoUploadStatus').style.color='';$('videoUploadStatus').textContent=`Selected ${f.name} (${(f.size/1024/1024).toFixed(2)} MB). Save the episode to begin uploading.`;}
});

function switchTab(tab){
 document.querySelectorAll('.wu-tabs [data-tab]').forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));
 $('audioPanel').classList.toggle('wu-hidden',tab!=='audio');
 $('originalsPanel').classList.toggle('wu-hidden',tab!=='originals');
 hidden('projectEditor',false);hidden('chapterEditor',false);
}
document.querySelectorAll('.wu-tabs [data-tab]').forEach(button=>{
 button.addEventListener('click',()=>switchTab(button.dataset.tab));
});
async function api(path,options={}) {
 const r=await fetch(API+path,{...options,headers:{...headers,...(options.headers||{})}});
 let d={}; try{d=await r.json()}catch{}
 if(!r.ok||d.success===false) throw new Error(d.message||`Request failed (${r.status})`);
 return d;
}
function msg(s){$('wuMessage').textContent=s;$('wuMessage').classList.remove('wu-hidden');}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function hidden(id,on){$(id).classList.toggle('wu-hidden',!on);}
function projectCard(p,type){
 const published=String(p.publish_status||'draft').toLowerCase()==='published';
 return `<article class="wu-card"><h3>${esc(p.title)}</h3><p class="wu-muted">${esc(p.language||'Language not set')} · ${esc(p.status||'ongoing')} · ${Number(type==='audio'?p.chapter_count:p.episode_count)||0} ${type==='audio'?'chapters':'episodes'} · ${published?'Published':'Draft'}</p>${p.cover_url?`<img src="${esc(p.cover_url)}" alt="Cover" style="width:86px;height:116px;object-fit:cover;border-radius:8px">`:''}<p>${esc(p.description||'No description')}</p><div class="wu-actions"><button class="wu-btn primary" data-manage="${type}" data-id="${p.id}" data-title="${esc(p.title)}">Manage ${type==='audio'?'chapters':'episodes'}</button><button class="wu-btn" data-edit="${type}" data-id="${p.id}">Edit</button><button class="wu-btn" data-project-publish="${type}" data-id="${p.id}" data-published="${published}">${published?'Unpublish':'Publish'}</button><button class="wu-btn" data-project-delete="${type}" data-id="${p.id}">Delete</button></div></article>`;
}
async function load(){
 try{
  const [a,o]=await Promise.all([api('/audio'),api('/originals')]);
  $('audioList').innerHTML=(a.audio||[]).map(p=>projectCard(p,'audio')).join('')||'<p class="wu-muted">No audio projects yet.</p>';
  $('originalsList').innerHTML=(o.originals||[]).map(p=>projectCard(p,'originals')).join('')||'<p class="wu-muted">No Originals series yet.</p>';
 }catch(e){msg(e.message);}
}
function openProject(type,p=null){
 hidden('projectEditor',true);hidden('chapterEditor',false);
 $('projectHeading').textContent=(p?'Edit ':'Create ')+(type==='audio'?'Audio Novel':'Originals Series');
 $('projectId').value=p?.id||'';$('projectType').value=type;
 $('pTitle').value=p?.title||'';$('pLanguage').value=p?.language||'';$('pCategory').value=p?.category||'';
 $('pContentType').value=p?.content_type||(type==='audio'?'story':'series');$('pStatus').value=p?.status||'ongoing';
 $('pCover').value=p?.cover_url||'';$('pCoverFile').value='';$('coverStatus').textContent=p?.cover_url?'Current cover retained. Choose another image to replace it.':'Choose JPG, PNG or WebP (max 5 MB).';
 if(p?.cover_url){$('coverPreview').src=p.cover_url;hidden('coverPreview',true)}else hidden('coverPreview',false);
 $('pDescription').value=p?.description||'';$('projectEditor').scrollIntoView({behavior:'smooth'});
}
$('newAudio').onclick=()=>openProject('audio');$('newOriginal').onclick=()=>openProject('originals');
$('cancelProject').onclick=()=>hidden('projectEditor',false);
$('pCoverFile').addEventListener('change',()=>{
 const f=$('pCoverFile').files[0]; if(!f)return;
 if(f.size>5*1024*1024){msg('Cover must be 5 MB or smaller.');$('pCoverFile').value='';return;}
 $('coverPreview').src=URL.createObjectURL(f);hidden('coverPreview',true);
 $('coverStatus').textContent=f.name+' — ready to upload when you save.';
});
async function uploadCover(file){
 const fd=new FormData();fd.append('cover',file);
 const r=await fetch(API+'/cover-upload',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});
 const d=await r.json();if(!r.ok||!d.success||!d.cover_url)throw new Error(d.message||'Cover upload failed.');
 return d.cover_url;
}
$('projectForm').onsubmit=async e=>{
 e.preventDefault();const type=$('projectType').value,id=$('projectId').value;
 try{
  let cover=$('pCover').value;
  const file=$('pCoverFile').files[0];
  if(file){$('coverStatus').textContent='Uploading cover…';cover=await uploadCover(file);}
  const body={title:$('pTitle').value.trim(),language:$('pLanguage').value.trim(),category:$('pCategory').value.trim(),content_type:$('pContentType').value,status:$('pStatus').value,cover_url:cover||null,description:$('pDescription').value.trim()};
  await api(`/${type}${id?'/'+id:''}`,{method:id?'PUT':'POST',body:JSON.stringify(body)});
  hidden('projectEditor',false);msg('Project saved.');await load();
 }catch(err){msg(err.message);}
};
async function manage(type,id,name){
 currentProject={type,id};hidden('chapterEditor',true);hidden('projectEditor',false);
 $('chapterProjectId').value=id;$('chapterType').value=type;$('chapterEditId').value='';
 $('chapterHeading').textContent=type==='audio'?'Audio chapters':'Originals episodes';$('chapterProjectName').textContent=name;
 hidden('mediaTypeLabel',type==='originals');hidden('contentLabel',type==='originals');hidden('audioUploadLabel',type==='audio');hidden('originalVideoUploadLabel',false);
 $('chapterForm').reset();$('cCoins').value=0;$('cAudioFile').value='';$('cVideoFile').value='';updateOriginalMediaFields();$('audioUploadStatus').textContent='MP3 only, maximum 500 MB. Select a file, then click Save changes to start uploading.';$('audioUploadStatus').style.color='';$('audioUploadProgress').hidden=true;$('audioUploadPercent').hidden=true;$('audioUploadProgress').value=0;
 $('chapterForm').querySelector('button[type=submit]').textContent=type==='audio'?'Save chapter & upload MP3':'Add chapter / episode';
 await loadChapters();$('chapterEditor').scrollIntoView({behavior:'smooth'});
}
async function loadChapters(){
 const {type,id}=currentProject||{type:$('chapterType').value,id:$('chapterProjectId').value};
 try{
  const d=await api(`/${type}/${id}/${type==='audio'?'chapters':'episodes'}`),arr=type==='audio'?d.chapters:d.episodes;
  $('chapterList').innerHTML=(arr||[]).map(c=>{
   const published=!!c.is_published;
   return `<div class="wu-item"><div><strong>${esc(c.chapter_no)}. ${esc(c.title)}</strong><div class="wu-status">${c.is_premium?'Premium':'Free'} · ${published?'Published':'Draft'}${c.audio_status?' · Audio: '+esc(c.audio_status):''}${c.media_status?' · Media: '+esc(c.media_status):''}</div></div><div class="wu-actions"><button class="wu-btn" data-chapter-edit="${type}" data-id="${c.id}">Edit</button><button class="wu-btn" data-chapter-publish="${type}" data-id="${c.id}" data-published="${published}">${published?'Unpublish':'Publish'}</button><button class="wu-btn" data-chapter-delete="${type}" data-id="${c.id}">Delete</button></div></div>`;
  }).join('')||'<p class="wu-muted">No chapters or episodes yet.</p>';
 }catch(e){msg(e.message);}
}
$('cAudioFile').addEventListener('change',()=>{
 const file=$('cAudioFile').files[0];
 if(file){$('audioUploadStatus').style.color='';$('audioUploadStatus').textContent=`Selected ${file.name} (${(file.size/1024/1024).toFixed(2)} MB). Click “Save changes & upload MP3” to begin.`;}
});
async function uploadAudio(chapterId,file){
 if(!file||(!/\.mp3$/i.test(file.name)&&file.type!=='audio/mpeg'))throw new Error('Select an MP3 audio file.');
 if(file.size>500*1024*1024)throw new Error('MP3 must be 500 MB or smaller.');
 const status=$('audioUploadStatus'),bar=$('audioUploadProgress'),percent=$('audioUploadPercent');
 const setProgress=n=>{const v=Math.max(0,Math.min(100,Math.round(n)));bar.value=v;percent.textContent=`${v}% uploaded`;};
 bar.hidden=false;percent.hidden=false;setProgress(0);
 const send=async(path,body)=>{const r=await fetch(MEDIA+path,{method:'POST',headers,body:JSON.stringify(body)});let d={};try{d=await r.json()}catch{}if(!r.ok||!d.success)throw new Error(d.message||`Upload request failed (${r.status}).`);return d;};
 try{
  status.textContent='Starting secure upload to storage…';
  const start=await send(`/chapters/${chapterId}/start`,{file_name:file.name,mime_type:'audio/mpeg',file_size:file.size});
  if(!start.upload_id||!start.object_key||!start.part_size)throw new Error('The server did not return a valid upload session.');
  const parts=[],size=Number(start.part_size),total=Math.ceil(file.size/size);
  let uploaded=0;
  for(let n=1;n<=total;n++){
   status.textContent=`Uploading audio · part ${n} of ${total}`;
   const blob=file.slice((n-1)*size,Math.min(n*size,file.size));
   const signed=await send(`/chapters/${chapterId}/sign-part`,{upload_id:start.upload_id,object_key:start.object_key,part_number:n});
   const etag=await new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest();
    xhr.open('PUT',signed.url,true);
    xhr.setRequestHeader('Content-Type','audio/mpeg');
    xhr.upload.onprogress=ev=>{
     if(ev.lengthComputable){setProgress((uploaded+ev.loaded)/file.size*100);}
    };
    xhr.onerror=()=>reject(new Error('Network error while uploading audio. Check your connection and B2 CORS settings.'));
    xhr.onabort=()=>reject(new Error('Audio upload was cancelled.'));
    xhr.onload=()=>{
     if(xhr.status<200||xhr.status>=300)return reject(new Error(`Audio storage rejected part ${n} (HTTP ${xhr.status}).`));
     const value=xhr.getResponseHeader('ETag');
     if(!value)return reject(new Error('Audio was sent, but storage did not expose the ETag. B2 CORS must expose the ETag response header.'));
     resolve(value);
    };
    xhr.send(blob);
   });
   parts.push({part_number:n,etag});
   uploaded+=blob.size;setProgress(uploaded/file.size*100);
  }
  status.textContent='All parts uploaded. Finalizing and verifying audio…';
  await send(`/chapters/${chapterId}/complete`,{upload_id:start.upload_id,object_key:start.object_key,parts,duration_seconds:0});
  setProgress(100);status.textContent='✓ Audio uploaded and verified successfully. You can now publish this chapter.';
 }catch(err){
  status.textContent=`Upload failed: ${err.message}`;
  status.style.color='#ff8585';
  throw err;
 }
}

async function uploadOriginalVideo(episodeId,file){
 const allowed=['video/mp4','video/webm','video/quicktime'];
 const ext=/\.(mp4|webm|mov)$/i.test(file.name);
 if(!ext&&!allowed.includes(file.type))throw new Error('Choose an MP4, WebM or MOV video file.');
 if(file.size>2*1024*1024*1024)throw new Error('Video must be 2 GB or smaller.');
 const status=$('videoUploadStatus'),bar=$('videoUploadProgress'),pct=$('videoUploadPercent');
 const mime=file.type||(/\.webm$/i.test(file.name)?'video/webm':/\.mov$/i.test(file.name)?'video/quicktime':'video/mp4');
 const setProgress=n=>{const v=Math.max(0,Math.min(100,Math.round(n)));bar.value=v;pct.textContent=`${v}% uploaded`;};
 bar.hidden=false;pct.hidden=false;setProgress(0);
 const send=async(path,body)=>{
  const r=await fetch(API+path,{method:'POST',headers,body:JSON.stringify(body)});
  let d={};try{d=await r.json()}catch{}
  if(!r.ok||!d.success)throw new Error(d.message||`Video upload request failed (${r.status}).`);
  return d;
 };
 try{
  status.textContent='Starting secure video upload to Backblaze…';
  const start=await send(`/originals/episodes/${episodeId}/media/start`,{file_name:file.name,mime_type:mime,file_size:file.size});
  if(!start.upload_id||!start.object_key||!start.part_size)throw new Error('Server did not return a valid video upload session.');
  const parts=[],partSize=Number(start.part_size),total=Math.ceil(file.size/partSize);let uploaded=0;
  for(let n=1;n<=total;n++){
   status.textContent=`Uploading video · part ${n} of ${total}`;
   const blob=file.slice((n-1)*partSize,Math.min(n*partSize,file.size));
   const signed=await send(`/originals/episodes/${episodeId}/media/sign-part`,{upload_id:start.upload_id,object_key:start.object_key,part_number:n});
   const etag=await new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest();xhr.open('PUT',signed.url,true);xhr.setRequestHeader('Content-Type',mime);
    xhr.upload.onprogress=ev=>{if(ev.lengthComputable)setProgress((uploaded+ev.loaded)/file.size*100);};
    xhr.onerror=()=>reject(new Error('Network error uploading video. Check connection and B2 CORS settings.'));
    xhr.onload=()=>{if(xhr.status<200||xhr.status>=300)return reject(new Error(`Storage rejected video part ${n} (HTTP ${xhr.status}).`));const tag=xhr.getResponseHeader('ETag');if(!tag)return reject(new Error('B2 did not expose the ETag response header. Check bucket CORS settings.'));resolve(tag);};
    xhr.send(blob);
   });
   parts.push({part_number:n,etag});uploaded+=blob.size;setProgress(uploaded/file.size*100);
  }
  status.textContent='All video parts uploaded. Finalizing and verifying…';
  await send(`/originals/episodes/${episodeId}/media/complete`,{upload_id:start.upload_id,object_key:start.object_key,parts});
  setProgress(100);status.textContent='✓ Video uploaded and verified. You can now publish this episode.';
 }catch(err){status.textContent=`Video upload failed: ${err.message}`;status.style.color='#ff8585';throw err;}
}

$('chapterForm').onsubmit=async e=>{
 e.preventDefault();const type=$('chapterType').value,id=$('chapterProjectId').value,editId=$('chapterEditId').value;
 const body={chapter_no:Number($('cNumber').value),title:$('cTitle').value.trim(),is_premium:$('cPremium').checked,coins_required:Number($('cCoins').value)||0,early_access:$('cEarly').checked,publish_at:$('cPublishAt').value||null};
 if(type==='originals'){body.media_type=$('cMediaType').value;body.content=$('cMediaType').value==='text'?$('cContent').value:null;}
 const saveButton=$('chapterForm').querySelector('button[type=submit]');
 saveButton.disabled=true;
 const originalButtonText=saveButton.textContent;
 try{
  saveButton.textContent='Saving…';
  let saved;
  if(editId){saved=await api(type==='audio'?`/audio/chapters/${editId}`:`/originals/episodes/${editId}`,{method:'PUT',body:JSON.stringify(body)});}
  else {saved=await api(`/${type}/${id}/${type==='audio'?'chapters':'episodes'}`,{method:'POST',body:JSON.stringify(body)});}
  const chapter=(saved.chapter||saved.episode);
  if(type==='audio'&&$('cAudioFile').files[0]){
   if(!chapter?.id)throw new Error('Chapter saved, but could not identify it for audio upload. Refresh and edit the chapter to upload audio.');
   await uploadAudio(chapter.id,$('cAudioFile').files[0]);
  }
  if(type==='originals'&&$('cMediaType').value==='video'&&$('cVideoFile').files[0]){
   if(!chapter?.id)throw new Error('Episode saved, but could not identify it for video upload. Refresh and edit the episode to upload video.');
   await uploadOriginalVideo(chapter.id,$('cVideoFile').files[0]);
  }
  $('chapterForm').reset();$('cCoins').value=0;$('chapterEditId').value='';$('cVideoFile').value='';updateOriginalMediaFields();
  saveButton.textContent=type==='audio'?'Save chapter & upload MP3':'Add chapter / episode';
  msg(editId?'Chapter / episode updated.':'Chapter / episode created.');await loadChapters();
 }catch(err){msg(err.message);}
 finally{saveButton.disabled=false;if(saveButton.textContent==='Saving…')saveButton.textContent=originalButtonText;}
};
$('closeChapters').onclick=()=>hidden('chapterEditor',false);
document.addEventListener('click',async e=>{
 const m=e.target.closest('[data-manage]');if(m){manage(m.dataset.manage,m.dataset.id,m.dataset.title);return;}
 const ed=e.target.closest('[data-edit]');if(ed){try{const d=await api('/'+ed.dataset.edit),arr=ed.dataset.edit==='audio'?d.audio:d.originals,p=arr.find(x=>String(x.id)===ed.dataset.id);if(p)openProject(ed.dataset.edit,p);}catch(err){msg(err.message);}return;}
 const pp=e.target.closest('[data-project-publish]');if(pp){const type=pp.dataset.projectPublish;try{await api(`/${type}/${pp.dataset.id}/publish`,{method:'POST',body:JSON.stringify({published:pp.dataset.published!=='true'})});msg('Project publication updated.');await load();}catch(err){msg(err.message);}return;}
 const pd=e.target.closest('[data-project-delete]');if(pd){if(!confirm('Delete this project and all its chapters/episodes? This cannot be undone.'))return;try{await api(`/${pd.dataset.projectDelete}/${pd.dataset.id}`,{method:'DELETE'});msg('Project deleted.');await load();}catch(err){msg(err.message);}return;}
 const ce=e.target.closest('[data-chapter-edit]');if(ce){try{
  const type=ce.dataset.chapterEdit,id=$('chapterProjectId').value,d=await api(`/${type}/${id}/${type==='audio'?'chapters':'episodes'}`),arr=type==='audio'?d.chapters:d.episodes,c=arr.find(x=>String(x.id)===ce.dataset.id);if(!c)return;
  $('chapterEditId').value=c.id;$('cNumber').value=c.chapter_no;$('cTitle').value=c.title;$('cPremium').checked=!!c.is_premium;$('cCoins').value=c.coins_required||0;$('cEarly').checked=!!c.early_access;$('cPublishAt').value=c.publish_at?new Date(c.publish_at).toISOString().slice(0,16):'';
  if(type==='originals'){$('cMediaType').value=c.media_type||'video';$('cContent').value=c.content||'';updateOriginalMediaFields();}
  $('chapterForm').querySelector('button[type=submit]').textContent=type==='audio'?'Save changes & upload MP3':'Save changes';$('chapterForm').scrollIntoView({behavior:'smooth'});
 }catch(err){msg(err.message);}return;}
 const cp=e.target.closest('[data-chapter-publish]');if(cp){try{const type=cp.dataset.chapterPublish;await api(type==='audio'?`/audio/chapters/${cp.dataset.id}/publish`:`/originals/episodes/${cp.dataset.id}/publish`,{method:'POST',body:JSON.stringify({published:cp.dataset.published!=='true'})});msg('Chapter / episode publication updated.');await loadChapters();}catch(err){msg(err.message);}return;}
 const cd=e.target.closest('[data-chapter-delete]');if(cd){if(!confirm('Delete this chapter / episode? This cannot be undone.'))return;try{const type=cd.dataset.chapterDelete;await api(type==='audio'?`/audio/chapters/${cd.dataset.id}`:`/originals/episodes/${cd.dataset.id}`,{method:'DELETE'});msg('Chapter / episode deleted.');await loadChapters();}catch(err){msg(err.message);}return;}
});
if(!token)msg('Please sign in first.');else load();
})();
