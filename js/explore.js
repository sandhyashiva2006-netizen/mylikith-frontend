const API_URL =
"https://mylikith-backend.onrender.com/api/novels";

const API =
"https://mylikith-backend.onrender.com";

const readerUser =
JSON.parse(
localStorage.getItem("user")
);

let allNovels = [];
let selectedLanguage = "All";

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

        (b.likes||0)-(a.likes||0)

    );

}

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

loadRecentSearches();

loadTrendingSearches();

const sortSelect = document.getElementById("sortNovels");

if(sortSelect){

    sortSelect.addEventListener("change", () => {

        loadNovels();

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

if(selectedLanguage==="All"){

renderNovels(allNovels);

return;

}

renderNovels(

allNovels.filter(novel=>

(novel.language||"")
.toLowerCase()===

selectedLanguage.toLowerCase()

)

);

};

});

const mobileLanguage=document.getElementById("mobileLanguage");

if(mobileLanguage){

mobileLanguage.addEventListener("change",()=>{

selectedLanguage=mobileLanguage.value;

if(selectedLanguage==="All"){

renderNovels(allNovels);

return;

}

renderNovels(

allNovels.filter(novel=>

(novel.language||"").toLowerCase()===

selectedLanguage.toLowerCase()

)

);

});

}

const mobileGenre=document.getElementById("mobileGenre");

if(mobileGenre){

mobileGenre.addEventListener("change",()=>{

const genre=mobileGenre.value;

let filtered=allNovels;

if(genre!=="All"){

filtered=filtered.filter(novel=>

(novel.category||"").toLowerCase()===

genre.toLowerCase()

);

}

if(selectedLanguage!=="All"){

filtered=filtered.filter(novel=>

(novel.language||"").toLowerCase()===

selectedLanguage.toLowerCase()

);

}

renderNovels(filtered);

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

renderNovels(

allNovels.filter(novel=>

(novel.language||"").toLowerCase()===

language.toLowerCase()

)

);

}else{

const wait=setInterval(()=>{

if(allNovels.length){

clearInterval(wait);

renderNovels(

allNovels.filter(novel=>

(novel.language||"").toLowerCase()===

language.toLowerCase()

)

);

}

},100);

}

}

