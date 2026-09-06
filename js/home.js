const API_BASE =
    "https://mylikith-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    loadTrendingNovels();

    loadFeaturedWriters();

    loadFeaturedOriginal();

});


async function loadFeaturedOriginal() {

    const section =
        document.getElementById("homeOriginalsPromo");

    if (!section) return;

    try {

        const response = await fetch(
            `${API_BASE}/api/originals`
        );

        const data = await response.json();

        if (!response.ok || !Array.isArray(data.originals)) {
            throw new Error(
                data.message ||
                "Unable to load Originals."
            );
        }

        const original = data.originals[0];

        if (!original) {
            section.hidden = true;
            return;
        }

        const title =
            document.getElementById("homeOriginalTitle");

        const meta =
            document.getElementById("homeOriginalMeta");

        const watch =
            document.getElementById("homeOriginalWatch");

        const artLink =
            document.getElementById("homeOriginalArtLink");

        const cover =
            document.getElementById("homeOriginalCover");

        const placeholder =
            document.getElementById("homeOriginalPlaceholder");

        if (title) {
            title.textContent =
                original.title ||
                "MyLikith Original";
        }

        if (meta) {
            const details = [];

            if (original.content_type) {
                details.push(original.content_type);
            }

            if (original.language) {
                details.push(original.language);
            }

            if (original.category) {
                details.push(original.category);
            }

            meta.textContent =
                details.length
                    ? details.join(" • ")
                    : "Original video series";
        }

        const originalUrl =
            `original.html?id=${encodeURIComponent(original.id)}`;

        if (watch) {
            watch.href = originalUrl;
        }

        if (artLink) {
            artLink.href = originalUrl;
            artLink.setAttribute(
                "aria-label",
                `Watch ${original.title || "MyLikith Original"}`
            );
        }

        if (cover && original.cover_url) {
            cover.src = original.cover_url;
            cover.alt = original.title || "MyLikith Original";
            cover.hidden = false;

            cover.addEventListener(
                "error",
                () => {
                    cover.hidden = true;
                    if (placeholder) {
                        placeholder.hidden = false;
                    }
                },
                { once: true }
            );

            if (placeholder) {
                placeholder.hidden = true;
            }
        }

        section.hidden = false;

    } catch (error) {

        console.error(
            "Homepage Originals error:",
            error
        );

        section.hidden = true;

    }

}


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
    <span>⭐ ${Number(novel.rating).toFixed(1)}</span>
    <span>❤️ ${Number(novel.likes).toLocaleString()}</span>
    <span>👁 ${Number(novel.views).toLocaleString()}</span>
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


