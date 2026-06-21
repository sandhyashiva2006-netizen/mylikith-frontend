const API_URL =
"https://mylikith-backend.onrender.com/api/novels";

async function loadNovels() {

    try {

        const response =
        await fetch(API_URL);

        const novels =
        await response.json();

        const novelsGrid =
        document.getElementById("novelsGrid");

        novelsGrid.innerHTML = "";

        novels.forEach(novel => {

            novelsGrid.innerHTML += `
            
            <a href="novel.html?id=${novel.id}" class="novel-card">

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

    } catch(error) {

        console.error(error);

    }

}

loadNovels();