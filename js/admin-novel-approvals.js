const API="https://mylikith-backend.onrender.com";

loadNovels();

async function loadNovels(){

const response=await adminFetch(

`${API}/api/admin/novel-approvals`

);

const novels=await response.json();

const table=document.getElementById("novelApprovalTable");

table.innerHTML="";

if(!novels.length){

table.innerHTML=`

<tr>

<td colspan="6">

No pending novels.

</td>

</tr>

`;

return;

}

novels.forEach(novel=>{

table.innerHTML+=`

<tr>

<td>

<strong>${novel.title}</strong>

</td>

<td>

${novel.name}

</td>

<td>

${novel.language}

</td>

<td>

${novel.category}

</td>

<td>

${new Date(novel.created_at).toLocaleDateString()}

</td>

<td>

<button

class="approve-btn"

onclick="approveNovel(${novel.id})">

Approve

</button>

<button

class="reject-btn"

onclick="rejectNovel(${novel.id})">

Reject

</button>

</td>

</tr>

`;

});

}

async function approveNovel(id){

if(!confirm("Approve this novel?")) return;

await adminFetch(

`${API}/api/admin/novel-approvals/${id}/approve`,

{

method:"PUT"

}

);

loadNovels();

}

async function rejectNovel(id){

if(!confirm("Reject this novel?")) return;

await adminFetch(

`${API}/api/admin/novel-approvals/${id}/reject`,

{

method:"PUT"

}

);

loadNovels();

}