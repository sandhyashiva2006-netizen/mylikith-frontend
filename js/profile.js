const API =
"https://mylikith-backend.onrender.com";

const user =
JSON.parse(
localStorage.getItem("user")
);

if(!user){

window.location =
"login.html";

}

document.getElementById(
"profileName"
).textContent =
user.name;

document.getElementById(
"profileEmail"
).textContent =
user.email;

async function loadStats(){

const response =
await fetch(

`${API}/api/profile/stats/${user.id}`

);

const stats =
await response.json();

document.getElementById(
"bookmarkCount"
).textContent =
stats.bookmarks;

document.getElementById(
"followCount"
).textContent =
stats.follows;

document.getElementById(
"reviewCount"
).textContent =
stats.reviews;

document.getElementById(
"commentCount"
).textContent =
stats.comments;

}

loadStats();

async function loadContinueReading(){

const response =
await fetch(

`${API}/api/profile/continue/${user.id}`

);

const data =
await response.json();

const container =
document.getElementById(
"continueReading"
);

if(!data){

container.innerHTML =
"No books in progress.";

return;

}

container.innerHTML = `

<div class="continue-card">

<h3>${data.novel_title}</h3>

<p>${data.chapter_title}</p>

<button
onclick="window.location='reader.html?chapter=${data.chapter_id}'">

Continue Reading

</button>

</div>

`;

}

loadContinueReading();