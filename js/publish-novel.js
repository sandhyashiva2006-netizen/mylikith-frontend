const API="https://mylikith-backend.onrender.com";

const params=new URLSearchParams(location.search);

const novelId=params.get("novel");

loadNovel();

async function loadNovel(){

const res=await fetch(`${API}/api/publish/${novelId}`);

const novel=await res.json();

document.getElementById("publishCover").src=

novel.cover_url||"assets/images/default-cover.png";

document.getElementById("publishTitle").textContent=

novel.title;

document.getElementById("publishDescription").textContent=

novel.description;

document.getElementById("publishCategory").textContent=

novel.category;

document.getElementById("publishLanguage").textContent=

novel.language;

document.getElementById("visibility").value=

novel.visibility;

document.getElementById("allowComments").checked=

novel.allow_comments;

document.getElementById("mature").checked=

novel.mature;

}

document.getElementById("backBtn").onclick=()=>{

history.back();

};

document.getElementById("publishNowBtn").onclick=async()=>{

const res=await fetch(

`${API}/api/publish/${novelId}/publish`,

{

method:"POST"

}

);

const data=await res.json();

if(data.success){

alert("Novel published successfully.");

window.location=`writer-studio.html?novel=${novelId}`;

}else{

alert("Publishing failed.");

}

};

document.getElementById("saveBtn").onclick=async()=>{

const res=await fetch(

`${API}/api/publish/${novelId}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

visibility:document.getElementById("visibility").value,

allow_comments:document.getElementById("allowComments").checked,

mature:document.getElementById("mature").checked

})

}

);

const data=await res.json();

if(data.success){

alert("Settings saved.");

}

};

