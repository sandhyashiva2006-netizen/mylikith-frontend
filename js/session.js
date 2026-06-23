const user =
JSON.parse(
localStorage.getItem("user")
);

const authButtons =
document.querySelector(
".auth-buttons"
);

if(user && authButtons){

authButtons.innerHTML = `

<a href="writer-dashboard.html">

<button class="login-btn">

Dashboard

</button>

</a>

<span class="user-name">

👤 ${user.name}

</span>

<button
class="signup-btn"
onclick="logout()">

Logout

</button>

`;

}

function logout(){

localStorage.removeItem(
"user"
);

window.location =
"index.html";

}