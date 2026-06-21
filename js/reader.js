let fontSize = 24;

const chapterContent =
document.getElementById("chapterContent");

document
.getElementById("increaseFont")
.addEventListener("click", () => {

fontSize += 2;

chapterContent.style.fontSize =
fontSize + "px";

});

document
.getElementById("decreaseFont")
.addEventListener("click", () => {

fontSize -= 2;

chapterContent.style.fontSize =
fontSize + "px";

});

document
.getElementById("darkBtn")
.addEventListener("click", () => {

document.body.style.background =
"#0B1120";

document.body.style.color =
"white";

});

document
.getElementById("lightBtn")
.addEventListener("click", () => {

document.body.style.background =
"#ffffff";

document.body.style.color =
"#111827";

});

window.addEventListener("scroll", () => {

let winScroll =
document.body.scrollTop ||
document.documentElement.scrollTop;

let height =
document.documentElement.scrollHeight -
document.documentElement.clientHeight;

let scrolled =
(winScroll / height) * 100;

document.getElementById(
"progressBar"
).style.width =
scrolled + "%";

});

document
.getElementById("bookmarkBtn")
.addEventListener("click", () => {

alert("Bookmark saved");

});

document
.getElementById("translateBtn")
.addEventListener("click", () => {

alert(
"Translation feature coming soon"
);

});