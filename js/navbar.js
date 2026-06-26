const navbarUser =
JSON.parse(
localStorage.getItem("user")
);

const navbar =
document.getElementById("navbar");

if(navbar){

let html = `

<div class="logo">

<a href="${
navbarUser
?
'reader-dashboard.html'
:
'index.html'
}">

✨ MYLIKITH

</a>

</div>

<ul class="nav-links">

`;

if(navbarUser){

html += `

<li>

<a href="reader-dashboard.html">

Home

</a>

</li>

<li>

<a href="explore.html">

Explore

</a>

</li>

<li>

<a href="library.html">

Library

</a>

</li>

<li>

<a href="writer-dashboard.html">

Writer Studio

</a>

</li>

<li>

<a href="reader-profile.html">

Profile

</a>

</li>

`;

}else{

html += `

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

<li>

<a href="login.html">

Login

</a>

</li>

<li>

<a href="signup.html">

Sign Up

</a>

</li>

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

}

html += `

</div>

`;

navbar.innerHTML = html;

const logoutBtn =
document.getElementById(
"logoutBtn"
);

if(logoutBtn){

logoutBtn.onclick = ()=>{

localStorage.removeItem("token");

localStorage.removeItem("user");

window.location =
"login.html";

};

}

}