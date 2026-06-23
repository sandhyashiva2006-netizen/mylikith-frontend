const API =
"https://mylikith-backend.onrender.com";

const user =
JSON.parse(
localStorage.getItem("user")
);

async function loadNovels(){

const response =
await fetch(

`${API}/api/writers/my-novels/${user.id}`

);

const novels =
await response.json();

const select =
document.getElementById(
"novelSelect"
);

select.innerHTML = "";

novels.forEach(novel=>{

select.innerHTML += `

<option value="${novel.id}">
${novel.title}
</option>

`;

});

}

async function createChapter(){

const novel_id =
document.getElementById(
"novelSelect"
).value;

const chapter_number =
document.getElementById(
"chapterNumber"
).value;

const title =
document.getElementById(
"chapterTitle"
).value;

const content =
document.getElementById(
"chapterContent"
).value;

const response =
await fetch(

`${API}/api/writers/chapters`,

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

novel_id,
chapter_number,
title,
content

})

}

);

const data =
await response.json();

if(data.success){

alert(
"Chapter Published"
);

}else{

alert(
"Failed"
);

}

}

loadNovels();