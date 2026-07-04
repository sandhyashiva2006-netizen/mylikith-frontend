const API="https://mylikith-backend.onrender.com";

const token=localStorage.getItem("adminToken");

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

data.forEach(app=>{

table.innerHTML+=`

<tr>

<td>${app.name}</td>

<td>${app.email}</td>

<td>${app.pen_name}</td>

<td>${app.status}</td>

<td>${new Date(app.created_at).toLocaleDateString()}</td>

<td>

<button onclick="approve(${app.id})">

Approve

</button>

<button onclick="reject(${app.id})">

Reject

</button>

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