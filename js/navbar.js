const API = "https://mylikith-backend.onrender.com";

const navbarUser = JSON.parse(localStorage.getItem("user"));

const navbar = document.getElementById("navbar");

if (navbar) {

let html = `

<div class="logo">

<a href="${navbarUser ? "reader-dashboard.html" : "index.html"}">

<img
src="assets/images/logo.png"
class="logo-img"
alt="MyLikith">

</a>

<span>MyLikith</span>

</div>

<button
class="menu-toggle"
id="menuToggle">

☰

</button>

<ul class="nav-links">

`;

/* =====================================
   Navigation
===================================== */

if (!navbarUser) {

html += `

<li>
<a href="index.html">Home</a>
</li>

<li>
<a href="explore.html">Explore</a>
</li>

<li>
<a href="languages.html">Languages</a>
</li>

<li>
<a href="premium.html">Premium</a>
</li>

<li>
<a href="contest.html">🏆 Contests</a>
</li>
`;

} else {

/* Reader */

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
    <a href="contest.html">
        🏆 Contests
    </a>
</li>

<li>
<a href="library.html">
Library
</a>
</li>

`;

/* Writer */

if (navbarUser.role === "writer") {

html += `

<li>
<a href="writer-dashboard.html">
Writer Dashboard
</a>
</li>

`;

}

/* Admin */

if (navbarUser.role === "admin") {

html += `

<li>
<a href="admin.html">
Admin
</a>
</li>

`;

}

html += `

<li>
<a href="wallet.html">
Wallet
</a>
</li>

<li>
<a href="reader-profile.html">
Profile
</a>
</li>

`;

}

/* =====================================
   Mobile Authentication
===================================== */

html += `

<li class="mobile-auth mobile-divider"></li>

`;

if (navbarUser) {

html += `

<li class="mobile-auth">

<span class="welcome">

👋 ${navbarUser.name}

</span>

</li>

<li class="mobile-auth">

<button
id="logoutBtn"
class="login-btn">

Logout

</button>

</li>

`;

} else {

html += `

<li class="mobile-auth">

<a href="login.html">

<button class="login-btn">

Login

</button>

</a>

</li>

<li class="mobile-auth">

<a href="signup.html">

<button class="signup-btn">

Sign Up

</button>

</a>

</li>

`;

}

/* =====================================
   Close Navigation
===================================== */

html += `

</ul>

<div class="auth-buttons">

`;

/* =====================================
   Desktop Authentication
===================================== */

if (navbarUser) {

html += `

<div class="navbar-user">

<img
id="navbarAvatar"
class="navbar-avatar"
src="${navbarUser.profile_image || "assets/images/default-avatar.png"}"
alt="Profile">

<span class="welcome">

👋 ${navbarUser.name}

</span>

<button
id="logoutBtnDesktop"
class="login-btn">

Logout

</button>

</div>

`;

} else {

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

/* =====================================
   Mobile Menu Toggle
===================================== */

const menuToggle =
document.getElementById("menuToggle");

if(menuToggle){

menuToggle.onclick=()=>{

const navLinks=
document.querySelector(".nav-links");

if(!navLinks) return;

navLinks.classList.toggle("active");

menuToggle.textContent=

navLinks.classList.contains("active")

? "✕"

: "☰";

};

}

/* =====================================
   Logout
===================================== */

["logoutBtn","logoutBtnDesktop"].forEach(id=>{

const btn=document.getElementById(id);

if(btn){

btn.onclick=()=>{

localStorage.removeItem("token");
localStorage.removeItem("user");

window.location="login.html";

};

}

});

}

/* =====================================
   Premium Badge
===================================== */

async function loadPremiumBadge(){

if(!navbarUser) return;

try{

const res=await fetch(

`${API}/api/premium/status/${navbarUser.id}`

);

const data=await res.json();

if(!data.premium) return;

const profile=document.querySelector(

'a[href="reader-profile.html"]'

);

if(profile){

profile.innerHTML="👑 Profile";

}

}catch(err){

console.log(err);

}

}

/* =====================================
   Notification Count
===================================== */

async function loadNotificationCount(){

if(!navbarUser) return;

try{

const response=await fetch(

`${API}/api/writers/notifications/${navbarUser.id}/unread`

);

const data=await response.json();

const badge=document.getElementById("notificationCount");

if(!badge) return;

badge.innerHTML=data.unread;

badge.style.display=

data.unread>0

? "flex"

: "none";

}catch(err){

console.log(err);

}

}

/* =====================================
   Mobile UX Improvements
===================================== */

document.querySelectorAll(".nav-links a").forEach(link=>{

link.addEventListener("click",()=>{

const navLinks=document.querySelector(".nav-links");
const menuToggle=document.getElementById("menuToggle");

if(navLinks){

navLinks.classList.remove("active");

}

if(menuToggle){

menuToggle.textContent="☰";

}

});

});

/* =====================================
   Active Navigation Link
===================================== */

const currentPage=
window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link=>{

const href=link.getAttribute("href");

if(href===currentPage){

link.classList.add("active");

}

});

/* =====================================
   Initialize
===================================== */

loadPremiumBadge();
loadNotificationCount();

window.addEventListener("profileUpdated",()=>{

const updatedUser=
JSON.parse(localStorage.getItem("user"));

const avatar=
document.getElementById("navbarAvatar");

if(avatar && updatedUser?.profile_image){

avatar.src=updatedUser.profile_image;

}

});
