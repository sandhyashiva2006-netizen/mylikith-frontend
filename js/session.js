const currentUser =
JSON.parse(
localStorage.getItem("user")
);

const authButtons =
document.querySelector(
".auth-buttons"
);

if(currentUser && authButtons){

authButtons.innerHTML = `

<a href="reader-dashboard.html">

<button class="login-btn">

Dashboard

</button>

</a>

<span class="user-name">

👤 ${currentUser.name}

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
"token"
);

localStorage.removeItem(
"user"
);

window.location.href =
"index.html";

}