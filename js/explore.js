const API_URL =
"https://mylikith-backend.onrender.com/api/novels";

const API =
"https://mylikith-backend.onrender.com";

const readerUser =
JSON.parse(
localStorage.getItem("user")
);

let allNovels = [];
let filteredNovels=[];

let selectedGenre="All";

let selectedLanguage="All";

let searchText="";

let currentSort="Trending";

function formatNumber(num){

    num = Number(num) || 0;

    if(num >= 1000000){
        return (num/1000000).toFixed(1) + "M";
    }

    if(num >= 1000){
        return (num/1000).toFixed(1) + "K";
    }

    return num;
}

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

<div class="common-novel-meta">

    <span>
        👁 ${formatNumber(novel.views || 0)}
    </span>

    <span>
        ❤️ ${formatNumber(novel.likes || 0)}
    </span>

    <span>
        ⭐ ${Number(novel.rating || 0).toFixed(1)}
    </span>

</div>

</a>

`;

});

}

function applyFilters(){

filteredNovels=[...allNovels];

if(searchText){

const q=searchText.toLowerCase();

filteredNovels=filteredNovels.filter(novel=>

(novel.title||"").toLowerCase().includes(q)

||

(novel.language||"").toLowerCase().includes(q)

||

(novel.category||"").toLowerCase().includes(q)

);

}

if(selectedGenre!=="All"){

filteredNovels=filteredNovels.filter(novel=>

(novel.category||"").toLowerCase()===

selectedGenre.toLowerCase()

);

}

if(selectedLanguage!=="All"){

filteredNovels=filteredNovels.filter(novel=>

(novel.language||"").toLowerCase()===

selectedLanguage.toLowerCase()

);

}

switch(currentSort){

case "Newest":

filteredNovels.sort((a,b)=>b.id-a.id);

break;

case "Most Read":

filteredNovels.sort((a,b)=>

(b.views||0)-(a.views||0)

);

break;

case "Highest Rated":

filteredNovels.sort((a,b)=>

(parseFloat(b.rating)||0)-

(parseFloat(a.rating)||0)

);

break;

default:

filteredNovels.sort((a,b)=>

(b.views||0)-(a.views||0)

);

}

renderNovels(filteredNovels);

}

async function loadNovels() {

try {

const response =
await fetch(API_URL);

const novels =
await response.json();

allNovels = novels;

const sort = document.getElementById("sortNovels")?.value;

if(sort==="Newest"){

    novels.sort((a,b)=>

        new Date(b.created_at)-new Date(a.created_at)

    );

}

else if(sort==="Most Read"){

    novels.sort((a,b)=>

(b.views||0)-(a.views||0)
);

}

else if(sort==="Highest Rated"){

    novels.sort((a,b)=>

        (b.rating||0)-(a.rating||0)

    );

}

else if(sort==="Completed"){

    novels.sort((a,b)=>{

        if((a.status||"").toLowerCase()==="completed" &&
           (b.status||"").toLowerCase()!=="completed") return -1;

        if((a.status||"").toLowerCase()!=="completed" &&
           (b.status||"").toLowerCase()==="completed") return 1;

        return 0;

    });

}

else{

  // Trending (default)

novels.sort((a,b)=>

(b.views||0)-(a.views||0)

);

}

applyFilters();

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

if(query.trim()===""){

searchText="";

applyFilters();

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

searchText=query;

applyFilters();

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

loadRecentSearches();

loadTrendingSearches();

const sortSelect = document.getElementById("sortNovels");

if(sortSelect){

    sortSelect.addEventListener("change",()=>{

currentSort=sortSelect.value;

applyFilters();

});

}

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

document.querySelectorAll(".language-chip").forEach(chip=>{

chip.onclick=()=>{

document.querySelectorAll(".language-chip")
.forEach(c=>c.classList.remove("active"));

chip.classList.add("active");

selectedLanguage=
chip.dataset.language;

applyFilters();

};

});



document.querySelectorAll(".genre-chip").forEach(chip=>{

chip.onclick=()=>{

document.querySelectorAll(".genre-chip")
.forEach(c=>c.classList.remove("active"));

chip.classList.add("active");

selectedGenre=chip.dataset.genre;

applyFilters();

};

});

const mobileLanguage=document.getElementById("mobileLanguage");

if(mobileLanguage){

mobileLanguage.addEventListener("change",()=>{

selectedLanguage=mobileLanguage.value;

applyFilters();

});

}

const mobileGenre=document.getElementById("mobileGenre");

if(mobileGenre){

mobileGenre.addEventListener("change",()=>{

selectedGenre=mobileGenre.value;

applyFilters();

});

}

const urlParams=new URLSearchParams(window.location.search);

const language=urlParams.get("language");

if(language){

selectedLanguage=language;

const chip=document.querySelector(

`.language-chip[data-language="${language}"]`

);

if(chip){

document.querySelectorAll(".language-chip")
.forEach(c=>c.classList.remove("active"));

chip.classList.add("active");

}

if(typeof allNovels!=="undefined" && allNovels.length){

applyFilters();

}

}else{

const wait=setInterval(()=>{

if(allNovels.length){

clearInterval(wait);

applyFilters();

}

},100);

}



