const API = "https://mylikith-backend.onrender.com/api";

let withdrawals = [];

document.addEventListener("DOMContentLoaded", () => {

    loadWithdrawals();

    document
    .getElementById("searchWriter")
    .addEventListener("input", filterTable);

    document
    .getElementById("statusFilter")
    .addEventListener("change", filterTable);

});

/* ======================================
   LOAD WITHDRAWALS
====================================== */

async function loadWithdrawals(){

try{

const response=
await fetch(

`${API}/admin/withdrawals`

);

withdrawals=
await response.json();

renderTable(withdrawals);

updateSummary(withdrawals);

}
catch(err){

console.log(err);

}

}

/* ======================================
   SUMMARY
====================================== */

function updateSummary(data){

let pendingCount=0;
let approvedCount=0;
let rejectedCount=0;
let completedCount=0;

let pendingAmount=0;
let approvedAmount=0;
let rejectedAmount=0;
let completedAmount=0;

data.forEach(item=>{

const amount=Number(item.amount);

switch(item.status){

case "Pending":

pendingCount++;
pendingAmount+=amount;

break;

case "Approved":

approvedCount++;
approvedAmount+=amount;

break;

case "Rejected":

rejectedCount++;
rejectedAmount+=amount;

break;

case "Completed":

completedCount++;
completedAmount+=amount;

break;

}

});

document.getElementById("pendingCount").innerText=
pendingCount;

document.getElementById("approvedCount").innerText=
approvedCount;

document.getElementById("rejectedCount").innerText=
rejectedCount;

document.getElementById("completedCount").innerText=
completedCount;

document.getElementById("pendingAmount").innerText=
"₹"+pendingAmount.toFixed(2);

document.getElementById("approvedAmount").innerText=
"₹"+approvedAmount.toFixed(2);

document.getElementById("rejectedAmount").innerText=
"₹"+rejectedAmount.toFixed(2);

document.getElementById("completedAmount").innerText=
"₹"+completedAmount.toFixed(2);

}

/* ======================================
   TABLE
====================================== */

function renderTable(data){

const table=
document.getElementById("withdrawTable");

table.innerHTML="";

if(data.length===0){

table.innerHTML=`

<tr>

<td colspan="7">

No Withdrawal Requests

</td>

</tr>

`;

return;

}

data.forEach(item=>{

table.innerHTML+=`

<tr>

<td>

${item.id}

</td>

<td>

${item.writer_name}

</td>

<td>

₹${Number(item.amount).toFixed(2)}

</td>

<td>

${item.payment_method}

</td>

<td>

<span class="status ${item.status.toLowerCase()}">

${item.status}

</span>

</td>

<td>

${new Date(item.requested_at).toLocaleDateString()}

</td>

<td>

<div class="action-buttons">

<button

class="approve-btn"

onclick="approveWithdrawal(${item.id})"

>

Approve

</button>

<button

class="reject-btn"

onclick="rejectWithdrawal(${item.id})"

>

Reject

</button>

<button

onclick="showDetails(${item.id})"

>

View

</button>

</div>

</td>

</tr>

`;

});

}

/* ======================================
   SEARCH + FILTER
====================================== */

function filterTable(){

const search=

document
.getElementById("searchWriter")
.value
.toLowerCase();

const status=

document
.getElementById("statusFilter")
.value;

const filtered=

withdrawals.filter(item=>{

const matchesSearch=

item.writer_name
.toLowerCase()
.includes(search);

const matchesStatus=

status==="All"

||

item.status===status;

return

matchesSearch

&&

matchesStatus;

});

renderTable(filtered);

}

/* ======================================
   DETAILS
====================================== */

function showDetails(id){

const item=

withdrawals.find(

w=>w.id===id

);

document
.getElementById("paymentDetails")
.innerHTML=`

<b>Writer</b>

<br>

${item.writer_name}

<br><br>

<b>Method</b>

<br>

${item.payment_method}

<br><br>

<b>UPI</b>

<br>

${item.upi_id || "-"}

<br><br>

<b>Account Holder</b>

<br>

${item.account_name || "-"}

<br><br>

<b>Bank</b>

<br>

${item.bank_name || "-"}

<br><br>

<b>Account Number</b>

<br>

${item.account_number || "-"}

<br><br>

<b>IFSC</b>

<br>

${item.ifsc_code || "-"}

`;

}

/* ======================================
   APPROVE
====================================== */

async function approveWithdrawal(id){

if(

!confirm(

"Approve this withdrawal?"

)

){

return;

}

const response=

await fetch(

`${API}/admin/withdrawals/${id}/approve`,

{

method:"PUT"

}

);

const data=

await response.json();

alert(data.message);

loadWithdrawals();

}

/* ======================================
   REJECT
====================================== */

async function rejectWithdrawal(id){

const remarks=

prompt(

"Reason for rejection?"

);

if(remarks===null){

return;

}

const response=

await fetch(

`${API}/admin/withdrawals/${id}/reject`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

remarks

})

}

);

const data=

await response.json();

alert(data.message);

loadWithdrawals();

}