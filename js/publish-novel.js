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