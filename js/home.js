const API_BASE =
    "https://mylikith-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    loadHomeUniverse();

    loadTrendingNovels();

    loadFeaturedWriters();

    loadFeaturedOriginal();

});


async function loadHomeUniverse() {

    const container = document.getElementById("homeUniverseModules");

    if (!container) return;

    try {

        const response = await fetch(
            `${API_BASE}/api/universe/modules`
        );

        if (!response.ok) {
            throw new Error(`Universe API returned ${response.status}`);
        }

        const modules = await response.json();

        if (!Array.isArray(modules)) {
            throw new Error("Invalid Universe API response.");
        }

        const available = modules.filter(module =>
            module &&
            module.enabled === true &&
            module.coming_soon === false
        );

        const comingSoon = modules.filter(module =>
            !available.includes(module)
        );

        const ordered = [...available, ...comingSoon].slice(0, 6);

        if (ordered.length === 0) {
            container.innerHTML = `
                <div class="home-universe-empty">
                    <span>✦</span>
                    <p>The MyLikith Universe is preparing something new.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = ordered.map(module => {

            const isAvailable =
                module.enabled === true &&
                module.coming_soon === false;

            const title = escapeHomeHTML(module.title || module.name || "MyLikith");
            const description = escapeHomeHTML(module.description || "Explore stories on MyLikith.");
            const icon = escapeHomeHTML(module.icon || "✦");
            const route = module.route ? escapeHomeAttribute(module.route) : "";

            const cardContent = `
                <div class="home-universe-card-icon">${icon}</div>
                <div class="home-universe-card-content">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
                <div class="home-universe-card-footer">
                    <span class="home-universe-status ${isAvailable ? "available" : "coming-soon"}">
                        ${isAvailable ? "Available" : "Coming Soon"}
                    </span>
                    ${isAvailable && route ? `<span class="home-universe-card-arrow">→</span>` : ""}
                </div>
            `;

            if (isAvailable && route) {
                return `<a class="home-universe-card available" href="${route}">${cardContent}</a>`;
            }

            return `<div class="home-universe-card coming-soon">${cardContent}</div>`;

        }).join("");

    } catch (error) {

        console.warn("Homepage Universe:", error);

        container.innerHTML = `
            <div class="home-universe-error">
                <span>✦</span>
                <p>Unable to load the Universe right now.</p>
                <button type="button" onclick="loadHomeUniverse()">Try Again</button>
            </div>
        `;

    }
}

function escapeHomeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHomeAttribute(value) {
    return escapeHomeHTML(value);
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

async function loadFeaturedOriginal() {

    const section = document.getElementById("homeOriginalsPromo");
    const title = document.getElementById("homeOriginalTitle");
    const meta = document.getElementById("homeOriginalMeta");
    const watch = document.getElementById("homeOriginalWatch");
    const artLink = document.getElementById("homeOriginalArtLink");
    const cover = document.getElementById("homeOriginalCover");
    const placeholder = document.getElementById("homeOriginalPlaceholder");

    if (!section || !title) return;

    try {

        const response = await fetch(`${API_BASE}/api/originals`);

        if (!response.ok) {
            throw new Error("Unable to load Originals.");
        }

        const originals = await response.json();

        if (!Array.isArray(originals) || originals.length === 0) {
            section.hidden = true;
            return;
        }

        const original = originals[0];

        title.textContent = original.title || "MyLikith Original";

        const metaParts = [];
        if (original.language) metaParts.push(original.language);
        if (original.category) metaParts.push(original.category);
        if (original.content_type) metaParts.push(original.content_type);

        meta.textContent = metaParts.join(" • ");

        const destination = original.id
            ? `original.html?id=${encodeURIComponent(original.id)}`
            : "originals.html";

        if (watch) watch.href = destination;
        if (artLink) artLink.href = destination;

        if (original.cover_url && cover) {
            cover.src = original.cover_url;
            cover.alt = original.title || "MyLikith Original";
            cover.hidden = false;

            cover.onerror = function () {
                cover.hidden = true;
                if (placeholder) placeholder.hidden = false;
            };

            if (placeholder) placeholder.hidden = true;
        } else if (placeholder) {
            placeholder.hidden = false;
        }

        section.hidden = false;

    } catch (error) {

        console.warn("Homepage Originals:", error);
        section.hidden = true;

    }

}

