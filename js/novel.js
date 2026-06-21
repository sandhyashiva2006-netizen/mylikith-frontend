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