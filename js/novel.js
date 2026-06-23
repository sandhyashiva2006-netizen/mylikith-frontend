const params = new URLSearchParams(window.location.search);

const novelId = params.get("id");

function formatNumber(num){

    if(num >= 1000000){
        return (num/1000000).toFixed(1) + "M";
    }

    if(num >= 1000){
        return (num/1000).toFixed(0) + "K";
    }

    return num;
}

async function loadNovel() {

    try {

        const response = await fetch(
            `https://mylikith-backend.onrender.com/api/novels/${novelId}`
        );

        const novel = await response.json();

if (!novel || !novel.id) {
    document.getElementById("novelTitle").textContent =
        "Novel Not Found";
    return;
}

        document.getElementById("novelTitle").textContent =
            novel.title;

document.title =
`${novel.title} - Mylikith`;

        document.getElementById("novelDescription").textContent =
            novel.description;

        document.getElementById("novelLanguage").textContent =
            novel.language;

        document.getElementById("novelCategory").textContent =
            novel.category;

        document.getElementById("novelStatus").textContent =
            novel.status;

        document.getElementById("novelReads").textContent =
            formatNumber(novel.views);

        document.getElementById("novelFollowers").textContent =
            formatNumber(novel.followers);

    } catch (error) {

        console.error(error);

    }
}



async function loadChapters(){

try {

const response =
await fetch(
`https://mylikith-backend.onrender.com/api/novels/${novelId}/chapters`
);

const chapters =
await response.json();

}
catch(error){

console.error(error);

document.getElementById(
"chaptersList"
).innerHTML =
"<p>Failed to load chapters</p>";

}

const container =
document.getElementById(
"chaptersList"
);

container.innerHTML = "";

if(chapters.length===0){

container.innerHTML =
"<p>No chapters yet</p>";

return;

}

chapters.forEach(chapter=>{

container.innerHTML += `

<a
href="reader.html?chapter=${chapter.id}"
class="chapter-card">

Chapter ${chapter.chapter_no}
:
${chapter.title}

</a>

`;

});

}

loadNovel();
loadChapters();