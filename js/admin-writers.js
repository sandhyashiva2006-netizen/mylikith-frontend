const API="https://mylikith-backend.onrender.com";

const admin=
JSON.parse(localStorage.getItem("user"));

if(!admin){

window.location.href="admin-login.html";

}

if(admin.role!=="admin"){

window.location.href="index.html";

}

let writers=[];

async function loadWriters(){

const response=
await fetch(`${API}/api/admin/writers`);

writers=
await response.json();

renderWriters(writers);

}

function renderWriters(list){

const table=
document.getElementById("writersTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=
"<div class='loading'>No writers found</div>";

return;

}

list.forEach(writer=>{

table.innerHTML+=`

<div class="writer-row">

<div class="writer-info">

<div class="writer-avatar">

${writer.name.charAt(0).toUpperCase()}

</div>

<div>

<div class="writer-name">

${writer.name}

</div>

<div class="writer-email">

${writer.email}

</div>

</div>

</div>

<div class="writer-stats">

📚 ${writer.novels} Novels

</div>

<div class="writer-actions">

<button
class="admin-btn"
onclick="viewWriter(${writer.id})">

View

</button>

<button
class="admin-btn delete-btn"
onclick="removeWriter(${writer.id})">

Remove

</button>

</div>

</div>

`;

});

}

function viewWriter(id){

window.location.href=
`writer-profile.html?id=${id}`;

}

async function removeWriter(id){

if(!confirm("Remove writer role?"))
return;

await fetch(

`${API}/api/admin/writers/${id}`,

{

method:"DELETE"

}

);

loadWriters();

}

document.getElementById("searchWriter")
.addEventListener("input",function(){

const q=
this.value.toLowerCase();

renderWriters(

writers.filter(w=>

w.name.toLowerCase().includes(q)

||

w.email.toLowerCase().includes(q)

)

);

});

const logoutBtn=
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");

window.location.href=
"admin-login.html";

};

}

loadWriters();