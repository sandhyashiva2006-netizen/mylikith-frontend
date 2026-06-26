const user =
JSON.parse(
localStorage.getItem("user")
);

const navbar =
document.getElementById(
"navbar"
);

if(navbar){

let html = `

<div class="logo">

<a href="index.html">

✨ MYLIKITH

</a>

</div>

<ul class="nav-links">

<li>
<a href="index.html">
Home
</a>
</li>

<li>
<a href="explore.html">
Explore
</a>
</li>

`;

if(user){

html += `

<li>

<a href="reader-dashboard.html">

Dashboard

</a>

</li>

<li>

<a href="reader-profile.html">

Profile

</a>

</li>

`;

if(user.role==="writer"){

html += `

<li>

<a href="writer-dashboard.html">

Writer

</a>

</li>

`;

}

}

html += `

</ul>

<div class="auth-buttons">

`;

if(user){

html += `

<span class="welcome">

👋 ${user.name}

</span>

<button
id="logoutBtn"
class="login-btn">

Logout

</button>

`;

}else{

html += `

<a href="login.html">

<button class="login-btn">

Login

</button>

</a>

<a href="signup.html">

<button class="signup-btn">

Sign Up

</button>

</a>

`;

}

html += `

</div>

`;

navbar.innerHTML = html;

const logout =
document.getElementById(
"logoutBtn"
);

if(logout){

logout.onclick=()=>{

localStorage.removeItem(
"user"
);

localStorage.removeItem(
"token"
);

window.location=
"login.html";

};

}

}