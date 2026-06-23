let fontSize = 24;

const chapterContent =
document.getElementById("chapterContent");

document.body.classList.add("dark-mode");

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

document.body.classList.remove("light-mode");
document.body.classList.add("dark-mode");

});

document
.getElementById("lightBtn")
.addEventListener("click", () => {

document.body.classList.remove("dark-mode");
document.body.classList.add("light-mode");

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

const params =
new URLSearchParams(
window.location.search
);

const chapterId =
params.get("chapter");

async function loadChapter(){

try{

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/chapters/${chapterId}`

);

const chapter =
await response.json();

document.getElementById(
"chapterTitle"
).textContent =
chapter.title;

document.getElementById(
"chapterContent"
).innerHTML =
chapter.content.replace(
/\n/g,
"<br><br>"
);

}
catch(err){

console.error(err);

}

}

loadChapter();