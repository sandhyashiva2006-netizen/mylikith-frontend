const admin=
JSON.parse(localStorage.getItem("user"));

if(!admin){

location.href="admin-login.html";

}

if(admin.role!=="admin"){

location.href="index.html";

}

const API="https://mylikith-backend.onrender.com";

async function loadRevenue(){

const response=

await adminFetch(

`${API}/api/admin/revenue`

);

const data=

await response.json();

document.getElementById("totalRevenue").textContent=

`₹${data.totalRevenue}`;

document.getElementById("writerPayouts").textContent=

`₹${data.writerPayouts}`;

document.getElementById("platformRevenue").textContent=

`₹${data.platformRevenue}`;

document.getElementById("pendingWithdrawals").textContent=

`₹${data.pendingWithdrawals}`;

document.getElementById("writerShare").textContent =
`${data.writerShare}%`;

document.getElementById("platformShare").textContent =
`${data.platformShare}%`;

}

loadRevenue();

const logoutBtn=
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");
localStorage.removeItem("token");

location.href="admin-login.html";

};

}