const API =
"https://mylikith-backend.onrender.com";

async function register(){

const name =
document.getElementById("name").value;

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const response =
await fetch(

`${API}/api/auth/register`,

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name,

email,

password,

referral_code:
(document.getElementById("referralCode")?.value || "").trim()

})

}

);



const data =
await response.json();

if(data.success){

alert("Registration Successful");

window.location =
"login.html";

}else{

alert("Registration Failed");

}

}

async function login(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const response =
await fetch(

`${API}/api/auth/login`,

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

}

);

const data =
await response.json();

if(data.success){

localStorage.setItem(
"token",
data.token
);

localStorage.setItem(
"user",
JSON.stringify(data.user)
);

alert("Login Successful");

window.location =
"reader-dashboard.html";

}else{

alert(
data.message
);

}

}

const params=new URLSearchParams(window.location.search);

const ref=params.get("ref");

if(ref){

const input=document.getElementById("referralCode");

if(input){

input.value=ref;

}

}

/* ==========================================
   FORGOT PASSWORD
========================================== */

async function forgotPassword(){

const email =
document.getElementById("email").value.trim();

if(!email){

alert("Please enter your email.");

return;

}

try{

const response =
await fetch(

`${API}/api/auth/forgot-password`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email

})

}

);

const data =
await response.json();

alert(data.message);

window.location =
"login.html";

}catch(err){

alert("Unable to send reset email.");

}

}


/* ==========================================
   RESET PASSWORD
========================================== */

async function resetPassword(){

const params =
new URLSearchParams(window.location.search);

const token =
params.get("token");

const password =
document.getElementById("password").value;

if(!password){

alert("Please enter a password.");

return;

}

try{

const response =
await fetch(

`${API}/api/auth/reset-password`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

token,

password

})

}

);

const data =
await response.json();

alert(data.message);

if(data.success){

window.location =
"login.html";

}

}catch(err){

alert("Unable to reset password.");

}

}