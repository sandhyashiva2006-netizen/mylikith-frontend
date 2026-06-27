const API="https://mylikith-backend.onrender.com";

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

loadSettings();