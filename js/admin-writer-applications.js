const API="https://mylikith-backend.onrender.com";

const token=localStorage.getItem("token");

const user=JSON.parse(localStorage.getItem("user"));

if(!token || !user){

location.href="admin-login.html";

}

if(user.role!=="admin"){

alert("Unauthorized");

location.href="login.html";

}

loadApplications();

async function loadApplications(){

const response=await fetch(

`${API}/api/admin/writer-applications`,

{

headers:{
Authorization:`Bearer ${token}`
}

}

);

const data=await response.json();

const table=document.getElementById("applicationTable");

table.innerHTML="";

if(data.length===0){

table.innerHTML=`

<tr>

<td colspan="6">

No writer applications found.

</td>

</tr>

`;

return;

}

data.forEach(app=>{

table.innerHTML+=`

<tr>

<td>${app.name}</td>

<td>${app.email}</td>

<td>${app.pen_name}</td>

<td>

<span class="status ${app.status.toLowerCase()}">

${app.status}

</span>

</td>

<td>${new Date(app.created_at).toLocaleDateString()}</td>

<td>

${app.status==="Pending"

?`

<button
class="approve-btn"
onclick="approve(${app.id})">

Approve

</button>

<button
class="reject-btn"
onclick="reject(${app.id})">

Reject

</button>

`

:"-"}

</td>

</tr>

`;

});

}

async function approve(id){

if(!confirm("Approve this writer?")) return;

await fetch(

`${API}/api/admin/writer-applications/${id}/approve`,

{

method:"PUT",

headers:{
Authorization:`Bearer ${token}`
}

}

);

loadApplications();

}

async function reject(id){

if(!confirm("Reject this application?")) return;

await fetch(

`${API}/api/admin/writer-applications/${id}/reject`,

{

method:"PUT",

headers:{
Authorization:`Bearer ${token}`
}

}

);

loadApplications();

}