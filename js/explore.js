const API_URL =
"https://mylikith-backend.onrender.com/api/novels";

const API =
"https://mylikith-backend.onrender.com";

const readerUser =
JSON.parse(
localStorage.getItem("user")
);

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

<img
class="cover"
src="${novel.cover_url || 'assets/images/default-cover.png'}">

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

if(readerUser && query.trim()!==""){

fetch(

`${API}/api/search/history`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:readerUser.id,

keyword:query

})

}

);

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

loadRecentSearches();

}

async function loadRecentSearches(){

if(!readerUser)return;

const response=await fetch(

`${API}/api/search/history/${readerUser.id}`

);

const searches=await response.json();

const container=document.getElementById(

"recentSearches"

);

if(!container)return;

container.innerHTML="";

searches.forEach(item=>{

container.innerHTML+=`

<span

class="recent-search"

onclick="searchAgain('${item.keyword}')">

${item.keyword}

</span>

`;

});

}

loadNovels();

function searchAgain(keyword){

document.getElementById(

"searchInput"

).value=keyword;

searchNovels();

}

const clearBtn =
document.getElementById(
"clearSearchHistory"
);

if(clearBtn){

clearBtn.onclick=async()=>{

await fetch(

`${API}/api/search/history/${readerUser.id}`,

{

method:"DELETE"

}

);

loadRecentSearches();
loadTrendingSearches();

};

}

async function loadTrendingSearches(){

const response=await fetch(

`${API}/api/search/trending`

);

const searches=await response.json();

const container=document.getElementById(

"trendingSearches"

);

if(!container)return;

container.innerHTML="";

searches.forEach(item=>{

container.innerHTML+=`

<span

class="trending-search"

onclick="searchAgain('${item.keyword}')">

🔥 ${item.keyword}

</span>

`;

});

}

