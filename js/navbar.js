const navbarUser =
JSON.parse(
localStorage.getItem("user")
);

const navbar =
document.getElementById("navbar");

if(navbar){

let html = `

<div class="logo">

<a href="index.html">

✨ MYLIKITH

</a>

</div>

<ul class="nav-links">

<li><a href="index.html">Home</a></li>

<li><a href="explore.html">Explore</a></li>
<li>

<a href="library.html">

Library

</a>

</li>

`;

if(navbarUser){

html += `

<li><a href="reader-dashboard.html">Home</a></li>

<li><a href="reader-profile.html">Profile</a></li>

<li><a href="writer-dashboard.html">Writer</a></li>

`;

}

html += `

</ul>

<div class="auth-buttons">

`;

if(navbarUser){

html += `

<span class="welcome">

👋 ${navbarUser.name}

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

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick = ()=>{

localStorage.removeItem("token");
localStorage.removeItem("user");

window.location = "login.html";

};

}

}