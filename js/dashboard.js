const user =
JSON.parse(
localStorage.getItem("user")
);

if(user){

document.getElementById(
"userName"
).textContent =
user.name;

}

const logoutBtn =
document.getElementById(
"logoutBtn"
);

if(logoutBtn){

logoutBtn.addEventListener(
"click",
() => {

localStorage.removeItem(
"token"
);

localStorage.removeItem(
"user"
);

window.location =
"login.html";

}
);

}

