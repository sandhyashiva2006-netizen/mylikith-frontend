const admin=
JSON.parse(localStorage.getItem("user"));

if(!admin){

location.href="admin-login.html";

}

if(admin.role!=="admin"){

location.href="index.html";

}

const API="https://mylikith-backend.onrender.com";

async function loadAnalytics(){

const response=

await fetch(

`${API}/api/admin/analytics`

);

const data=

await response.json();

reads.textContent=data.reads;

rating.textContent=data.rating;

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

location.href="admin-login.html";

};

}