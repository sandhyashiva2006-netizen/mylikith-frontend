const API =
"https://mylikith-backend.onrender.com";

const libraryUser =
JSON.parse(
localStorage.getItem("user")
);

if(!libraryUser){

window.location =
"login.html";

}

function createLibraryCard(title,subtitle,chapterId,buttonText){

return `

<div class="library-card">

<div>

<h3>

${title}

</h3>

<p>

${subtitle}

</p>

</div>

<a
href="reader.html?chapter=${chapterId}"
class="btn btn-primary">

${buttonText}

</a>

</div>

`;

}

async function loadContinueReading(){

try{

const response =
await fetch(

`${API}/api/writers/reading-progress/${libraryUser.id}`

);

const chapter =
await response.json();

const container =
document.getElementById(
"continueReading"
);

container.innerHTML="";

if(!chapter){

container.innerHTML=`

<div class="empty-card">

No books in progress.

</div>

`;

return;

}

container.innerHTML =

createLibraryCard(

`Chapter ${chapter.chapter_no}`,

chapter.title,

chapter.id,

"Continue Reading"

);

}
catch(err){

console.log(err);

}

}

async function loadHistory(){

try{

const response =
await fetch(

`${API}/api/writers/reading-history/${libraryUser.id}`

);

const history =
await response.json();

const container =
document.getElementById(
"history"
);

container.innerHTML="";

if(history.length===0){

container.innerHTML=`

<div class="empty-card">

No reading history.

</div>

`;

return;

}

history.forEach(item=>{

container.innerHTML +=

createLibraryCard(

`Chapter ${item.chapter_no}`,

item.title,

item.id,

"Read Again"

);

});

}
catch(err){

console.log(err);

}

}

async function loadBookmarks(){

try{

const response =
await fetch(

`${API}/api/writers/bookmarks/${libraryUser.id}`

);

const bookmarks =
await response.json();

const container =
document.getElementById(
"bookmarks"
);

container.innerHTML="";

if(bookmarks.length===0){

container.innerHTML=`

<div class="empty-card">

No bookmarks.

</div>

`;

return;

}

bookmarks.forEach(item=>{

container.innerHTML +=

createLibraryCard(

`Chapter ${item.chapter_no}`,

item.title,

item.id,

"Open"

);

});

}
catch(err){

console.log(err);

}

}

loadContinueReading();

loadHistory();

loadBookmarks();