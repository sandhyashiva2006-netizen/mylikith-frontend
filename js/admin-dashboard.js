const API = "https://mylikith-backend.onrender.com";

const admin=

JSON.parse(localStorage.getItem("user"));

if(!admin){

window.location.href="admin-login.html";

}

if(admin.role!=="admin"){

window.location.href="index.html";

}

const admin =
JSON.parse(localStorage.getItem("user"));

if(admin){

const name =
document.getElementById("adminName");

if(name){

name.textContent = admin.name;

}

}

async function loadDashboard(){

try{

const response =
await fetch(`${API}/api/admin/dashboard`);

const data =
await response.json();

document.getElementById("totalUsers").textContent =
data.users || 0;

document.getElementById("totalWriters").textContent =
data.writers || 0;

document.getElementById("totalNovels").textContent =
data.novels || 0;

document.getElementById("totalChapters").textContent =
data.chapters || 0;

document.getElementById("totalReviews").textContent =
data.reviews || 0;

document.getElementById("totalComments").textContent =
data.comments || 0;

document.getElementById("totalViews").textContent =
data.views || 0;

document.getElementById("totalReports").textContent =
data.reports || 0;

}catch(err){

console.error(err);

}

}

async function loadRecentUsers(){

try{

const response =
await fetch(`${API}/api/admin/recent-users`);

const users =
await response.json();

const container =
document.getElementById("recentUsers");

container.innerHTML = "";

if(users.length===0){

container.innerHTML =
'<div class="loading">No users found</div>';

return;

}

users.forEach(user=>{

container.innerHTML += `

<div class="list-item">

<div>

<strong>${user.name}</strong>

<br>

<small>${user.email}</small>

</div>

<span class="badge">

${user.role}

</span>

</div>

`;

});

}catch(err){

console.error(err);

}

}

async function loadRecentNovels(){

try{

const response =
await fetch(`${API}/api/admin/recent-novels`);

const novels =
await response.json();

const container =
document.getElementById("recentNovels");

container.innerHTML = "";

if(novels.length===0){

container.innerHTML =
'<div class="loading">No novels found</div>';

return;

}

novels.forEach(novel=>{

container.innerHTML += `

<div class="list-item">

<div>

<strong>${novel.title}</strong>

<br>

<small>${novel.author}</small>

</div>

<span class="badge">

${novel.status}

</span>

</div>

`;

});

}catch(err){

console.error(err);

}

}

async function loadRecentReviews(){

const container =
document.getElementById("recentReviews");

container.innerHTML =
'<div class="loading">Coming Soon</div>';

}

async function loadReports(){

const container =
document.getElementById("recentReports");

container.innerHTML =
'<div class="loading">Coming Soon</div>';

}

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");

window.location.href="admin-login.html";

};

}

loadDashboard();

loadRecentUsers();

loadRecentNovels();

loadRecentReviews();

loadReports();