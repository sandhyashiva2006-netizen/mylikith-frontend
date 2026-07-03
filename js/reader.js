const API = "https://mylikith-backend.onrender.com";

let fontSize = 24;

const likeBtn=document.getElementById("likeBtn");

if(likeBtn){

likeBtn.onclick=toggleLike;

}

const chapterContent =
document.getElementById("chapterContent");

let speech = null;

const readBtn =
document.getElementById("readAloudBtn");

const pauseBtn =
document.getElementById("pauseSpeechBtn");

const stopBtn =
document.getElementById("stopSpeechBtn");

const speechRate =
document.getElementById("speechRate");

const fontSelector=

document.getElementById(

"fontSelector"

);

if(fontSelector){

fontSelector.onchange=

changeReaderFont;

}

document.body.classList.add("dark-mode");

const increaseFont=document.getElementById("increaseFont");

if(increaseFont){

increaseFont.addEventListener("click", () => {

fontSize += 2;

chapterContent.style.fontSize =
fontSize + "px";

});

}

const decreaseFont=document.getElementById("decreaseFont");

if(decreaseFont){

decreaseFont.addEventListener("click", () => {

fontSize -= 2;

chapterContent.style.fontSize =
fontSize + "px";

});

}

const darkBtn=document.getElementById("darkBtn");

if(darkBtn){

darkBtn.addEventListener("click", () => {

document.body.classList.remove("light-mode");
document.body.classList.add("dark-mode");

});

}

const lightBtn=document.getElementById("lightBtn");

if(lightBtn){

lightBtn.addEventListener("click",()=>{

document.body.classList.remove("dark-mode");
document.body.classList.add("light-mode");

});

}


window.addEventListener("scroll", () => {

let winScroll =
document.body.scrollTop ||
document.documentElement.scrollTop;

let height =
document.documentElement.scrollHeight -
document.documentElement.clientHeight;

let scrolled =
(winScroll / height) * 100;

document.getElementById(
"progressBar"
).style.width =
scrolled + "%";

});

const bookmarkBtn=document.getElementById("bookmarkBtn");

if(bookmarkBtn){

bookmarkBtn.addEventListener("click", () => {

const user =
JSON.parse(
localStorage.getItem("user")
);

const chapterId =
new URLSearchParams(
window.location.search
).get("chapter");

let liked = false;

let readerUser =
JSON.parse(localStorage.getItem("user"));

fetch(

"https://mylikith-backend.onrender.com/api/writers/bookmark",

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:user.id,

chapter_id:chapterId

})

}

)

.then(res=>res.json())

.then(data=>{

if(data.success){

alert(
"Bookmark Saved"
);

}

});
});

}

const translateBtn=document.getElementById("translateBtn");

if(translateBtn){

translateBtn.addEventListener("click", () => {

alert(
"Translation feature coming soon"
);

});
}

if(readBtn){

readBtn.onclick=startReading;

}

if(pauseBtn){

pauseBtn.onclick=()=>{

window.speechSynthesis.pause();

};

}

if(stopBtn){

stopBtn.onclick=()=>{

window.speechSynthesis.cancel();

};

}

if(speechRate){

speechRate.onchange=()=>{

localStorage.setItem(

"speechRate",

speechRate.value

);

};

}

const params =
new URLSearchParams(
window.location.search
);

const chapterId =
params.get("chapter");

const lockContainer =
document.getElementById(
"chapterLockContainer"
);

const readerUser =
JSON.parse(localStorage.getItem("user"));

let currentNovelId = null;

let chapterList = [];

let currentIndex = -1;

let readingStarted = Date.now();

let totalWords = 0;

console.log("Reader URL:", window.location.href);
console.log("Chapter ID:", chapterId);

