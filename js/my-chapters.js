const API =
"https://mylikith-backend.onrender.com";

const params =
new URLSearchParams(
window.location.search
);

const novelId =
params.get("novel");

async function loadChapters(){

const response =
await fetch(

`${API}/api/writers/chapters/${novelId}`

);

const chapters =
await response.json();

const container =
document.getElementById(
"chaptersList"
);

container.innerHTML = "";

if(chapters.length===0){

container.innerHTML =
"<h3>No chapters yet</h3>";

return;

}

chapters.forEach(chapter=>{

container.innerHTML += `

<div class="chapter-card">

<h3>
Chapter ${chapter.chapter_no}
</h3>

<p>
${chapter.title}
</p>

<div class="actions">

<button
class="edit-btn"
onclick="editChapter(${chapter.id})">

Edit

</button>

<button
class="delete-btn"
onclick="deleteChapter(${chapter.id})">

Delete

</button>

</div>

</div>

`;

});

}

function editChapter(id){

alert(
"Edit Chapter " + id
);

}

async function deleteChapter(id){

const confirmDelete =
confirm(
"Delete this chapter?"
);

if(!confirmDelete){
return;
}

const response =
await fetch(

`${API}/api/writers/chapters/${id}`,

{
method:"DELETE"
}

);

const data =
await response.json();

if(data.success){

alert(
"Chapter Deleted"
);

loadChapters();

}

}

loadChapters();