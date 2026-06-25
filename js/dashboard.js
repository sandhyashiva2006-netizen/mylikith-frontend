const API =
"https://mylikith-backend.onrender.com";

const dashboardUser =
JSON.parse(
localStorage.getItem("user")
);

if(dashboardUser){

document.getElementById(
"userName"
).textContent =
dashboardUser.name;

}

const logoutBtn =
document.getElementById(
"logoutBtn"
);

if(logoutBtn){

logoutBtn.addEventListener(
"click",
() => {

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

if(!dashboardUser){
return;
}

const response =
await fetch(

`${API}/api/writer/analytics/${dashboardUser.id}`

);

const data =
await response.json();

document.getElementById("totalNovels").textContent =
data.novels;

document.getElementById("totalChapters").textContent =
data.chapters;

document.getElementById("totalReads").textContent =
data.reads;

document.getElementById("totalFollowers").textContent =
data.followers;

document.getElementById("averageRating").textContent =
data.rating;

}

loadAnalytics();

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

