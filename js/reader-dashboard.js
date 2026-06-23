const readerUser =
JSON.parse(
localStorage.getItem("user")
);

if(readerUser){

document.getElementById(
"readerName"
).textContent =
readerUser.name;

}

async function loadBookmarks(){

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/writers/bookmarks/${readerUser.id}`

);

const bookmarks =
await response.json();

const container =
document.getElementById(
"bookmarks"
);

container.innerHTML = "";

if(bookmarks.length===0){

container.innerHTML =
'<div class="card">No bookmarks yet</div>';

return;

}

bookmarks.forEach(bookmark=>{

container.innerHTML += `

<div class="card">

Chapter ${bookmark.chapter_no}

<br><br>

${bookmark.title}

</div>

`;

});

}

loadBookmarks();

