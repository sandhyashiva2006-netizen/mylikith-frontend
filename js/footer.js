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

<a href="page.html?slug=community-guidelines">Community Guidelines</a>

<a href="page.html?slug=copyright">Copyright Policy</a>

<a href="page.html?slug=refund-policy">Refund Policy</a>

</div>

</div>

<div class="footer-social">

<a href="https://facebook.com/MyLikith" target="_blank" aria-label="Facebook">

<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M22 12A10 10 0 1 0 10.44 21.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/>
</svg>

</a>

<a href="https://instagram.com/MyLikith" target="_blank" aria-label="Instagram">

<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm6.5-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
</svg>

</a>

<a href="https://x.com/MyLikith" target="_blank" aria-label="X">

<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-5-6.5L5.9 22H2.8l7.3-8.3L1 2h6.4l4.5 5.9L18.9 2zm-1.1 18h1.7L6.1 3.9H4.3L17.8 20z"/>
</svg>

</a>

<a href="https://linkedin.com/company/mylikith" target="_blank" aria-label="LinkedIn">

<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96zM3 9h4v12H3V9zm7 0h3.83v1.71h.05c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.3c0-1.26-.02-2.88-1.75-2.88-1.76 0-2.03 1.37-2.03 2.79V21h-4V9z"/>
</svg>

</a>

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
