const API =
"https://mylikith-backend.onrender.com";

async function createNovel(){

const user =
JSON.parse(
localStorage.getItem("user")
);

let coverUrl="";

const file =

document.getElementById(
"cover"
).files[0];

if(file){

    const allowedTypes=[
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if(!allowedTypes.includes(file.type)){

        alert("Only JPG, PNG and WEBP images are allowed.");
        return;

    }

    if(file.size>5*1024*1024){

        alert("Cover image must be less than 5 MB.");
        return;

    }

}

if(file){

const formData =
new FormData();

formData.append(
"cover",
file
);

const upload =
await fetch(

`${API}/api/upload-cover`,

{

method:"POST",

body:formData

}

);

const image =
await upload.json();

coverUrl =
image.url;

}

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
category,

cover_url:coverUrl

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