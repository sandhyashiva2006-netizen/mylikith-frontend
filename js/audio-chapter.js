const AUDIO_API="https://mylikith-backend.onrender.com/api/audio";
const MEDIA_API="https://mylikith-backend.onrender.com/api/audio/media";

let chapterId=null;
let chapterData=null;
let audio=null;
let lastSavedPosition=0;
let saveInFlight=false;

const $=id=>document.getElementById(id);
const token=()=>localStorage.getItem("token");

let audioLiked=false;
let audioLikeCount=0;

let audioUserRating = null;
let audioAverageRating = 0;
let audioRatingCount = 0;
	
async function loadAudioLike(){
  const button=$("audioLikeButton");
  const count=$("audioLikeCount");

  if(!button||!count||!chapterId) return;

  if(!token()){
    button.disabled=false;
    button.title="Login to like this chapter";
    return;
  }

  try{
    const response=await fetch(
      `${AUDIO_API}/chapters/${chapterId}/like`,
      {
        headers:headers()
      }
    );

    const data=await response.json();

    if(!response.ok||!data.success){
      throw new Error(
        data.message||"Unable to load like status."
      );
    }

    audioLiked=Boolean(data.liked);
    audioLikeCount=Number(data.likes||0);

    renderAudioLike();

  }catch(error){
    console.warn(
      "Audio like status failed:",
      error
    );
  }
}

function renderAudioLike(){
  const button=$("audioLikeButton");
  const icon=$("audioLikeIcon");
  const label=$("audioLikeLabel");
  const count=$("audioLikeCount");

  if(!button||!icon||!label||!count) return;

  button.classList.toggle(
    "liked",
    audioLiked
  );

  button.setAttribute(
    "aria-pressed",
    String(audioLiked)
  );

  button.title=audioLiked
    ? "Unlike this chapter"
    : "Like this chapter";

  icon.textContent=
    audioLiked ? "♥" : "♡";

  label.textContent=
    audioLiked ? "Liked" : "Like";

  count.textContent=
    `${audioLikeCount} ${audioLikeCount===1?"Like":"Likes"}`;
}

async function toggleAudioLike(){
  if(!token()){
    location.href=
      `login.html?redirect=${encodeURIComponent(location.href)}`;
    return;
  }

  const button=$("audioLikeButton");

  if(!button||button.disabled) return;

  button.disabled=true;

  try{
    const response=await fetch(
      `${AUDIO_API}/chapters/${chapterId}/like`,
      {
        method:"POST",
        headers:{
          ...headers(),
          "Content-Type":"application/json"
        }
      }
    );

    const data=await response.json();

    if(!response.ok||!data.success){
      throw new Error(
        data.message||"Unable to update like."
      );
    }

    audioLiked=Boolean(data.liked);
    audioLikeCount=Number(data.likes||0);

    renderAudioLike();

  }catch(error){

    console.error(
      "Audio like update failed:",
      error
    );

  }finally{

    button.disabled=false;
  }
}

async function loadAudioRating(){

  const stars =
    document.querySelectorAll(
      ".audio-rating-star"
    );

  const summary =
    $("audioRatingSummary");

  const userText =
    $("audioRatingUserText");

  if(
    !stars.length ||
    !summary ||
    !userText ||
    !chapterId
  ){
    return;
  }

  if(!token()){

    summary.textContent =
      "Login to rate";

    userText.textContent =
      "Login to rate this chapter.";

    renderAudioRating();

    return;
  }

  try{

    const response =
      await fetch(
        `${AUDIO_API}/chapters/${chapterId}/rating`,
        {
          headers:headers()
        }
      );

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.success
    ){

      throw new Error(
        data.message ||
        "Unable to load rating."
      );
    }

    audioUserRating =
      data.rating === null ||
      data.rating === undefined
        ? null
        : Number(data.rating);

    audioAverageRating =
      Number(
        data.average_rating || 0
      );

    audioRatingCount =
      Number(
        data.rating_count || 0
      );

    renderAudioRating();

  }catch(error){

    console.warn(
      "Audio rating load failed:",
      error
    );

  }
}


