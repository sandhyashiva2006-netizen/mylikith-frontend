const API =
"https://mylikith-backend.onrender.com";

const user =
JSON.parse(
localStorage.getItem("user")
);

async function loadMyNovels(){

try{

const response =
await fetch(

`${API}/api/writers/my-novels/${user.id}`

);

const novels =
await response.json();

const grid =
document.getElementById(
"novelsGrid"
);

grid.innerHTML = "";

if(novels.length===0){

grid.innerHTML =
"<h3>No novels yet</h3>";

return;

}

novels.forEach(novel=>{

grid.innerHTML += `

<div class="novel-card">

<img
src="${novel.cover_url || 'assets/images/default-cover.png'}"
alt="${novel.title}">

<div class="novel-info">

<div>

<div style="display:flex;justify-content:space-between;align-items:center;gap:20px;">

<h3>${novel.title}</h3>

<span style="
padding:8px 18px;
border-radius:30px;
background:${novel.status==="Completed"
?"#059669"
:novel.status==="Paused"
?"#DC2626"
:"#2563EB"};
color:#fff;
font-size:14px;
font-weight:700;
">

${novel.status}

</span>

</div>

<div class="novel-meta">

<span>📚 ${novel.category}</span>

<span>🌐 ${novel.language}</span>

<span>👁 ${novel.views || 0}</span>

<span>❤️ ${novel.followers || 0}</span>

</div>

<p class="novel-description">

${novel.description || "No description added yet."}

</p>

</div>

<div class="actions">

<button
class="edit-btn"
onclick="editNovel(${novel.id})">

✏ Edit Novel

</button>

<button
class="chapter-btn"
onclick="manageChapters(${novel.id})">

📖 Writer Studio

</button>

<button
class="analytics-btn"
onclick="location.href='writer-dashboard.html?novel=${novel.id}'">

📊 Analytics

</button>

<button
class="delete-btn"
onclick="deleteNovel(${novel.id})">

🗑 Delete

</button>

</div>

</div>

</div>

`;

});

}
catch(err){

console.error(err);

}

}

function editNovel(id){

window.location =
`edit-novel.html?id=${id}`;

}

function manageChapters(id){

window.location =
`writer-studio.html?novel=${id}`;

}

async function deleteNovel(id){

const confirmDelete =
confirm(
"Delete this novel?"
);

if(!confirmDelete){
return;
}

const response =
await fetch(

`${API}/api/writers/novels/${id}`,

{
method:"DELETE"
}

);

const data =
await response.json();

if(data.success){

alert(
"Novel Deleted"
);

loadMyNovels();

}else{

alert(
"Delete Failed"
);

}

}

loadMyNovels();