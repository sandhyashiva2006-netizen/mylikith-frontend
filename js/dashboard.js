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

