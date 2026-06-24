const user =
JSON.parse(
localStorage.getItem("user")
);

if(user){

document.getElementById(
"profileName"
).textContent =
user.name;

document.getElementById(
"profileEmail"
).textContent =
user.email;

}

loadProfileStats();

async function loadProfileStats(){

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/profile/stats/${user.id}`

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

