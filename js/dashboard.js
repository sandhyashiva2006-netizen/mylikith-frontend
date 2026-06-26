const API =
"https://mylikith-backend.onrender.com";

const dashboardUser =
JSON.parse(
localStorage.getItem("user")
);

if(!dashboardUser){

window.location =
"login.html";

}

document.getElementById(
"userName"
).textContent =
dashboardUser.name;

const logoutBtn =
document.getElementById(
"logoutBtn"
);

if(logoutBtn){

logoutBtn.addEventListener(
"click",
()=>{

localStorage.removeItem(
"token"
);

localStorage.removeItem(
"user"
);

window.location =
"login.html";

}
);

}

function formatNumber(num){

if(num>=1000000){

return (num/1000000).toFixed(1)+"M";

}

if(num>=1000){

return (num/1000).toFixed(1)+"K";

}

return num;

}

async function loadAnalytics(){

try{

const response =
await fetch(

`${API}/api/writer/analytics/${dashboardUser.id}`

);

const data =
await response.json();

document.getElementById(
"totalNovels"
).textContent =
data.novels;

document.getElementById(
"totalChapters"
).textContent =
data.chapters;

document.getElementById(
"totalReads"
).textContent =
formatNumber(data.reads);

document.getElementById(
"totalFollowers"
).textContent =
data.followers;

document.getElementById(
"averageRating"
).textContent =
data.rating;

}
catch(err){

console.log(err);

}

}

async function loadMyNovels(){

try{

const response =
await fetch(

`${API}/api/writers/my-novels/${dashboardUser.id}`

);

const novels =
await response.json();

const grid =
document.getElementById(
"novelsGrid"
);

grid.innerHTML="";

if(novels.length===0){

grid.innerHTML=`

<h3>No novels found</h3>

`;

return;

}

novels.forEach(novel=>{

grid.innerHTML+=`

<div class="novel-manage-card">

<div class="novel-cover">

<img
src="${
novel.cover_url ||

'assets/images/default-cover.png'

}"
alt="${novel.title}">

</div>

<div class="novel-info">

<h2>${novel.title}</h2>

<p>

🌍 ${novel.language}

•

🏷 ${novel.category}

</p>

<p>

📖 ${novel.status}

</p>

<div class="novel-stats">

<span>

👁 ${formatNumber(novel.views)}

</span>

<span>

❤️ ${formatNumber(novel.followers)}

</span>

</div>

<div class="novel-actions">

<button
class="novel-btn edit-btn"
onclick="editNovel(${novel.id})">

Edit

</button>

<button
class="novel-btn chapter-btn"
onclick="manageChapters(${novel.id})">

Chapters

</button>

<button
class="novel-btn delete-btn"
onclick="deleteNovel(${novel.id})">

Delete

</button>

</div>

</div>

</div>

`;

});

}
catch(err){

console.log(err);

}

}

function editNovel(id){

window.location =
`edit-novel.html?id=${id}`;

}

function manageChapters(id){

window.location =
`my-chapters.html?novel=${id}`;

}

async function deleteNovel(id){

const confirmDelete =
confirm(
"Delete this novel?"
);

if(!confirmDelete){
return;
}

try{

const response =
await fetch(

`${API}/api/writers/novels/${id}`,

{
method:"DELETE"
}

);

const data =
await response.json();

if(data.success){

alert(
"Novel Deleted Successfully"
);

loadAnalytics();

loadMyNovels();

}
else{

alert(
"Delete Failed"
);

}

}
catch(err){

console.log(err);

}

}

loadAnalytics();

loadMyNovels();