const currentUser =
JSON.parse(
localStorage.getItem("user")
);

const authButtons =
document.querySelector(
".auth-buttons"
);

if(currentUser && authButtons){

const isDashboardPage =
window.location.pathname.includes(
"dashboard"
);

authButtons.innerHTML = `

${!isDashboardPage ? `
<a href="reader-dashboard.html">
<button class="login-btn">
Dashboard
</button>
</a>
` : ""}

<span class="user-name">
👤 ${currentUser.name}
</span>

<a href="reader-profile.html">

<button class="login-btn">

Profile

</button>

</a>

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