async function checkLockedChapter(){

if(!readerUser){

return false;

}

const response=await fetch(

`${API}/api/locked/${chapterId}/${readerUser.id}`

);

const data=await response.json();

if(data.premium){

return false;

}

console.log("LOCK STATUS:", data);

if(!data.locked){

return false;

}

lockContainer.innerHTML = `

<div class="locked-chapter-card">

<div class="premium-icon">

🔒

</div>

<h2>

Premium Chapter

</h2>

<p class="preview-text">

You've reached a premium chapter.

Unlock it to continue reading and support the author.

</p>

<div class="coin-price">

🪙 ${data.coins} Coins

</div>

<div class="wallet-info">

Your Balance :
<span id="readerCoins">

Loading...

</span>

Coins

</div>

<div class="premium-actions">

<button id="unlockChapterBtn">

🪙 Unlock Chapter

</button>

<button
id="buyCoinsBtn">

➕ Buy Coins

</button>

</div>

</div>

`;

document.getElementById(
"buyCoinsBtn"
).onclick=()=>{

location.href=
"coin-store.html";

};

loadWalletCoins();

document.getElementById("chapterContent").style.display="none";

document.getElementById("unlockChapterBtn").onclick=

unlockChapter;

return true;

}

async function changeReaderFont(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const response=

await fetch(

`${API}/api/premium/status/${user.id}`

);

const data=

await response.json();

const value=

fontSelector.value;

if(

value!=="default"

&&

!data.premium

){

alert(

"Premium fonts are available only for Premium Members."

);

fontSelector.value="default";

return;

}

chapterContent.classList.remove(

"font-serif",
"font-literata",
"font-garamond"

);

if(value==="serif"){

chapterContent.classList.add(

"font-serif"

);

}

if(value==="literata"){

chapterContent.classList.add(

"font-literata"

);

}

if(value==="garamond"){

chapterContent.classList.add(

"font-garamond"

);

}

localStorage.setItem(

"reader-font",

value

);

}

async function startReading(){

const user=
JSON.parse(localStorage.getItem("user"));

if(!user)return;

const premium=
await fetch(
`${API}/api/premium/status/${user.id}`
);

const status=
await premium.json();

if(!status.premium){

alert("Read Aloud is available only for Premium Members.");

return;

}

window.speechSynthesis.cancel();

speech=new SpeechSynthesisUtterance(

document.getElementById(
"chapterContent"
).innerText

);

speech.rate=
Number(speechRate.value);

speech.pitch=1;

speech.volume=1;

speech.lang="en-US";

window.speechSynthesis.speak(
speech
);

}

async function loadWalletCoins(){

const response=
await fetch(

`${API}/api/wallet/${readerUser.id}`

);

const wallet=
await response.json();

document.getElementById(
"readerCoins"
).textContent=

wallet.coins||0;

}

async function loadChapter(){

try{


const response =
await fetch(

`https://mylikith-backend.onrender.com/api/chapters/${chapterId}`

);

const chapter =
await response.json();

if(

chapter.early_access

){

const premium=await fetch(

`${API}/api/premium/status/${readerUser.id}`

);

const status=
await premium.json();

if(!status.premium){

document.getElementById(

"chapterContent"

).style.display="none";

lockContainer.innerHTML=`

<div class="locked-chapter-card">

<h2>

⭐ Premium Early Access

</h2>

<p>

This chapter is available first for Premium Members.

</p>

<a
href="premium.html">

<button>

Become Premium

</button>

</a>

</div>

`;

return;

}

}

document.title =
chapter.title + " - Mylikith";

document.getElementById(
"chapterTitle"
).textContent =
`Chapter ${chapter.chapter_no} - ${chapter.title}`;

const locked =
await checkLockedChapter();

if(locked){

    return;

}

currentNovelId = chapter.novel_id;

readingStarted = Date.now();

await loadChapterNavigation();

const progress = Math.min(

100,

Math.round(

((currentIndex + 1) / chapterList.length) * 100

)

);

await fetch(

`https://mylikith-backend.onrender.com/api/novels/${chapter.novel_id}/view`,

{
method:"POST"
}

);


if(readerUser){

fetch(

"https://mylikith-backend.onrender.com/api/writers/reading-progress",

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:
readerUser.id,

chapter_id:
chapter.id

})

}

);

}

await fetch(

`${API}/api/library/progress`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id,

novel_id:chapter.novel_id,

last_chapter:chapter.id,

progress:progress

})

}

);

if(progress===100){

await fetch(

`${API}/api/library/status`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id,

novel_id:chapter.novel_id,

status:"Completed"

})

}

);

}

