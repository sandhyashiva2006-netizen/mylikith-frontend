const API =
"https://mylikith-backend.onrender.com";

const params =
new URLSearchParams(
window.location.search
);

const novelId =
params.get("id");

async function loadNovel(){

const response =
await fetch(

`${API}/api/novels/${novelId}`

);

const novel =
await response.json();

document.getElementById(
"title"
).value =
novel.title;

document.getElementById(
"description"
).value =
novel.description;

document.getElementById(
"language"
).value =
novel.language;

document.getElementById(
"category"
).value =
novel.category;

}

async function updateNovel(){

const response =
await fetch(

`${API}/api/writers/novels/${novelId}`,

{
method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

title:
document.getElementById(
"title"
).value,

description:
document.getElementById(
"description"
).value,

language:
document.getElementById(
"language"
).value,

category:
document.getElementById(
"category"
).value

})

}

);

const data =
await response.json();

if(data.success){

alert(
"Novel Updated"
);

window.location =
"my-novels.html";

}

}

loadNovel();