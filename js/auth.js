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
password
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
"writer-dashboard.html";

}else{

alert(
data.message
);

}

}