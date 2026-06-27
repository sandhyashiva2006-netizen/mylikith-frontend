const API =
"https://mylikith-backend.onrender.com";

const readerUser =
JSON.parse(
localStorage.getItem("user")
);

if(readerUser){

document.getElementById(
"readerName"
).textContent =
readerUser.name;

}

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

function loadContinueReading(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const data=

JSON.parse(

localStorage.getItem(

`continue-reading-${user.id}`

)

);

if(!data)return;

const container=

document.getElementById(

"continueReadingCard"

);

if(!container)return;

container.innerHTML=`

<div class="continue-card">

<h3>

Continue Reading

</h3>

<p>

Chapter ${data.chapterNo}

</p>

<h4>

${data.chapterTitle}

</h4>

<button

class="btn btn-primary"

onclick="location.href='reader.html?chapter=${data.chapterId}'">

Continue

</button>

</div>

`;

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

loadTrending();

loadRecommended();

loadRecent();

loadContinueReading();

loadReaderStats();