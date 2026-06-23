const API =
"https://mylikith-backend.onrender.com";

const params =
new URLSearchParams(
window.location.search
);

const chapterId =
params.get("id");

async function loadChapter(){

const response =
await fetch(

`${API}/api/chapters/${chapterId}`

);

const chapter =
await response.json();

document.getElementById(
"chapterTitle"
).value =
chapter.title;

document.getElementById(
"chapterContent"
).value =
chapter.content;

}

async function saveChapter(){

const response =
await fetch(

`${API}/api/writers/chapters/${chapterId}`,

{
method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

title:
document.getElementById(
"chapterTitle"
).value,

content:
document.getElementById(
"chapterContent"
).value

})

}

);

const data =
await response.json();

if(data.success){

alert(
"Chapter Updated"
);

window.history.back();

}

}

loadChapter();