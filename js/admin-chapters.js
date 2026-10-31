const API="https://mylikith-backend.onrender.com";

const admin=

JSON.parse(localStorage.getItem("user"));

if(!admin){

window.location.href="admin-login.html";

}

if(admin.role!=="admin"){

window.location.href="index.html";

}

let chapters=[];

async function loadChapters(){

const response=
await adminFetch(`${API}/api/admin/chapters`);

chapters=
await response.json();

renderChapters(chapters);

}

function renderChapters(list){

const table=
document.getElementById("chaptersTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML="<div class='loading'>No chapters</div>";

return;

}

list.forEach(chapter=>{

table.innerHTML+=`

<div class="chapter-row">

<div>

${chapter.chapter_no}

</div>

<div>

<strong>

${chapter.title}

</strong>

</div>

<div>

${chapter.novel}

</div>

<div>

${chapter.author}

</div>

<div class="user-actions">

<button
class="admin-btn"
onclick="editChapter(${chapter.id},${chapter.novel_id})">

✏ Edit

</button>

<button
class="admin-btn delete-btn"
onclick="deleteChapter(${chapter.id})">

🗑 Delete

</button>

</div>

</div>

`;

});

}

document.getElementById("searchChapter")
.addEventListener("input",function(){

const q=
this.value.toLowerCase();

renderChapters(

chapters.filter(c=>

c.title.toLowerCase().includes(q)

||

c.novel.toLowerCase().includes(q)

)

);

});

function editChapter(id, novelId){

const params = new URLSearchParams();
if (novelId) params.set("novel", novelId);
params.set("chapter", id);

window.location.href = `writer-studio.html?${params.toString()}`;

}

async function deleteChapter(id){

if(!confirm("Delete chapter?"))
return;

await adminFetch(

`${API}/api/admin/chapters/${id}`,

{

method:"DELETE"

}

);

loadChapters();

}

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");
localStorage.removeItem("token");

window.location.href="admin-login.html";

};

}

loadChapters();