const AUDIO_API="https://mylikith-backend.onrender.com/api/audio";
const MEDIA_API="https://mylikith-backend.onrender.com/api/audio/media";

let chapterId=null;
let chapterData=null;
let audio=null;
let lastSavedPosition=0;
let saveInFlight=false;

const $=id=>document.getElementById(id);
const token=()=>localStorage.getItem("token");

function formatTime(value){const n=Number(value);if(!Number.isFinite(n)||n<0)return"00:00";const s=Math.floor(n),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),r=s%60;return h?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`}
function headers(){const h={};if(token())h.Authorization=`Bearer ${token()}`;return h}
function setMeta(title,description){document.title=`${title} — MyLikith Audio`;$("metaDescription").content=description;$("ogTitle").content=title;$("ogDescription").content=description}
function show(id){$(id).hidden=false}function hide(id){$(id).hidden=true}

async function init(){

console.log(
    "🎧 AUDIO CHAPTER V2",
    "URL:",
    location.href,
    "ID:",
    new URLSearchParams(location.search).get("id"),
    "chapterId:",
    new URLSearchParams(location.search).get("chapterId")
);

  const params=new URLSearchParams(location.search);chapterId=Number(params.get("id")||params.get("chapterId")||params.get("chapter")||0);
  if(!chapterId){return fail("Missing audio chapter ID.")}
  $("retryButton").addEventListener("click",loadChapter);
  $("loginButton").addEventListener("click",()=>location.href=`login.html?redirect=${encodeURIComponent(location.href)}`);
  $("walletButton").addEventListener("click",()=>location.href="wallet.html");
  $("unlockButton").addEventListener("click",unlockChapter);
  await loadChapter();
}

document.addEventListener("DOMContentLoaded",init);

async function loadChapter(){
  show("playerLoading");hide("errorState");hide("lockedState");hide("audioPlayerWrap");
  try{
    const response=await fetch(`${MEDIA_API}/chapters/${chapterId}/playback`,{headers:headers()});
    const data=await response.json();
    chapterData=data.chapter||null;
    if(chapterData)renderChapter(chapterData);
    if(!response.ok||!data.success){
      if(data.locked){renderLocked(data);return}
      throw new Error(data.message||"Unable to load audio chapter.");
    }
    if(data.locked||!data.url)throw new Error(data.message||"Audio is locked.");
    await setupPlayer(data);
  }catch(error){console.error("Audio chapter load error:",error);fail(error.message)}
}

function renderChapter(c){
  const title=c.title||"Audio Chapter";const novel=c.audio_novel_title||"MyLikith Audio";const desc=`Listen to ${title} from ${novel} on MyLikith Audio.`;
  $("chapterTitle").textContent=title;$("novelTitle").textContent=novel;
  $("chapterMeta").textContent=`Chapter ${c.chapter_no??"—"}${c.duration_seconds?` • ${formatTime(c.duration_seconds)}`:""}${c.is_premium||c.premium_only?" • Premium":""}`;
  $("chapterDescription").textContent=desc;setMeta(`${title} — ${novel}`,desc);
  if(c.cover_url){$("audioCover").src=c.cover_url;$("audioCover").alt=novel;$("audioCover").hidden=false;$("audioCoverFallback").hidden=true}
}

function renderLocked(data){
  hide("playerLoading");show("lockedState");
  const c=data.chapter||chapterData||{};$("lockedTitle").textContent=data.requires_login?"Login Required":"Premium Audio";
  $("lockedMessage").textContent=data.requires_login?(data.message||"Please login to listen."):(data.message||`This chapter requires ${Number(c.coins_required||0)} coins.`);
  hide("loginButton");hide("unlockButton");hide("walletButton");
  if(data.requires_login)show("loginButton");else{show("unlockButton");show("walletButton");$("unlockButton").textContent=`🪙 Unlock for ${Number(c.coins_required||0)} Coins`}
}

async function setupPlayer(data){
  hide("playerLoading");show("audioPlayerWrap");
  audio=$("audioPlayer");audio.src=data.url;audio.load();
  audio.addEventListener("loadedmetadata",async()=>{
    $("durationText").textContent=formatTime(audio.duration);await restoreProgress();
  },{once:true});
  audio.addEventListener("timeupdate",()=>{if(audio&&!audio.paused)saveProgress(false)});
  audio.addEventListener("pause",()=>saveProgress(true));
  audio.addEventListener("ended",()=>saveProgress(true));
  window.addEventListener("pagehide",()=>saveProgress(true),{once:false});
}

async function restoreProgress(){
  if(!token()){$("resumeText").textContent="Login to save your listening progress";return}
  try{
    const r=await fetch(`${AUDIO_API}/chapters/${chapterId}/progress`,{headers:headers()});const d=await r.json();const p=d.progress;
    if(p&&!p.completed&&Number(p.position_seconds)>0&&Number(p.position_seconds)<audio.duration-1){audio.currentTime=Number(p.position_seconds);$("resumeText").textContent=`Resumed from ${formatTime(p.position_seconds)}`}
    else $("resumeText").textContent="Ready to listen";
  }catch(e){console.warn("Progress restore failed",e)}
}

async function saveProgress(force){
  if(!audio||!token()||!Number.isFinite(audio.duration)||audio.duration<=0||saveInFlight)return;
  const position=Math.min(audio.currentTime,audio.duration);
  if(!force&&Math.abs(position-lastSavedPosition)<5)return;
  lastSavedPosition=position;saveInFlight=true;
  try{await fetch(`${AUDIO_API}/chapters/${chapterId}/progress`,{method:"POST",headers:{...headers(),"Content-Type":"application/json"},body:JSON.stringify({position_seconds:position,duration_seconds:audio.duration})})}catch(e){console.warn("Progress save failed",e)}finally{saveInFlight=false}
}

async function unlockChapter(){
  if(!token()){location.href=`login.html?redirect=${encodeURIComponent(location.href)}`;return}
  const button=$("unlockButton");button.disabled=true;button.textContent="Unlocking...";
  try{
    const r=await fetch(`${MEDIA_API}/chapters/${chapterId}/unlock`,{method:"POST",headers:{...headers(),"Content-Type":"application/json"}});const d=await r.json();
    if(!r.ok||!d.success)throw new Error(d.message||"Unable to unlock chapter.");
    await loadChapter();
  }catch(e){alert(e.message);button.disabled=false;button.textContent=`🪙 Unlock for ${Number((chapterData||{}).coins_required||0)} Coins`}
}

async function fail(message){hide("playerLoading");hide("lockedState");show("errorState");$("errorMessage").textContent=message||"Unable to load this chapter."}
