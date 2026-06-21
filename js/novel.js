const params = new URLSearchParams(window.location.search);

const novelId = params.get("id");

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
            novel.views.toLocaleString();

        document.getElementById("novelFollowers").textContent =
            novel.followers.toLocaleString();

    } catch (error) {

        console.error(error);

    }
}

loadNovel();