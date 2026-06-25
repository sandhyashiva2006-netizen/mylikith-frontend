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
Number(data.reads).toLocaleString();

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

const body =
document.getElementById(
"novelsTableBody"
);

if(!body){
return;
}

body.innerHTML="";

if(novels.length===0){

body.innerHTML=`

<tr>

<td colspan="7">

No novels found

</td>

</tr>

`;

return;

}

novels.forEach(novel=>{

body.innerHTML+=`

<tr>

<td>${novel.title}</td>

<td>${novel.language}</td>

<td>${novel.category}</td>

<td>${novel.status}</td>

<td>${novel.views}</td>

<td>${novel.followers}</td>

<td>

<button
class="edit-btn"
onclick="editNovel(${novel.id})">

Edit

</button>

<button
class="edit-btn"
onclick="manageChapters(${novel.id})">

Chapters

</button>

<button
class="delete-btn"
onclick="deleteNovel(${novel.id})">

Delete

</button>

</td>

</tr>

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