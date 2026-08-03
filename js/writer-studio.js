const API="https://mylikith-backend.onrender.com";

const user=JSON.parse(localStorage.getItem("user"));

const params=new URLSearchParams(location.search);

const premiumChapter =
document.getElementById("premiumChapter");

const chapterCoins =
document.getElementById("chapterCoins");

const schedulePublish=
document.getElementById("schedulePublish");

const publishAt=
document.getElementById("publishAt");

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

document.getElementById("novelGenre").textContent=
`${(novel.categories||[novel.category]).join(" • ")} • ${novel.language}`;

document.getElementById("novelStatus").textContent=novel.status;

document.getElementById("novelViews").textContent=`👁 ${novel.views}`;

document.getElementById("novelFollowers").textContent=`❤️ ${novel.followers}`;

document.getElementById("novelCover").src=novel.cover_url||"assets/images/default-cover.png";

document.getElementById("settingsCover").src=
novel.cover_url||"assets/images/default-cover.png";

document.getElementById("settingsNovelTitle").textContent=
novel.title;

document.getElementById("settingsNovelInfo").textContent=
`${(novel.categories||[novel.category]).join(" • ")} • ${novel.language}`;

document.getElementById("settingTitle").value=novel.title;

document.getElementById("settingDescription").value=novel.description||"";

document.getElementById("settingLanguage").value=novel.language;

const selected = novel.categories || [];

document
.querySelectorAll("#categoryContainer input")
.forEach(cb=>{
    cb.checked = selected.includes(cb.value);
});

document.getElementById("settingStatus").value=novel.status;

}

document.getElementById("settingsBtn").onclick=()=>{

settingsModal.classList.add("show");

};

document.getElementById("closeSettingsBtn").onclick=()=>{

settingsModal.classList.remove("show");

};

schedulePublish.onchange=()=>{

publishAt.style.display=

schedulePublish.checked

?

"block"

:

"none";

};

async function loadChapters(){

const res=await fetch(`${API}/api/writers/chapters/${novelId}`);

const chapters=await res.json();

chapterList.innerHTML="";

document.getElementById("chapterCount").textContent =
    `${chapters.length} ${chapters.length === 1 ? "Chapter" : "Chapters"}`;

const emptyState = document.getElementById("emptyChapterState");

if (chapters.length === 0) {

    emptyState.style.display = "block";

} else {

    emptyState.style.display = "none";

}

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
onclick="event.stopPropagation();moveChapter(${ch.id},'up')">
⬆
</button>

<button
onclick="event.stopPropagation();moveChapter(${ch.id},'down')">
⬇
</button>

<button
onclick="event.stopPropagation();renameChapter(${ch.id},'${ch.title.replace(/'/g,"\\'")}')">
✏
</button>

<button
onclick="event.stopPropagation();duplicateChapter(${ch.id})">
📄
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

${
ch.is_scheduled

?

"🕒 Scheduled"

:

ch.is_draft

?

"🟡 Draft"

:

"🟢 Published"

}

&nbsp;&nbsp;

❤️ ${Number(ch.likes||0)} Likes

</div>

</div>

`;

});

}

async function moveChapter(id, direction){

    const response = await fetch(

        `${API}/api/writers/chapters/${id}/move`,

        {
            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                direction
            })

        }

    );

    const data = await response.json();

    if(data.success){

        loadChapters();

    }else{

        alert("Unable to move chapter.");

    }

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

premiumChapter.checked=
chapter.is_premium||false;

chapterCoins.value=
chapter.coins_required||10;

if(chapter.is_scheduled){

schedulePublish.checked=true;

publishAt.style.display="block";

const dt=new Date(chapter.publish_at);

publishAt.value=

new Date(

dt.getTime()

-dt.getTimezoneOffset()*60000

)

.toISOString()

.slice(0,16);

}else{

schedulePublish.checked=false;

publishAt.style.display="none";

publishAt.value="";

}

document.getElementById("earlyAccess").checked=
chapter.early_access||false;

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

document.getElementById("publishBtn").onclick=publishChapter;

document.getElementById("saveDraftBtn").onclick=saveChapter;

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

content:editor.innerHTML,

is_premium:
premiumChapter.checked,

coins_required:
Number(chapterCoins.value),

early_access:
document.getElementById("earlyAccess").checked,

is_scheduled:
schedulePublish.checked,

publish_at:
schedulePublish.checked
?
new Date(publishAt.value).toISOString()
:
null

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

async function publishChapter(){

if(!currentChapter){

alert("Open a chapter first.");

return;

}

if(!confirm("Publish this chapter?")){

return;

}

await saveChapter();

if(schedulePublish.checked){

alert("Chapter scheduled successfully.");

loadChapters();

return;

}

const response=await fetch(

`${API}/api/writers/chapters/${currentChapter}/publish`,

{

method:"PUT"

}

);

const data=await response.json();

if(data.success){

alert("Chapter published successfully.");

loadChapters();

}else{

alert("Unable to publish chapter.");

}

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

setInterval(async()=>{

    if(hasChanges && currentChapter){

        await saveChapter();

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

document.getElementById("uploadCoverBtn").onclick = async () => {

    const file = document.getElementById("changeCover").files[0];

    if (!file) {
        alert("Select a cover image.");
        return;
    }

    const formData = new FormData();
    formData.append("cover", file);

    const upload = await fetch(`${API}/api/upload-cover`, {
        method: "POST",
        body: formData
    });

    const result = await upload.json();

    if (!result.success) {
        alert(result.message);
        return;
    }

    const response = await fetch(`${API}/api/writers/novels/${novelId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cover_url: result.url
        })
    });

    const data = await response.json();

    if (data.success) {

        document.getElementById("settingsCover").src =
            result.url + "?t=" + Date.now();

        document.getElementById("novelCover").src =
            result.url + "?t=" + Date.now();

        alert("Cover updated successfully.");

    } else {

        alert("Unable to update cover.");

    }

};

document.getElementById("saveSettingsBtn").onclick = async () => {

    const categories = [
        ...document.querySelectorAll("#categoryContainer input:checked")
    ].map(c => c.value);

    if (categories.length === 0) {

        alert("Select at least one category.");

        return;

    }

    if (categories.length > 5) {

        alert("Maximum 5 categories allowed.");

        return;

    }

    const response = await fetch(`${API}/api/writers/novels/${novelId}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            title: document.getElementById("settingTitle").value,

            description: document.getElementById("settingDescription").value,

            category: categories[0],

            categories: categories,

            language: document.getElementById("settingLanguage").value,

            status: document.getElementById("settingStatus").value

        })

    });

    const data = await response.json();

    if (data.success) {

        settingsModal.classList.remove("show");

        loadNovel();

        alert("Novel updated successfully.");

    }

};

window.addEventListener("beforeunload",(e)=>{

    if(hasChanges){

        e.preventDefault();

        e.returnValue="";

    }

});

