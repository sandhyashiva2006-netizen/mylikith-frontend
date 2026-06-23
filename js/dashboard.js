const dashboardUser =
JSON.parse(
localStorage.getItem("user")
);

if(dashboardUser){

document.getElementById(
"userName"
).textContent =
dashboardUser.name;

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

