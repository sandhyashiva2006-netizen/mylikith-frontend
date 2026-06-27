const API="https://mylikith-backend.onrender.com";

const user=JSON.parse(localStorage.getItem("user"));

const params=new URLSearchParams(location.search);

const novelId=params.get("novel");
loadNovel();

const editor=document.getElementById("chapterEditor");

const title=document.getElementById("chapterTitle");

const chapterList=document.getElementById("chapterList");

const wordCount=document.getElementById("wordCount");

const charCount=document.getElementById("charCount");

const readingTime=document.getElementById("readingTime");

const saveStatus=document.getElementById("saveStatus");

let currentChapter=null;

async function loadNovel(){

const res=await fetch(`${API}/api/novels/${novelId}`);

const novel=await res.json();

document.getElementById("novelTitle").textContent=novel.title;

document.getElementById("novelGenre").textContent=`${novel.category} • ${novel.language}`;

document.getElementById("novelStatus").textContent=novel.status;

document.getElementById("novelViews").textContent=`👁 ${novel.views}`;

document.getElementById("novelFollowers").textContent=`❤️ ${novel.followers}`;

document.getElementById("novelCover").src=novel.cover_url||"assets/images/default-cover.png";

}

async function loadChapters(){

const res=await fetch(`${API}/api/writers/chapters/${novelId}`);

const chapters=await res.json();

chapterList.innerHTML="";

chapters.forEach(ch=>{

chapterList.innerHTML+=`

<div class="chapter-item"

onclick="openChapter(${ch.id})">

Chapter ${ch.chapter_no}

<br>

<small>${ch.title}</small>

</div>

`;

});

}

async function openChapter(id){

currentChapter=id;

const res=await fetch(`${API}/api/chapters/${id}`);

const chapter=await res.json();

title.value=chapter.title;

editor.innerHTML=chapter.content||"";

calculate();

}

function calculate(){

const text=editor.innerText;

const words=text.trim()==""?0:text.trim().split(/\s+/).length;

wordCount.textContent=`Words : ${words}`;

charCount.textContent=`Characters : ${text.length}`;

readingTime.textContent=`Reading : ${Math.max(1,Math.ceil(words/220))} min`;

saveStatus.textContent="Unsaved";

}

editor.addEventListener("input",calculate);

title.addEventListener("input",calculate);

document.getElementById("saveDraftBtn").onclick=async()=>{

if(!currentChapter) return;

await fetch(`${API}/api/writers/chapters/${currentChapter}`,{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

title:title.value,

content:editor.innerHTML

})

});

saveStatus.textContent="Saved";

};

document.getElementById("newChapterBtn").onclick=showCreateChapterDialog;

document.getElementById("firstChapterBtn").onclick=showCreateChapterDialog;

document.getElementById("publishBtn").onclick=()=>{

alert("Publishing will be implemented in Phase 15.2");

};

loadChapters();

async function showCreateChapterDialog(){

const title=prompt("Enter Chapter Title");

if(!title) return;

const chapterNo=document.querySelectorAll(".chapter-item").length+1;

const response=await fetch(`${API}/api/writers/chapters`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

novel_id:novelId,

chapter_no:chapterNo,

title,

content:""

})

});

const data=await response.json();

if(data.success){

loadChapters();

openChapter(data.chapter.id);

}

}

