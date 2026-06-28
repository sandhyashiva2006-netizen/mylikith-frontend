const API="https://mylikith-backend.onrender.com";

const admin=

JSON.parse(localStorage.getItem("user"));

if(!admin){

window.location.href="admin-login.html";

}

if(admin.role!=="admin"){

window.location.href="index.html";

}

async function loadSettings(){

const response=

await fetch(

`${API}/api/admin/settings`

);

const data=

await response.json();

siteName.value=
data.site_name;

announcement.value=
data.announcement||"";

maintenance.value=
String(data.maintenance);

}

saveSettings.onclick=

async()=>{

await fetch(

`${API}/api/admin/settings`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

site_name:siteName.value,

announcement:announcement.value,

maintenance:

maintenance.value==="true"

})

}

);

alert("Saved");

};

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");

window.location.href="admin-login.html";

};

}

loadSettings();