fetch(
"https://mylikith-backend.onrender.com/api/writers/reading-history",
{
    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        user_id:readerUser.id,

        novel_id:chapter.novel_id,

        chapter_id:chapter.id

    })

}
);

await fetch(

`${API}/api/streak/update`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id

})

}

);

await fetch(

`${API}/api/goals/update`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id

})

}

);

document.getElementById(
"chapterContent"
).innerHTML =
chapter.content.replace(
/\n/g,
"<br><br>"
);

totalWords =
chapter.content
.trim()
.split(/\s+/)
.length;

restoreReadingPosition();
saveContinueReading(chapter);
updateReaderStats(chapter);
await checkLikeStatus();

await loadLikes();

const savedFont=

localStorage.getItem(

"reader-font"

);

if(savedFont){

fontSelector.value=savedFont;

fontSelector.dispatchEvent(

new Event("change")

);

}

const savedRate=
localStorage.getItem("speechRate");

if(savedRate && speechRate){

speechRate.value=savedRate;

}

}
catch(err){

console.error(err);

}

}

const savedTheme=

localStorage.getItem(

"reader-theme"

);

if(savedTheme==="premium"){

document.body.classList.add(

"premium-theme"

);

}

loadChapter();

const commentBtn=document.getElementById("commentBtn");

if(commentBtn){

commentBtn.addEventListener(
"click",
submitComment
);

}

async function loadChapterNavigation(){

const response = await fetch(

`${API}/api/novels/${currentNovelId}/chapters`

);

chapterList = await response.json();

currentIndex = chapterList.findIndex(

c => c.id == chapterId

);

document.getElementById("prevChapterBtn").disabled =
currentIndex <= 0;

document.getElementById("nextChapterBtn").disabled =
currentIndex >= chapterList.length - 1;

}

async function submitComment(){

const user=
JSON.parse(localStorage.getItem("user"));

if(!user){

alert("Please login");

return;

}

const comment=
document.getElementById("commentText").value.trim();

if(comment===""){

alert("Please enter a comment.");

return;

}

const response=
await fetch(

`${API}/api/comments`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:user.id,

chapter_id:chapterId,

comment

})

}

);

const data=
await response.json();

if(data.success){

document.getElementById("commentText").value="";

loadComments();

}else{

alert("Failed to post comment.");

}

}

async function loadComments(){

const response=
await fetch(

`${API}/api/comments/${chapterId}`

);

const comments=
await response.json();

const container=
document.getElementById("commentsList");

container.innerHTML="";

if(comments.length===0){

container.innerHTML="<p>No comments yet</p>";

return;

}

comments.forEach(comment=>{

container.innerHTML+=`

<div class="comment-card">

<strong>${comment.name}</strong>

<p>${comment.comment}</p>

</div>

`;

});

}

loadComments();

document.getElementById("prevChapterBtn").onclick=()=>{

if(currentIndex<=0)return;

location.href=

`reader.html?chapter=${chapterList[currentIndex-1].id}`;

};

document.getElementById("nextChapterBtn").onclick=()=>{

if(currentIndex>=chapterList.length-1)return;

location.href=

`reader.html?chapter=${chapterList[currentIndex+1].id}`;

};

const themeBtn=document.getElementById("themeBtn");

if(themeBtn){

themeBtn.onclick=()=>{

if(document.body.classList.contains("dark-mode")){

document.body.classList.remove("dark-mode");

document.body.classList.add("light-mode");

themeBtn.textContent="☀ Light";

}else{

document.body.classList.remove("light-mode");

document.body.classList.add("dark-mode");

themeBtn.textContent="🌙 Theme";

}

};

};

const premiumThemeBtn=

document.getElementById(

"premiumThemeBtn"

);

if(premiumThemeBtn){

premiumThemeBtn.onclick=

enablePremiumTheme;

}

const fullscreenBtn =
document.getElementById("fullscreenBtn");

if(fullscreenBtn){

fullscreenBtn.onclick=()=>{

document
.querySelector(".reader-container")
.classList.toggle("fullscreen-mode");

};

}

