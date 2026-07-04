const admin=
JSON.parse(localStorage.getItem("user"));

if(!admin){

location.href="admin-login.html";

}

if(admin.role!=="admin"){

location.href="index.html";

}

const API="https://mylikith-backend.onrender.com";

const users = document.getElementById("users");
const writers = document.getElementById("writers");
const novels = document.getElementById("novels");
const chapters = document.getElementById("chapters");
const reads = document.getElementById("reads");
const coinSales = document.getElementById("coinSales");
const coinsSpent = document.getElementById("coinsSpent");
const pendingWithdrawals = document.getElementById("pendingWithdrawals");
const topNovel = document.getElementById("topNovel");
const topWriter = document.getElementById("topWriter");

async function loadAnalytics(){

const response=

await adminFetch(

`${API}/api/admin/analytics`

);

const data=

await response.json();

users.textContent=data.users;

writers.textContent=data.writers;

novels.textContent=data.novels;

chapters.textContent=data.chapters;

reads.textContent=data.reads;

coinSales.textContent=`₹${data.coinSales}`;

coinsSpent.textContent=data.coinsSpent;

pendingWithdrawals.textContent=data.pendingWithdrawals;

topNovel.textContent=data.topNovel;

topWriter.textContent=data.topWriter;

const container=

document.getElementById(

"popularNovels"

);

container.innerHTML="";

data.popular.forEach(novel=>{

container.innerHTML+=`

<div class="analytics-row">

<div>

${novel.title}

</div>

<div>

👁 ${novel.views}

</div>

<div>

⭐ ${novel.rating}

</div>

</div>

`;

});

}

loadAnalytics();

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