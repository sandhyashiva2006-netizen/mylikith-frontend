const API =
"https://mylikith-backend.onrender.com";

const dashboardUser =
JSON.parse(
localStorage.getItem("user")
);

const writerStudioBtn =
document.getElementById("writerStudioBtn");

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

const draftsBtn=document.querySelector(
'button[onclick*="tab=drafts"]'
);

if(draftsBtn){

draftsBtn.disabled=false;

}

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

const filter =
new URLSearchParams(window.location.search)
.get("filter");

let filteredNovels = novels;

if(filter==="draft"){

filteredNovels =
novels.filter(
n=>n.status.toLowerCase()==="draft"
);

}
else if(filter==="published"){

filteredNovels =
novels.filter(
n=>n.status.toLowerCase()==="published"
);

}

const grid =
document.getElementById(
"novelsGrid"
);

grid.innerHTML="";

if(filteredNovels.length===0){

grid.innerHTML=`

<h3>No novels found</h3>

`;

return;

}

filteredNovels.forEach(novel=>{

grid.innerHTML+=`

<div class="novel-manage-card">

<div class="novel-cover">

<img
src="${novel.cover_url || 'https://placehold.co/300x450'}"
alt="${novel.title}"
onerror="this.src='assets/images/default-cover.png'">

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
class="novel-btn studio-btn"
onclick="openStudio(${novel.id})">

✍ Writer Studio

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



function openStudio(id){

window.location =
`writer-studio.html?novel=${id}`;

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

if(writerStudioBtn){

writerStudioBtn.onclick=(e)=>{

e.preventDefault();

fetch(`${API}/api/writers/my-novels/${dashboardUser.id}`)
.then(res=>res.json())
.then(novels=>{

if(novels.length===0){

alert("Please create a novel first.");

window.location="create-novel.html";

return;

}

window.location=`writer-studio.html?novel=${novels[0].id}`;

});

};

}

async function loadRecentActivity(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const response=await fetch(

`${API}/api/writer/activity/${user.id}`

);

const activities=await response.json();

const container=

document.getElementById("recentActivity");

container.innerHTML="";

if(activities.length===0){

container.innerHTML="<p>No activity yet.</p>";

return;

}

activities.forEach(activity=>{

container.innerHTML+=`

<div class="activity-card">

<div>

<div class="activity-title">

${activity.action}

</div>

<div>

${activity.title}

</div>

</div>

<div class="activity-time">

${new Date(activity.created_at).toLocaleDateString()}

</div>

</div>

`;

});

}

async function loadWriterNotifications(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const response=

await fetch(

`${API}/api/writer/notifications/${user.id}`

);

const notifications=

await response.json();

const container=

document.getElementById(

"writerNotifications"

);

container.innerHTML="";

if(notifications.length===0){

container.innerHTML=

"<p>No notifications yet.</p>";

return;

}

notifications.forEach(notification=>{

container.innerHTML+=`

<div class="writer-notification">

<div>

<div class="writer-notification-title">

${notification.title}

</div>

</div>

<div class="writer-notification-time">

${new Date(notification.created_at).toLocaleDateString()}

</div>

</div>

`;

});

}

async function loadTopNovel(){

const user=

JSON.parse(localStorage.getItem("user"));

if(!user)return;

const response=

await fetch(

`${API}/api/writer/top-novel/${user.id}`

);

const novel=

await response.json();

if(!novel)return;

document.getElementById("topNovel").textContent=

novel.title;

document.getElementById("totalViews").textContent=

novel.views;

document.getElementById("averageRating").textContent =
Number(novel.rating) > 0
? novel.rating
: "New";

}

loadRecentActivity();

loadWriterNotifications();

loadTopNovel();