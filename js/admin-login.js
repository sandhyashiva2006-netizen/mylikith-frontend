const API="https://mylikith-backend.onrender.com";

document.getElementById("loginBtn").onclick=login;

async function login(){

const email=
document.getElementById("email").value;

const password=
document.getElementById("password").value;

const response=
await fetch(`${API}/api/login`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

});

const data=
await response.json();

if(!data.success){

document.getElementById("loginError").textContent=
"Invalid credentials";

return;

}

if(data.user.role!=="admin"){

document.getElementById("loginError").textContent=
"You are not an administrator.";

return;

}

localStorage.setItem(

"user",

JSON.stringify(data.user)

);

window.location.href=
"admin-dashboard.html";

}