function renderAudioRating(){

  const stars =
    document.querySelectorAll(
      ".audio-rating-star"
    );

  const summary =
    $("audioRatingSummary");

  const userText =
    $("audioRatingUserText");

  if(
    !summary ||
    !userText
  ){
    return;
  }


  stars.forEach(
    star => {

      const value =
        Number(
          star.dataset.rating
        );

      star.classList.toggle(
        "selected",
        audioUserRating !== null &&
        value <= audioUserRating
      );

      star.textContent =
        audioUserRating !== null &&
        value <= audioUserRating
          ? "★"
          : "☆";

    }
  );


  if(audioRatingCount === 0){

    summary.textContent =
      "No ratings yet";

  }else{

    summary.textContent =
      `${audioAverageRating.toFixed(1)} / 5 · ${audioRatingCount} ${
        audioRatingCount === 1
          ? "rating"
          : "ratings"
      }`;

  }


  if(audioUserRating !== null){

    userText.textContent =
      `Your rating: ${audioUserRating}/5`;

  }else if(token()){

    userText.textContent =
      "You haven't rated this chapter.";

  }else{

    userText.textContent =
      "Login to rate this chapter.";

  }

}


async function submitAudioRating(
  rating
){

  if(!token()){

    location.href =
      `login.html?redirect=${encodeURIComponent(
        location.href
      )}`;

    return;
  }


  const stars =
    document.querySelectorAll(
      ".audio-rating-star"
    );

  stars.forEach(
    star => {
      star.disabled=true;
    }
  );


  try{

    const response =
      await fetch(
        `${AUDIO_API}/chapters/${chapterId}/rating`,
        {
          method:"POST",

          headers:{
            ...headers(),
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            rating:Number(rating)
          })
        }
      );


    const data =
      await response.json();


    if(
      !response.ok ||
      !data.success
    ){

      throw new Error(
        data.message ||
        "Unable to save rating."
      );

    }


    audioUserRating =
      Number(data.rating);

    audioAverageRating =
      Number(
        data.average_rating || 0
      );

    audioRatingCount =
      Number(
        data.rating_count || 0
      );


    renderAudioRating();


  }catch(error){

    console.error(
      "Audio rating update failed:",
      error
    );

  }finally{

    stars.forEach(
      star => {
        star.disabled=false;
      }
    );

  }

}


function bindAudioRating(){

  const stars =
    document.querySelectorAll(
      ".audio-rating-star"
    );

  stars.forEach(
    star => {

      star.addEventListener(
        "mouseenter",
        () => {

          const value =
            Number(
              star.dataset.rating
            );

          stars.forEach(
            item => {

              const itemValue =
                Number(
                  item.dataset.rating
                );

              item.textContent =
                itemValue <= value
                  ? "★"
                  : "☆";

              item.classList.toggle(
                "hovered",
                itemValue <= value
              );

            }
          );

        }
      );


      star.addEventListener(
        "click",
        () => {

          submitAudioRating(
            Number(
              star.dataset.rating
            )
          );

        }
      );

    }
  );


  const container =
    $("audioRatingStars");

  if(container){

    container.addEventListener(
      "mouseleave",
      () => {

        renderAudioRating();

      }
    );

  }

}

