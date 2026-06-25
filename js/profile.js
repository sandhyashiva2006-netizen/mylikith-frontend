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