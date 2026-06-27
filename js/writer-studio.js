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

let hasChanges=false;

let autoSaveTimer=null;

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
onclick="openChapter(${ch.id},this)">

<div class="chapter-header">

<strong>

Chapter ${ch.chapter_no}

</strong>

<div class="chapter-actions">

<button
onclick="event.stopPropagation();renameChapter(${ch.id},'${ch.title.replace(/'/g,"\\'")}')">

✏

</button>

<button
onclick="event.stopPropagation();deleteChapter(${ch.id})">

🗑

</button>

</div>

</div>

<small>

${ch.title}

</small>

</div>

`;

});

}

async function openChapter(id,element){

document
.querySelectorAll(".chapter-item")
.forEach(item=>item.classList.remove("active"));

if(element){
element.classList.add("active");
}

currentChapter=id;

const res=await fetch(`${API}/api/chapters/${id}`);

const chapter=await res.json();

title.value=chapter.title;

editor.innerHTML=chapter.content||"";

editor.focus();

calculate();

hasChanges=false;

saveStatus.textContent="🟢 Saved";

}

function calculate(){

const text=editor.innerText;

const words=text.trim()==""?0:text.trim().split(/\s+/).length;

wordCount.textContent=`Words : ${words}`;

charCount.textContent=`Characters : ${text.length}`;

readingTime.textContent=`Reading : ${Math.max(1,Math.ceil(words/220))} min`;

saveStatus.textContent="Unsaved";

saveStatus.textContent="🟡 Unsaved";

hasChanges=true;

}

editor.addEventListener("input",calculate);

document
.querySelectorAll(".editor-toolbar button[data-command]")
.forEach(button=>{

button.onclick=()=>{

const command=button.dataset.command;

document.execCommand(command,false,null);

editor.focus();

calculate();

};

});

title.addEventListener("input",calculate);

document.getElementById("saveDraftBtn").onclick=saveChapter;

async function saveChapter(){

if(!currentChapter) return;

saveStatus.textContent="🔄 Saving...";

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

hasChanges=false;

saveStatus.textContent="🟢 Saved";

document.getElementById("lastSaved").textContent=
new Date().toLocaleTimeString();

}

const chapterModal=document.getElementById("chapterModal");

document.getElementById("newChapterBtn").onclick=()=>{

chapterModal.classList.add("show");

};

document.getElementById("firstChapterBtn").onclick=()=>{

chapterModal.classList.add("show");

};

document.getElementById("cancelChapterBtn").onclick=()=>{

chapterModal.classList.remove("show");

};

document.getElementById("createChapterBtn").onclick=createChapter;

document.getElementById("publishBtn").onclick=()=>{

alert("Publishing will be implemented in Phase 15.2");

};

loadChapters();

async function saveChapter(){

if(!currentChapter)return;

saveStatus.textContent="🔄 Saving...";

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

hasChanges=false;

saveStatus.textContent="🟢 Saved";

document.getElementById("lastSaved").textContent=

new Date().toLocaleTimeString();

}

async function createChapter(){

const title=document
.getElementById("newChapterTitle")
.value
.trim();

if(!title){

alert("Enter chapter title");

return;

}

const chapterNo=
document.querySelectorAll(".chapter-item").length+1;

const response=await fetch(

`${API}/api/writers/chapters`,

{

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

}

);

const data=await response.json();

if(data.success){

chapterModal.classList.remove("show");

document.getElementById("newChapterTitle").value="";

await loadChapters();

setTimeout(()=>{

const item=document.querySelector(".chapter-item:last-child");

if(item){

item.click();

}

},100);

document.getElementById("chapterTitle").focus();

}

}

async function renameChapter(id,currentTitle){

const newTitle=prompt("Rename Chapter",currentTitle);

if(!newTitle || newTitle===currentTitle)return;

const chapter=await fetch(`${API}/api/chapters/${id}`)
.then(r=>r.json());

await fetch(`${API}/api/writers/chapters/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

title:newTitle,

content:chapter.content

})

});

loadChapters();

}

async function deleteChapter(id){

if(!confirm("Delete this chapter?")) return;

await fetch(`${API}/api/writers/chapters/${id}`,{

method:"DELETE"

});

title.value="";

editor.innerHTML="";

loadChapters();

}

setInterval(()=>{

if(hasChanges){

saveChapter();

}

},20000);

document.addEventListener("keydown",(e)=>{

if((e.ctrlKey||e.metaKey)&&e.key==="s"){

e.preventDefault();

saveChapter();

}

});

document.getElementById("undoBtn").onclick=()=>{

document.execCommand("undo");

editor.focus();

};

document.getElementById("redoBtn").onclick=()=>{

document.execCommand("redo");

editor.focus();

};

editor.addEventListener("keydown",e=>{

if(e.key==="Tab"){

e.preventDefault();

document.execCommand("insertHTML",false,"&nbsp;&nbsp;&nbsp;&nbsp;");

}

});

editor.addEventListener("paste",e=>{

e.preventDefault();

const text=(e.clipboardData||window.clipboardData).getData("text");

document.execCommand("insertText",false,text);

});

