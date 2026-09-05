const API_BASE =
    "https://mylikith-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    loadTrendingNovels();

    loadFeaturedWriters();

    loadHomeUniverse();

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

        if (!Array.isArray(novels)) {
            container.innerHTML = "<p>No novels found.</p>";
            return;
        }

        if (novels.length === 0) {

            container.innerHTML = `
                <p style="text-align:center;color:#aaa;">
                    No trending novels available.
                </p>
            `;

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
    <span>❤️ ${Number(novel.likes || 0).toLocaleString()}</span>
    <span>👁 ${Number(novel.views || 0).toLocaleString()}</span>
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

function formatCount(num) {
    num = Number(num) || 0;

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(".0", "") + "M";
    }

    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(".0", "") + "K";
    }

    return num.toString();
}

async function loadFeaturedWriters() {

    try {

        const response = await fetch(
            `${API_BASE}/api/writers/featured`
        );

        const writers = await response.json();

        const container =
            document.getElementById("featuredWriters");

        if (!container) return;

        container.innerHTML = "";

        if (!Array.isArray(writers) || writers.length === 0) {

            container.innerHTML =
                "<p>No writers available.</p>";

            return;

        }

        let html = "";

        writers.slice(0,4).forEach(writer => {

    const initial = (writer.name || "?")
        .charAt(0)
        .toUpperCase();

    const avatar = writer.profile_image
        ? `<img src="${writer.profile_image}" alt="${writer.name}">`
        : initial;

    html += `

<a href="author.html?id=${writer.id}" class="writer-card">

<div class="writer-avatar">

${avatar}

</div>

<h3>${writer.name}</h3>

<p>${formatCount(writer.followers)} Followers • ${writer.novels} Novels</p>

</a>

`;

});

        container.innerHTML = html;

    }

    catch(err){

        console.error(err);

    }

}

/* =========================================================
   HOMEPAGE — MYLIKITH UNIVERSE
========================================================= */

async function loadHomeUniverse() {

    const container =
        document.getElementById("homeUniverseModules");

    if (!container) return;

    try {

        const response = await fetch(
            `${API_BASE}/api/universe/modules`
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load Universe modules."
            );
        }

        const modules =
            await response.json();

        if (
            !Array.isArray(modules) ||
            modules.length === 0
        ) {

            container.innerHTML = `
                <div class="home-universe-loading">
                    <span>
                        The MyLikith Universe is growing...
                    </span>
                </div>
            `;

            return;
        }


        container.innerHTML = "";


        modules.forEach(module => {

            const available =
                Boolean(module.enabled) &&
                !Boolean(module.coming_soon);

            const card =
                document.createElement(
                    available ? "a" : "div"
                );

            card.className =
                "home-universe-card";


            if (available && module.route) {

                card.href =
                    module.route;

            }


            const status =
                available
                    ? "Explore"
                    : "Coming Soon";


            card.innerHTML = `

                <div class="home-universe-icon">
                    ${escapeHomeUniverseHTML(
                        module.icon || "✦"
                    )}
                </div>

                <div>

                    <h3>
                        ${escapeHomeUniverseHTML(
                            module.title ||
                            module.name ||
                            "MyLikith"
                        )}
                    </h3>

                    <p>
                        ${escapeHomeUniverseHTML(
                            module.description ||
                            "Discover stories in this MyLikith experience."
                        )}
                    </p>

                    <span
                        class="home-universe-status
                        ${available ? "" : "coming"}"
                    >
                        ${status}
                    </span>

                </div>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Homepage Universe error:",
            error
        );

        container.innerHTML = `
            <div class="home-universe-loading">
                <span>
                    Explore the MyLikith Universe
                    to discover all our story experiences.
                </span>
            </div>
        `;

    }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHomeUniverseHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

