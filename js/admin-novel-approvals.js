const API="https://mylikith-backend.onrender.com";

loadNovels();

/* ==========================================
   LOAD NOVELS
========================================== */

async function loadNovels(){

try{

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

No pending novels found.

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

<div class="action-buttons">

<button
class="approve-btn"
onclick="approveNovel(${novel.id})">

✅ Approve

</button>

<button
class="reject-btn"
onclick="rejectNovel(${novel.id})">

❌ Reject

</button>

</div>

</td>

</tr>

`;

});

}catch(err){

console.log(err);

}

}

/* ==========================================
   APPROVE
========================================== */

async function approveNovel(id){

if(!confirm("Approve this novel?")){

return;

}

const response=await adminFetch(

`${API}/api/admin/novel-approvals/${id}/approve`,

{

method:"PUT"

}

);

const data=await response.json();

if(data.success){

alert(data.message);

loadNovels();

}else{

alert(data.message||"Unable to approve.");

}

}

/* ==========================================
   REJECT
========================================== */

async function rejectNovel(id){

if(!confirm("Reject this novel?")){

return;

}

const response=await adminFetch(

`${API}/api/admin/novel-approvals/${id}/reject`,

{

method:"PUT"

}

);

const data=await response.json();

if(data.success){

alert("Novel rejected.");

loadNovels();

}else{

alert("Unable to reject.");

}

}