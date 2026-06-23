const API_URL =
"https://mylikith-backend.onrender.com/api/novels";

function renderNovels(novels){

const novelsGrid =
document.getElementById(
"novelsGrid"
);

novelsGrid.innerHTML = "";

if(novels.length === 0){

novelsGrid.innerHTML =
"<h3>No novels found</h3>";

return;

}

novels.forEach(novel => {

novelsGrid.innerHTML += `

<a
href="novel.html?id=${novel.id}"
class="novel-card">

<div class="cover"></div>

<h3>${novel.title}</h3>

<p>
${novel.category}
•
${novel.language}
</p>

</a>

`;

});

}

async function loadNovels() {

try {

const response =
await fetch(API_URL);

const novels =
await response.json();

renderNovels(
novels
);

}
catch(error){

console.error(error);

}

}

async function searchNovels(){

const query =
document.getElementById(
"searchInput"
).value;

if(query.trim() === ""){

loadNovels();
return;

}

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/search?q=${query}`

);

const novels =
await response.json();

renderNovels(
novels
);

}

loadNovels();