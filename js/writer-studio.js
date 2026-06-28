const API="https://mylikith-backend.onrender.com";

const user=JSON.parse(localStorage.getItem("user"));

const params=new URLSearchParams(location.search);

const novelId=params.get("novel");
loadNovel();

const editor=document.getElementById("chapterEditor");

const preview=document.getElementById("previewContainer");

let previewMode=false;

const title=document.getElementById("chapterTitle");

const chapterList=document.getElementById("chapterList");

const wordCount=document.getElementById("wordCount");

const charCount=document.getElementById("charCount");

const readingTime=document.getElementById("readingTime");

const saveStatus=document.getElementById("saveStatus");

const settingsModal=document.getElementById("settingsModal");

let currentChapter=null;

let hasChanges=false;

async function loadNovel(){

const res=await fetch(`${API}/api/novels/${novelId}`);

const novel=await res.json();

document.getElementById("novelTitle").textContent=novel.title;

document.getElementById("novelGenre").textContent=`${novel.category} • ${novel.language}`;

document.getElementById("novelStatus").textContent=novel.status;

document.getElementById("novelViews").textContent=`👁 ${novel.views}`;

document.getElementById("novelFollowers").textContent=`❤️ ${novel.followers}`;

document.getElementById("novelCover").src=novel.cover_url||"assets/images/default-cover.png";

document.getElementById("settingsCover").src=
novel.cover_url||"assets/images/default-cover.png";

document.getElementById("settingsNovelTitle").textContent=
novel.title;

document.getElementById("settingsNovelInfo").textContent=
`${novel.category} • ${novel.language}`;

document.getElementById("settingTitle").value=novel.title;

document.getElementById("settingDescription").value=novel.description||"";

document.getElementById("settingCategory").value=novel.category;

document.getElementById("settingLanguage").value=novel.language;

document.getElementById("settingStatus").value=novel.status;

}

document.getElementById("settingsBtn").onclick=()=>{

settingsModal.classList.add("show");

};

document.getElementById("closeSettingsBtn").onclick=()=>{

settingsModal.classList.remove("show");

};

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

<div class="chapter-meta">

❤️ ${ch.likes || 0} Likes

</div>

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


const chapterModal=document.getElementById("chapterModal");

document.getElementById("newChapterBtn").onclick=()=>{

chapterModal.classList.add("show");

};

document.getElementById("firstChapterBtn").onclick=()=>{

chapterModal.classList.add("show");

};

document.getElementById("cancelChapterBtn").onclick=()=>{

chapterModal.classList.remove("show");

document.getElementById("newChapterTitle").value="";

};

document.getElementById("createChapterBtn").onclick=createChapter;

document.getElementById("previewBtn").onclick=()=>{

previewMode=!previewMode;

if(previewMode){

preview.innerHTML=`

<h1>${title.value}</h1>

${editor.innerHTML}

`;

preview.classList.add("show");

editor.classList.add("hide");

document.getElementById("previewBtn").innerHTML="✏ Edit";

}else{

preview.classList.remove("show");

editor.classList.remove("hide");

document.getElementById("previewBtn").innerHTML="👁 Preview";

}

};

document.getElementById("publishBtn").onclick=()=>{

window.location=`publish-novel.html?novel=${novelId}`;

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

if(previewMode){

preview.innerHTML=`

<h1>${title.value}</h1>

${editor.innerHTML}

`;

}

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

document.getElementById("saveSettingsBtn").onclick=async()=>{

const response=await fetch(

`${API}/api/writers/novels/${novelId}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

title:document.getElementById("settingTitle").value,

description:document.getElementById("settingDescription").value,

category:document.getElementById("settingCategory").value,

language:document.getElementById("settingLanguage").value,

status:document.getElementById("settingStatus").value

})

}

);

const data=await response.json();

if(data.success){

settingsModal.classList.remove("show");

loadNovel();

alert("Novel updated successfully.");

}

};

