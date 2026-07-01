const API = "https://mylikith-backend.onrender.com/api";

const writerUser = JSON.parse(localStorage.getItem("user"));

if (!writerUser) {
    location.href = "login.html";
}

const writerId = writerUser.id;

document.addEventListener("DOMContentLoaded", () => {

    togglePaymentFields();

    loadSummary();

    loadEarnings();

    loadPaymentDetails();

    loadWithdrawalHistory();

});

document.getElementById("paymentMethod")
.addEventListener("change", togglePaymentFields);

document.getElementById("savePaymentBtn")
.addEventListener("click", savePaymentDetails);

document.getElementById("withdrawBtn")
.addEventListener("click", submitWithdrawal);

function togglePaymentFields(){

    const method =
    document.getElementById("paymentMethod").value;

    document.getElementById("upiSection").style.display =
    method==="UPI" ? "block" : "none";

    document.getElementById("bankSection").style.display =
    method==="BANK" ? "block" : "none";

}

/* ===================================
   SUMMARY
=================================== */

async function loadSummary(){

try{

const response =
await fetch(

`${API}/writers/earnings/${writerId}`

);

const data =
await response.json();

document.getElementById("totalEarnings").innerText =
"₹"+Number(data.summary.amount||0).toFixed(2);

document.getElementById("withdrawable").innerText =
"₹"+Number(data.summary.withdrawable||0).toFixed(2);

document.getElementById("pendingAmount").innerText =
"₹"+Number(data.summary.pending||0).toFixed(2);

document.getElementById("paidAmount").innerText =
"₹"+Number(data.summary.paid||0).toFixed(2);

}catch(err){

console.log(err);

}

}

/* ===================================
   EARNINGS TABLE
=================================== */

async function loadEarnings(){

try{

const response =
await fetch(

`${API}/writers/earnings/${writerId}`

);

const data =
await response.json();

const table =
document.getElementById("earningsTable");

table.innerHTML = "";

if(data.history.length===0){

table.innerHTML=`
<tr>
<td colspan="6">
No Earnings Yet
</td>
</tr>
`;

return;

}

data.history.forEach(item=>{

table.innerHTML += `

<tr>

<td>${item.name}</td>

<td>${item.novel}</td>

<td>

Chapter ${item.chapter_no}

</td>

<td>

${item.coins}

</td>

<td>

₹${item.amount}

</td>

<td>

${new Date(item.created_at).toLocaleDateString()}

</td>

</tr>

`;

});

}catch(err){

console.log(err);

}

}

/* ===================================
   PAYMENT DETAILS
=================================== */

async function loadPaymentDetails(){

try{

const response =
await fetch(

`${API}/writers/payment-details/${writerId}`

);

const data =
await response.json();

if(!data.success){

return;

}

const details =
data.details;

document.getElementById("paymentMethod").value =
details.payment_method || "UPI";

document.getElementById("upiId").value =
details.upi_id || "";

document.getElementById("accountName").value =
details.account_name || "";

document.getElementById("bankName").value =
details.bank_name || "";

document.getElementById("accountNumber").value =
details.account_number || "";

document.getElementById("ifscCode").value =
details.ifsc_code || "";

togglePaymentFields();

}catch(err){

console.log(err);

}

}

async function savePaymentDetails(){

try{

const body={

writer_id:writerId,

payment_method:

document.getElementById("paymentMethod").value,

upi_id:

document.getElementById("upiId").value,

account_name:

document.getElementById("accountName").value,

bank_name:

document.getElementById("bankName").value,

account_number:

document.getElementById("accountNumber").value,

ifsc_code:

document.getElementById("ifscCode").value

};

const response =
await fetch(

`${API}/writers/payment-details`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body)

}

);

const data =
await response.json();

alert(data.message);

}catch(err){

console.log(err);

}

}

/* ===================================
   WITHDRAW
=================================== */

async function submitWithdrawal(){

const amount =
Number(

document.getElementById("withdrawAmount").value

);

if(amount<=0){

alert("Enter withdrawal amount.");

return;

}

try{

const response =
await fetch(

`${API}/writers/withdraw`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

writer_id:writerId,

amount,

payment_method:
document.getElementById("paymentMethod").value,

upi_id:
document.getElementById("upiId").value,

account_name:
document.getElementById("accountName").value,

bank_name:
document.getElementById("bankName").value,

account_number:
document.getElementById("accountNumber").value,

ifsc_code:
document.getElementById("ifscCode").value

})

}

);

const data =
await response.json();

alert(data.message);

document.getElementById("withdrawAmount").value="";

loadSummary();

loadWithdrawalHistory();

}catch(err){

console.log(err);

}

}

/* ===================================
   WITHDRAW HISTORY
=================================== */

async function loadWithdrawalHistory(){

try{

const response =
await fetch(

`${API}/writers/withdraw-history/${writerId}`

);

const history =
await response.json();

const container =
document.getElementById("withdrawHistory");

container.innerHTML="";

if(history.length===0){

container.innerHTML="<p>No Withdrawal History</p>";

return;

}

history.forEach(item=>{

container.innerHTML += `

<div class="history-card">

<div class="history-left">

<h3>

₹${Number(item.amount).toFixed(2)}

</h3>

<p>

${new Date(item.requested_at).toLocaleDateString()}

</p>

</div>

<div class="history-right">

<div class="status ${item.status.toLowerCase()}">

${item.status}

</div>

</div>

</div>

`;

});

}catch(err){

console.log(err);

}
}