async function enablePremiumTheme(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const response=

await fetch(

`${API}/api/premium/status/${user.id}`

);

const data=

await response.json();

if(!data.premium){

alert(

"Premium Theme is available only for Premium Members."

);

return;

}

document.body.classList.remove(

"light-mode",
"dark-mode"

);

document.body.classList.add(

"premium-theme"

);

localStorage.setItem(

"reader-theme",

"premium"

);

}

async function loadLikes(){

const response=await fetch(

`${API}/api/chapters/${chapterId}/likes`

);

const data=await response.json();

const count=document.getElementById("likeCount");

if(count){

count.textContent=data.likes;

}

}

async function checkLikeStatus(){

if(!readerUser)return;

const response=await fetch(

`${API}/api/chapters/${chapterId}/liked/${readerUser.id}`

);

const data=await response.json();

liked=data.liked;

updateLikeButton();

}

function updateLikeButton(){

const btn=document.getElementById("likeBtn");

if(!btn)return;

btn.innerHTML=liked

?`❤️ Liked <span id="likeCount"></span>`

:`🤍 Like <span id="likeCount"></span>`;

}

async function toggleLike(){

if(!readerUser){

alert("Please login");

return;

}

const method=liked?"DELETE":"POST";

await fetch(

`${API}/api/chapters/${chapterId}/like`,

{

method,

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id

})

}

);

liked=!liked;

updateLikeButton();

loadLikes();

}


function saveReadingPosition(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

localStorage.setItem(

`reading-position-${user.id}-${chapterId}`,

window.scrollY

);

}

function restoreReadingPosition(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const position=

localStorage.getItem(

`reading-position-${user.id}-${chapterId}`

);

if(position){

setTimeout(()=>{

window.scrollTo({

top:Number(position),

behavior:"instant"

});

},200);

}

}

let saveTimer;

window.addEventListener("beforeunload",saveReadingAnalytics);

window.addEventListener("scroll",()=>{

clearTimeout(saveTimer);

saveTimer=setTimeout(

saveReadingPosition,

300

);

});

function saveContinueReading(chapter){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

localStorage.setItem(

`continue-reading-${user.id}`,

JSON.stringify({

novelId:chapter.novel_id,

chapterId:chapter.id,

chapterTitle:chapter.title,

chapterNo:chapter.chapter_no

})

);

}

function updateReaderStats(chapter){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const key=`reader-stats-${user.id}`;

let stats=

JSON.parse(localStorage.getItem(key));

if(!stats){

stats={

chapters:0,

books:[],

minutes:0,

lastDate:"",

streak:1

};

}

stats.chapters++;

stats.minutes+=10;

if(!stats.books.includes(chapter.novel_id)){

stats.books.push(chapter.novel_id);

}

const today=

new Date().toDateString();

if(stats.lastDate!==today){

stats.streak++;

stats.lastDate=today;

}

localStorage.setItem(

key,

JSON.stringify(stats)

);

}

async function saveReadingAnalytics(){

if(!readerUser)return;

const premium=await fetch(

`${API}/api/premium/status/${readerUser.id}`

);

const status=await premium.json();

if(!status.premium)return;

const seconds=Math.floor(

(Date.now()-readingStarted)/1000

);

await fetch(

`${API}/api/premium/reading-stats`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id,

chapter_id:chapterId,

reading_seconds:seconds,

words_read:totalWords,

completed:

window.innerHeight+
window.scrollY>=
document.body.offsetHeight-100

})

}

);

}

async function unlockChapter(){

const response=

await fetch(

`${API}/api/locked/unlock`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id,

chapter_id:chapterId

})

}

);

const data=

await response.json();

if(!data.success){

if(

data.message==="Not enough coins."

){

alert(

`You need more coins.

Click OK to open Coin Store.`

);

location.href="coin-store.html";

return;

}

alert(data.message);

return;

}

lockContainer.innerHTML=`

<div class="unlock-success">

🎉

<h2>

Chapter Unlocked!

</h2>

<p>

Enjoy reading.

</p>

</div>

`;

setTimeout(()=>{

lockContainer.innerHTML="";

document.getElementById(
"chapterContent"
).style.display="block";

loadChapter();

},1200);

document.getElementById("chapterContent").style.display="block";

loadChapter();

}

