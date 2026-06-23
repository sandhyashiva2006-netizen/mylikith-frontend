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

        document.getElementById("novelTitle").textContent =
            novel.title;

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

loadNovel();

async function loadChapters(){

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/novels/${novelId}/chapters`

);

const chapters =
await response.json();

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

loadChapters();