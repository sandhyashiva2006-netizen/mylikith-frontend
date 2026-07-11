const footer = document.getElementById("footer");

if (footer) {

footer.innerHTML = `

<footer class="site-footer">

<div class="footer-container">

<div class="footer-brand">

<h2>✨ MYLIKITH</h2>

<p class="tagline">

Stories Live Forever

</p>

<p class="footer-desc">

Discover thousands of novels, support talented writers,
and enjoy stories in every language.

</p>

</div>

<div class="footer-links">

<h3>📚 Explore</h3>

<a href="index.html">Home</a>

<a href="explore.html">Explore</a>

<a href="explore.html">Categories</a>

<a href="explore.html?sort=rating">Top Rated</a>

<a href="library.html">Library</a>

</div>

<div class="footer-links">

<h3>✍ Writers</h3>

<a href="writer-dashboard.html">Dashboard</a>

<a href="writer-studio.html">Writer Studio</a>

<a href="create-novel.html">Create Novel</a>

<a href="page.html?slug=writer-agreement">Writer Agreement</a>

<a href="page.html?slug=help">Writer Help</a>

</div>

<div class="footer-links">

<h3>⚙ Support</h3>

<a href="page.html?slug=about">About Us</a>

<a href="page.html?slug=contact">Contact Us</a>

<a href="page.html?slug=help">Help Centre</a>

<a href="page.html?slug=privacy">Privacy Policy</a>

<a href="page.html?slug=terms">Terms & Conditions</a>

<a href="page.html?slug=cookies">Cookies Policy</a>

<a href="page.html?slug=dmca">DMCA Policy</a>

<a href="page.html?slug=writer-agreement">Writer Agreement</a>

<a href="page.html?slug=community-guidelines">Community Guidelines</a>

<a href="page.html?slug=copyright">Copyright Policy</a>

<a href="page.html?slug=refund-policy">Refund Policy</a>

</div>

</div>

<div class="footer-social">

<a href="https://facebook.com/MyLikith" target="_blank">📘</a>

<a href="https://instagram.com/MyLikith" target="_blank">📷</a>

<a href="https://x.com/MyLikith" target="_blank">𝕏</a>

<a href="https://linkedin.com/company/mylikith" target="_blank">💼</a>

</div>

<div class="footer-bottom">

<p>

© 2026 MyLikith • Made with ❤️ in India

</p>

<p>

Version 1.0.0

</p>

</div>

</footer>

`;

}

if(!document.getElementById("scrollTopBtn")){

document.body.insertAdjacentHTML(

"beforeend",

`
<button
id="scrollTopBtn"
class="scroll-top-btn"
aria-label="Scroll to top">

⬆

</button>

`

);

}

/* ===============================
   Scroll To Top
=============================== */

const scrollBtn = document.getElementById("scrollTopBtn");

if(scrollBtn){

window.onscroll = () => {

if(window.scrollY>300){

scrollBtn.classList.add("show");

}else{

scrollBtn.classList.remove("show");

}

};

scrollBtn.onclick = () => {

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}
