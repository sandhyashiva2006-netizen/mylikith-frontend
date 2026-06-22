const API =
"https://mylikith-backend.onrender.com";

async function createNovel(){

const user =
JSON.parse(
localStorage.getItem("user")
);

const title =
document.getElementById(
"title"
).value;

const description =
document.getElementById(
"description"
).value;

const language =
document.getElementById(
"language"
).value;

const category =
document.getElementById(
"category"
).value;

const response =
await fetch(

`${API}/api/writers/novels`,

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

author_id:user.id,

title,
description,
language,
category

})

}

);

const data =
await response.json();

if(data.success){

alert(
"Novel Created"
);

window.location =
"writer-dashboard.html";

}else{

alert(
"Creation Failed"
);

}

}