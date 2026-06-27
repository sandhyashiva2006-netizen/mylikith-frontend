const API =
"https://mylikith-backend.onrender.com";

const readerUser =
JSON.parse(
localStorage.getItem("user")
);



function formatNumber(num){

if(num>=1000000){

return (num/1000000).toFixed(1)+"M";

}

if(num>=1000){

return (num/1000).toFixed(1)+"K";

}

return num||0;

}

function createNovelCard(novel){

return `

<div
class="common-novel-card"
onclick="window.location='novel.html?id=${novel.id}'">

<img

class="common-novel-cover"

src="${
novel.cover_url ||
"https://placehold.co/300x450"
}"

alt="${novel.title}"

onerror="this.src='https://placehold.co/300x450'">

<div class="common-novel-body">

<h2>

${novel.title}

</h2>

<p>

${novel.category}

•

${novel.language}

</p>

<div class="common-novel-meta">

<span>

👁 ${formatNumber(novel.views)}

</span>

<span>

❤️ ${formatNumber(novel.followers)}

</span>

</div>

<div class="common-novel-buttons">

<button

class="btn btn-primary"

onclick="event.stopPropagation();window.location='reader.html?chapter=${novel.first_chapter_id||1}'">

Read Now

</button>

</div>

</div>

</div>

`;

}

async function loadTrending(){

try{

const response =
await fetch(

`${API}/api/novels`

);

const novels =
await response.json();

const container =
document.getElementById(
"trendingNovels"
);

container.innerHTML="";

novels
.sort((a,b)=>b.views-a.views)
.slice(0,6)
.forEach(novel=>{

container.innerHTML +=
createNovelCard(novel);

});

}
catch(err){

console.log(err);

}

}

async function loadRecommended(){

try{

const response =
await fetch(

`${API}/api/novels`

);

const novels =
await response.json();

const container =
document.getElementById(
"recommendedNovels"
);

container.innerHTML="";

novels
.slice(0,6)
.forEach(novel=>{

container.innerHTML +=
createNovelCard(novel);

});

}
catch(err){

console.log(err);

}

}

async function loadRecent(){

try{

const response =
await fetch(

`${API}/api/novels`

);

const novels =
await response.json();

const container =
document.getElementById(
"recentNovels"
);

container.innerHTML="";

novels
.reverse()
.slice(0,6)
.forEach(novel=>{

container.innerHTML +=
createNovelCard(novel);

});

}
catch(err){

console.log(err);

}

}


function loadReaderStats(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const stats=

JSON.parse(

localStorage.getItem(

`reader-stats-${user.id}`

)

);

if(!stats)return;

document.getElementById("readingStreak").textContent=

stats.streak;

document.getElementById("chaptersCompleted").textContent=

stats.chapters;

document.getElementById("booksCompleted").textContent=

stats.books.length;

document.getElementById("readingHours").textContent=

(Math.floor(stats.minutes/60)||0);

}

async function loadBookmarks(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const response=await fetch(

`${API}/api/writers/bookmarks/${user.id}`

);

const bookmarks=await response.json();

const container=

document.getElementById("bookmarksContainer");

if(!container)return;

container.innerHTML="";

if(bookmarks.length===0){

container.innerHTML="<p>No bookmarks yet.</p>";

return;

}

bookmarks.forEach(bookmark=>{

container.innerHTML+=`

<div class="bookmark-card">

<h3>

Chapter ${bookmark.chapter_no}

</h3>

<p>

${bookmark.title}

</p>

<button
class="start-btn"
onclick="location.href='reader.html?chapter=${bookmark.id}'">

📖 Read

</button>

<button
class="report-btn"
onclick="deleteBookmark(${bookmark.id})">

🗑 Delete

</button>

</div>

</div>

`;

});

}

async function deleteBookmark(id){

await fetch(

`${API}/api/writers/bookmark/${id}`,

{

method:"DELETE"

}

);

loadBookmarks();

}

async function loadNotifications(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const response=await fetch(

`${API}/api/notifications/${user.id}`

);

const notifications=

await response.json();

const container=

document.getElementById(

"notificationsContainer"

);

if(!container)return;

container.innerHTML="";

if(notifications.length===0){

container.innerHTML=`

<p>

No notifications yet.

</p>

`;

return;

}

notifications.forEach(notification=>{

container.innerHTML+=`

<div class="notification-card">

<div>

<div class="notification-title">

${notification.title}

</div>

<div class="notification-time">

${notification.created_at}

</div>

</div>

</div>

`;

});

}

async function loadDiscover(){

const response=

await fetch(

`${API}/api/novels`

);

const novels=

await response.json();

renderDiscover(

"trendingNovels",

[...novels]

.sort((a,b)=>b.views-a.views)

.slice(0,5),

`${novel.views} Views`

);

renderDiscover(

"topRatedNovels",

[...novels]

.sort((a,b)=>(b.rating||0)-(a.rating||0))

.slice(0,5),

`${novel.rating||0} ⭐`

);

renderDiscover(

"newNovels",

[...novels]

.sort(

(a,b)=>new Date(b.created_at)-new Date(a.created_at)

)

.slice(0,5),

"🆕"

);

renderDiscover(

"mostReadNovels",

[...novels]

.sort((a,b)=>b.views-a.views)

.slice(0,5),

`${novel.views} Reads`

);

}

function renderDiscover(

containerId,

novels,

label

){

const container=

document.querySelector(

`#${containerId} .discover-list`

);

if(!container)return;

container.innerHTML="";

novels.forEach(novel=>{

container.innerHTML+=`

<div

class="discover-item"

onclick="location.href='novel.html?id=${novel.id}'">

<div>

<div class="discover-title">

${novel.title}

</div>

<div class="discover-meta">

${novel.category}

</div>

</div>

<div>

${label}

</div>

</div>

`;

});

}



loadReaderStats();

loadBookmarks();

loadNotifications();

loadDiscover();