const API_BASE =
    "https://mylikith-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    loadTrendingNovels();
});

async function loadTrendingNovels() {

    try {

        const response = await fetch(
            `${API_BASE}/api/novels`
        );

        const novels = await response.json();

        const container =
            document.getElementById("trendingNovels");

        if (!container) return;

        container.innerHTML = "";

if (novels.length === 0) {

    container.innerHTML = `
        <p style="text-align:center;color:#aaa;">
            No trending novels available.
        </p>
    `;

    return;
}

        if (!Array.isArray(novels)) {
    container.innerHTML = "<p>No novels found.</p>";
    return;
}

novels.slice(0,4).forEach(novel => {

            container.innerHTML += `

<a href="novel.html?id=${novel.id}" class="novel-card">

<img
class="novel-cover"
src="${novel.cover_url || 'assets/images/default-cover.jpg'}"
onerror="this.src='assets/images/default-cover.jpg'">

<div class="novel-info">

<h3>${novel.title}</h3>

<p>${novel.category} • ${novel.language}</p>

<div class="novel-meta">

<span>⭐ ${Number(novel.rating || 0).toFixed(1)}</span>

<span>👁 ${novel.views || 0}</span>

</div>

<div class="read-btn">

Read Now →

</div>

</div>

</a>

`;

        });

    }

    catch(err){

        console.error(err);

    }

}