function formatTime(value){const n=Number(value);if(!Number.isFinite(n)||n<0)return"00:00";const s=Math.floor(n),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),r=s%60;return h?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`}
function headers(){const h={};if(token())h.Authorization=`Bearer ${token()}`;return h}
function setMeta(title,description){document.title=`${title} — MyLikith Audio`;$("metaDescription").content=description;$("ogTitle").content=title;$("ogDescription").content=description}
function show(id){$(id).hidden=false}function hide(id){$(id).hidden=true}

async function init(){
  const params=new URLSearchParams(location.search);chapterId=Number(params.get("id")||params.get("chapterId")||params.get("chapter")||0);
  if(!chapterId){return fail("Missing audio chapter ID.")}
  $("retryButton").addEventListener("click",loadChapter);
  $("loginButton").addEventListener("click",()=>location.href=`login.html?redirect=${encodeURIComponent(location.href)}`);
  $("walletButton").addEventListener("click",()=>location.href="wallet.html");
  $("unlockButton").addEventListener("click",unlockChapter);
  $("audioLikeButton").addEventListener("click",toggleAudioLike);

bindAudioRating();
renderAudioRating();
await loadAudioRating();

  renderAudioLike();
  await loadAudioLike();
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
  hide("playerLoading");
  show("audioPlayerWrap");

  audio=$("audioPlayer");
  audio.src=data.url;
  audio.load();

  bindPlayerControls();

  audio.addEventListener("loadedmetadata",async()=>{
    $("durationText").textContent=formatTime(audio.duration);
    $("progressRange").max=audio.duration;
    $("playerStatusText").textContent="Ready";
    await restoreProgress();
  },{once:true});

  audio.addEventListener("timeupdate",()=>{
    if(!audio) return;

    $("currentTimeText").textContent=formatTime(audio.currentTime);
    $("progressRange").value=audio.currentTime;

    if(!audio.paused) saveProgress(false);
  });

  audio.addEventListener("play",()=>{
    $("playPauseButton").textContent="❚❚";
    $("playPauseButton").setAttribute("aria-label","Pause audio");
    $("playPauseButton").title="Pause";
    $("playerStatusText").textContent="Playing";
  });

  audio.addEventListener("pause",()=>{
    $("playPauseButton").textContent="▶";
    $("playPauseButton").setAttribute("aria-label","Play audio");
    $("playPauseButton").title="Play";
    if(audio.currentTime < audio.duration) $("playerStatusText").textContent="Paused";
    saveProgress(true);
  });

  audio.addEventListener("ended",()=>{
    $("playPauseButton").textContent="▶";
    $("playPauseButton").setAttribute("aria-label","Play audio");
    $("playerStatusText").textContent="Completed";
    $("progressRange").value=audio.duration;
    saveProgress(true);
  });

  window.addEventListener("pagehide",()=>saveProgress(true),{once:false});
}

function bindPlayerControls(){
  const playButton=$("playPauseButton");
  const backButton=$("skipBackButton");
  const forwardButton=$("skipForwardButton");
  const progress=$("progressRange");
  const volume=$("volumeRange");
  const speed=$("speedSelect");

  if(playButton.dataset.bound==="1") return;
  playButton.dataset.bound="1";

  playButton.addEventListener("click",async()=>{
    if(!audio) return;

    try{
      if(audio.paused){
        await audio.play();
      }else{
        audio.pause();
      }
    }catch(error){
      console.warn("Audio play failed:",error);
      $("playerStatusText").textContent="Unable to play";
    }
  });

  backButton.addEventListener("click",()=>{
    if(!audio) return;
    audio.currentTime=Math.max(0,audio.currentTime-10);
  });

  forwardButton.addEventListener("click",()=>{
    if(!audio) return;
    audio.currentTime=Math.min(audio.duration||0,audio.currentTime+10);
  });

  progress.addEventListener("input",()=>{
    if(!audio) return;
    audio.currentTime=Number(progress.value);
    $("currentTimeText").textContent=formatTime(audio.currentTime);
  });

  volume.addEventListener("input",()=>{
    if(!audio) return;
    audio.volume=Number(volume.value);
    audio.muted=audio.volume===0;
  });

  speed.addEventListener("change",()=>{
    if(!audio) return;
    audio.playbackRate=Number(speed.value);
  });
}

async function restoreProgress(){
  if(!token()){$("resumeText").textContent="Login to save your listening progress";return}
  try{
    const r=await fetch(`${AUDIO_API}/chapters/${chapterId}/progress`,{headers:headers()});const d=await r.json();const p=d.progress;
    if(p&&!p.completed&&Number(p.position_seconds)>0&&Number(p.position_seconds)<audio.duration-1){audio.currentTime=Number(p.position_seconds);$("progressRange").value=audio.currentTime;$("currentTimeText").textContent=formatTime(audio.currentTime);$("resumeText").textContent=`Resumed from ${formatTime(p.position_seconds)}`}
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
await loadAudioLike();
await loadAudioRating();
  }catch(e){alert(e.message);button.disabled=false;button.textContent=`🪙 Unlock for ${Number((chapterData||{}).coins_required||0)} Coins`}
}

async function fail(message){hide("playerLoading");hide("lockedState");show("errorState");$("errorMessage").textContent=message||"Unable to load this chapter."}
