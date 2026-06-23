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

<h3>${novel.title}</h3>

<p>
${novel.category}
•
${novel.language}
</p>

<p>
${novel.status}
</p>

<div class="actions">

<button
class="edit-btn"
onclick="editNovel(${novel.id})">

Edit

</button>

<button
class="delete-btn"
onclick="deleteNovel(${novel.id})">

Delete

</button>

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