const API="https://mylikith-backend.onrender.com";


loadApplications();

async function loadApplications(){

const response=await adminFetch(
`${API}/api/admin/writer-applications`
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

const status=app.status.toLowerCase();

table.innerHTML+=`

<tr>

<td><strong>${app.name}</strong></td>

<td style="font-size:14px;color:#bbb;">${app.email}</td>

<td>${app.pen_name}</td>

<td>

<span class="status ${app.status.toLowerCase()}">

${app.status.charAt(0).toUpperCase()+app.status.slice(1)}

</span>

</td>

<td>${new Date(app.created_at).toLocaleDateString()}</td>

<td>

${status==="pending"

?`

<div class="action-buttons">

<button
class="approve-btn"
onclick="approve(${app.id})">

✅ Approve

</button>

<button
class="reject-btn"
onclick="reject(${app.id})">

❌ Reject

</button>

</div>
`

:"-"}

</td>

</tr>

`;

});

}

async function approve(id){

if(!confirm("Approve this writer?")) return;

await adminFetch(
`${API}/api/admin/writer-applications/${id}/approve`,
{
method:"PUT"
}
);

loadApplications();

}

async function reject(id){

if(!confirm("Reject this application?")) return;

await adminFetch(
`${API}/api/admin/writer-applications/${id}/reject`,
{
method:"PUT"
}
);

loadApplications();

}