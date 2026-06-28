const API="https://mylikith-backend.onrender.com";

const admin=

JSON.parse(localStorage.getItem("user"));

if(!admin){

window.location.href="admin-login.html";

}

if(admin.role!=="admin"){

window.location.href="index.html";

}

let novels=[];

async function loadNovels(){

const response=
await fetch(`${API}/api/admin/novels`);

novels=
await response.json();

renderNovels(novels);

}

function renderNovels(list){

const table=
document.getElementById("novelsTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=
"<div class='loading'>No novels found</div>";

return;

}

list.forEach(novel=>{

table.innerHTML+=`

<div class="novel-row">

<img src="${novel.cover_url||'assets/images/default-cover.png'}">

<div>

<strong>${novel.title}</strong>

</div>

<div>

${novel.author}

</div>

<div>

${novel.status}

</div>

<div class="user-actions">

<button
class="admin-btn"
onclick="featureNovel(${novel.id})">

⭐ Feature

</button>

<button
class="admin-btn"
onclick="editNovel(${novel.id})">

✏ Edit

</button>

<button
class="admin-btn delete-btn"
onclick="deleteNovel(${novel.id})">

🗑 Delete

</button>

</div>

</div>

`;

});

}

document.getElementById("searchNovel")
.addEventListener("input",function(){

const q=this.value.toLowerCase();

renderNovels(

novels.filter(n=>

n.title.toLowerCase().includes(q)

)

);

});

async function deleteNovel(id){

if(!confirm("Delete novel?"))
return;

await fetch(

`${API}/api/admin/novels/${id}`,

{

method:"DELETE"

}

);

loadNovels();

}

async function featureNovel(id){

await fetch(

`${API}/api/admin/novels/${id}/feature`,

{

method:"PUT"

}

);

alert("Novel Featured");

}

function editNovel(id){

window.location.href=
`writer-studio.html?novel=${id}`;

}

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");

window.location.href="admin-login.html";

};

}

loadNovels();