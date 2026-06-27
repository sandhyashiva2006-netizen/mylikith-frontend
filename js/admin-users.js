const API="https://mylikith-backend.onrender.com";

let users=[];

async function loadUsers(){

try{

const response=await fetch(
`${API}/api/admin/users`
);

users=await response.json();

renderUsers(users);

}catch(err){

console.error(err);

}

}

function renderUsers(data){

const container=
document.getElementById("usersTable");

container.innerHTML="";

if(data.length===0){

container.innerHTML=
"<div class='loading'>No users found</div>";

return;

}

data.forEach(user=>{

container.innerHTML+=`

<div class="user-row">

<div>

<strong>${user.name}</strong>

</div>

<div>

${user.email}

</div>

<div>

${user.role}

</div>

<div class="user-actions">

<button
class="admin-btn"
onclick="changeRole(${user.id},'writer')">

Writer

</button>

<button
class="admin-btn"
onclick="changeRole(${user.id},'admin')">

Admin

</button>

<button
class="admin-btn delete-btn"
onclick="deleteUser(${user.id})">

Delete

</button>

</div>

</div>

`;

});

}

document.getElementById("searchUser")
.addEventListener("input",function(){

const keyword=
this.value.toLowerCase();

renderUsers(

users.filter(user=>

user.name.toLowerCase().includes(keyword)

||

user.email.toLowerCase().includes(keyword)

)

);

});

async function changeRole(id,role){

if(!confirm(`Make this user ${role}?`))
return;

await fetch(

`${API}/api/admin/users/${id}/role`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

role

})

}

);

loadUsers();

}

async function deleteUser(id){

if(!confirm("Delete this user?"))
return;

await fetch(

`${API}/api/admin/users/${id}`,

{

method:"DELETE"

}

);

loadUsers();

}

loadUsers();