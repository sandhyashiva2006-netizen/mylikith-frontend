const AUDIO_API_BASE =
    "https://mylikith-backend.onrender.com/api/audio";

let audioPageNumber = 1;
let audioTotalPages = 1;
let audioSearchTimer = null;

const audio$ = (id) => document.getElementById(id);

function audioEscape(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function audioToken() {
    return localStorage.getItem("token") || "";
}

function audioHeaders() {
    const headers = {};

    if (audioToken()) {
        headers.Authorization = "Bearer " + audioToken();
    }

    return headers;
}

function audioFormatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString();
}

function audioFormatTime(seconds) {
    const value = Number(seconds);

    if (!Number.isFinite(value) || value < 0) {
        return "00:00";
    }

    const total = Math.floor(value);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function audioCover(url, title) {
    if (!url) {
        return `<div class="audio-card-cover-fallback">🎧</div>`;
    }

    return `
        <img
            class="audio-card-cover"
            src="${audioEscape(url)}"
            alt="${audioEscape(title)}"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.hidden=false;"
        >
        <div class="audio-card-cover-fallback" hidden>🎧</div>
    `;
}

function audioBadges(item) {
    const badges = [];

    if (item.premium_only) {
        badges.push(`<span class="audio-badge premium">👑 Premium</span>`);
    }

    if (item.featured) {
        badges.push(`<span class="audio-badge featured">✦ Featured</span>`);
    }

    return badges.length
        ? `<div class="audio-card-badges">${badges.join("")}</div>`
        : "";
}

function renderAudioCard(item) {
    const title = audioEscape(item.title || "Untitled Audio");
    const writer = audioEscape(item.writer_name || "MyLikith Writer");
    const category = audioEscape(item.category || "Story");
    const language = audioEscape(item.language || "Unknown");
    const rating = Number(item.rating || 0);

    return `
        <a
            class="audio-card"
            href="audio.html?id=${encodeURIComponent(item.id)}"
        >
            <div class="audio-card-cover-wrap">
                ${audioCover(item.cover_url, item.title)}
                ${audioBadges(item)}
                <span class="audio-card-play">▶</span>
            </div>

            <div class="audio-card-body">
                <h3>${title}</h3>

                <p class="audio-card-writer">
                    ${writer}
                </p>

                <div class="audio-card-meta">
                    <span>${category}</span>
                    <span>${language}</span>
                </div>

                <div class="audio-card-stats">
                    <span>⭐ ${rating > 0 ? rating.toFixed(1) : "New"}</span>
                    <span>♥ ${audioFormatNumber(item.likes)}</span>
                    <span>👁 ${audioFormatNumber(item.views)}</span>
                </div>
            </div>
        </a>
    `;
}

function renderFeatured(items) {
    const container = audio$("featuredAudio");

    if (!container) {
        return;
    }

    if (!items.length) {
        container.innerHTML = `
            <div class="audio-empty">
                <div>🎧</div>
                <h3>No featured audio yet</h3>
                <p>Featured audio stories will appear here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items
        .map(renderAudioCard)
        .join("");
}

function renderAudioResults(items) {
    const container = audio$("audioResults");

    if (!container) {
        return;
    }

    if (!items.length) {
        container.innerHTML = `
            <div class="audio-empty">
                <div>🔎</div>
                <h3>No audio found</h3>
                <p>Try another search, language or category.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items
        .map(renderAudioCard)
        .join("");
}

function renderContinueListening(items) {
    const section = audio$("continueListeningSection");
    const container = audio$("continueListening");

    if (!section || !container) {
        return;
    }

    if (!items.length) {
        section.hidden = true;
        return;
    }

    section.hidden = false;

    container.innerHTML = items.map(item => {
        const duration = Number(item.duration_seconds || item.audio_duration_seconds || 0);
        const position = Number(item.position_seconds || 0);

        let percent = Number(item.progress_percent);

        if (!Number.isFinite(percent)) {
            percent = duration > 0
                ? (position / duration) * 100
                : 0;
        }

        percent = Math.min(100, Math.max(0, percent));

        return `
            <a
                class="continue-audio-card"
                href="audio-chapter.html?id=${encodeURIComponent(item.chapter_id)}"
            >
                <div class="continue-cover-wrap">
                    ${audioCover(item.cover_url, item.audio_novel_title)}
                </div>

                <div class="continue-info">
                    <span class="audio-section-label">CONTINUE LISTENING</span>

                    <h3>${audioEscape(item.audio_novel_title || "Audio Novel")}</h3>

                    <p>
                        Chapter ${audioEscape(item.chapter_no || "")}
                        • ${audioEscape(item.chapter_title || "Untitled")}
                    </p>

                    <div class="continue-progress">
                        <span style="width:${percent}%"></span>
                    </div>

                    <div class="continue-meta">
                        <span>${Math.round(percent)}% listened</span>
                        <span>${audioFormatTime(position)} / ${audioFormatTime(duration)}</span>
                    </div>
                </div>

                <div class="continue-play">▶</div>
            </a>
        `;
    }).join("");
}

async function loadFeaturedAudio() {
    const container = audio$("featuredAudio");

    if (container) {
        container.innerHTML = `<div class="audio-loading">Loading featured audio...</div>`;
    }

    try {
        const response = await fetch(`${AUDIO_API_BASE}/featured`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load featured audio.");
        }

        renderFeatured(Array.isArray(data.audio) ? data.audio : []);
    } catch (error) {
        console.error("Featured audio error:", error);

        if (container) {
            container.innerHTML = `
                <div class="audio-empty">
                    <div>⚠️</div>
                    <h3>Unable to load featured audio</h3>
                    <p>Please try again.</p>
                </div>
            `;
        }
    }
}

async function loadLanguages() {
    try {
        const response = await fetch(`${AUDIO_API_BASE}/languages`);
        const data = await response.json();

        if (!data.success) {
            return;
        }

        const select = audio$("languageFilter");

        if (!select) {
            return;
        }

        select.innerHTML =
            `<option value="">All Languages</option>` +
            (data.languages || [])
                .map(language =>
                    `<option value="${audioEscape(language)}">${audioEscape(language)}</option>`
                )
                .join("");
    } catch (error) {
        console.error("Audio languages error:", error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${AUDIO_API_BASE}/categories`);
        const data = await response.json();

        if (!data.success) {
            return;
        }

        const select = audio$("categoryFilter");

        if (!select) {
            return;
        }

        select.innerHTML =
            `<option value="">All Categories</option>` +
            (data.categories || [])
                .map(category =>
                    `<option value="${audioEscape(category)}">${audioEscape(category)}</option>`
                )
                .join("");
    } catch (error) {
        console.error("Audio categories error:", error);
    }
}

async function loadContinueListening() {
    if (!audioToken()) {
        return;
    }

    try {
        const response = await fetch(
            `${AUDIO_API_BASE}/continue-listening`,
            {
                headers: audioHeaders()
            }
        );

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        if (data.success) {
            renderContinueListening(
                Array.isArray(data.listening)
                    ? data.listening
                    : []
            );
        }
    } catch (error) {
        console.error("Continue listening error:", error);
    }
}

async function loadAudioResults() {
    const search = audio$("audioSearch")?.value.trim() || "";
    const language = audio$("languageFilter")?.value || "";
    const category = audio$("categoryFilter")?.value || "";
    const sort = audio$("sortFilter")?.value || "latest";

    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    if (language) {
        params.set("language", language);
    }

    if (category) {
        params.set("category", category);
    }

    params.set("sort", sort);
    params.set("page", String(audioPageNumber));
    params.set("limit", "20");

    const container = audio$("audioResults");

    if (container) {
        container.innerHTML =
            `<div class="audio-loading">Loading audio stories...</div>`;
    }

    try {
        const response = await fetch(
            `${AUDIO_API_BASE}?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to load audio."
            );
        }

        const items = Array.isArray(data.audio)
            ? data.audio
            : [];

        renderAudioResults(items);

        audioTotalPages =
            Number(data.pagination?.totalPages || 1);

        updatePagination(
            Number(data.pagination?.page || audioPageNumber),
            audioTotalPages
        );

        const title = search
            ? `Search results for “${audioEscape(search)}”`
            : sort === "popular"
                ? "Popular Audio"
                : sort === "rating"
                    ? "Highest Rated Audio"
                    : sort === "likes"
                        ? "Most Liked Audio"
                        : "Latest Audio";

        if (audio$("resultsTitle")) {
            audio$("resultsTitle").textContent = title;
        }

        if (audio$("resultsSummary")) {
            audio$("resultsSummary").textContent =
                `${Number(data.pagination?.total || items.length)} audio stories available.`;
        }

    } catch (error) {
        console.error("Audio results error:", error);

        if (container) {
            container.innerHTML = `
                <div class="audio-empty">
                    <div>⚠️</div>
                    <h3>Unable to load audio</h3>
                    <p>${audioEscape(error.message || "Please try again.")}</p>
                </div>
            `;
        }
    }
}

function updatePagination(page, totalPages) {
    const wrapper = audio$("audioPagination");
    const info = audio$("pageInfo");
    const previous = audio$("previousPage");
    const next = audio$("nextPage");

    if (!wrapper || !info || !previous || !next) {
        return;
    }

    if (totalPages <= 1) {
        wrapper.hidden = true;
        return;
    }

    wrapper.hidden = false;
    info.textContent = `Page ${page} of ${totalPages}`;

    previous.disabled = page <= 1;
    next.disabled = page >= totalPages;

    audioPageNumber = page;
}

async function loadNovelDetails(novelId) {
    const section = audio$("novelDetailsSection");

    if (!section) {
        return;
    }

    section.hidden = false;

    try {
        const [novelResponse, chaptersResponse] =
            await Promise.all([
                fetch(`${AUDIO_API_BASE}/${novelId}`),
                fetch(`${AUDIO_API_BASE}/${novelId}/chapters`)
            ]);

        const novelData = await novelResponse.json();
        const chaptersData = await chaptersResponse.json();

        if (
            !novelResponse.ok ||
            !novelData.success
        ) {
            throw new Error(
                novelData.message || "Audio novel not found."
            );
        }

        renderNovelDetails(novelData.audio);

        if (
            chaptersResponse.ok &&
            chaptersData.success
        ) {
            renderChapters(
                Array.isArray(chaptersData.chapters)
                    ? chaptersData.chapters
                    : []
            );
        } else {
            renderChapters([]);
        }

        window.scrollTo({
            top: section.offsetTop - 90,
            behavior: "smooth"
        });

    } catch (error) {
        console.error("Audio novel details error:", error);

        section.innerHTML = `
            <div class="audio-empty">
                <div>⚠️</div>
                <h3>Unable to load this audio novel</h3>
                <p>${audioEscape(error.message || "Please try again.")}</p>
            </div>
        `;
    }
}

function renderNovelDetails(novel) {
    const cover = audio$("novelDetailCover");
    const fallback = audio$("novelDetailCoverFallback");
    const title = audio$("novelDetailTitle");
    const description = audio$("novelDetailDescription");
    const meta = audio$("novelDetailMeta");

    if (cover && fallback) {
        if (novel.cover_url) {
            cover.src = novel.cover_url;
            cover.alt = novel.title || "Audio novel cover";
            cover.hidden = false;
            fallback.hidden = true;

            cover.onerror = () => {
                cover.hidden = true;
                fallback.hidden = false;
            };
        } else {
            cover.hidden = true;
            fallback.hidden = false;
        }
    }

    if (title) {
        title.textContent = novel.title || "Audio Novel";
    }

    if (description) {
        description.textContent =
            novel.description || "Listen to this story on MyLikith Audio.";
    }

    if (meta) {
        meta.innerHTML = `
            <span>${audioEscape(novel.language || "Unknown")}</span>
            <span>${audioEscape(novel.category || "Story")}</span>
            <span>⭐ ${Number(novel.rating || 0) > 0 ? Number(novel.rating).toFixed(1) : "New"}</span>
            <span>♥ ${audioFormatNumber(novel.likes)}</span>
            <span>👁 ${audioFormatNumber(novel.views)}</span>
        `;
    }

    const button = audio$("novelFirstChapterButton");

    if (button) {
        button.hidden = true;
        button.href = "#";
    }
}

function renderChapters(chapters) {
    const container = audio$("audioChapters");

    if (!container) {
        return;
    }

    if (!chapters.length) {
        container.innerHTML = `
            <div class="audio-empty compact">
                <div>🎧</div>
                <h3>No published chapters yet</h3>
                <p>Audio episodes will appear here when published.</p>
            </div>
        `;
        return;
    }

    const first = chapters[0];
    const firstButton = audio$("novelFirstChapterButton");

    if (firstButton) {
        firstButton.hidden = false;
        firstButton.href =
            `audio-chapter.html?id=${encodeURIComponent(first.id)}`;
    }

    container.innerHTML = chapters.map((chapter, index) => {
        const duration = audioFormatTime(
            chapter.audio_duration_seconds
        );

        const locked =
            Boolean(chapter.is_premium) ||
            Number(chapter.coins_required || 0) > 0;

        return `
            <a
                class="audio-chapter-row"
                href="audio-chapter.html?id=${encodeURIComponent(chapter.id)}"
            >
                <div class="chapter-number">
                    ${String(chapter.chapter_no ?? index + 1).padStart(2, "0")}
                </div>

                <div class="chapter-main">
                    <h3>${audioEscape(chapter.title || "Untitled Chapter")}</h3>

                    <div class="chapter-meta">
                        <span>${duration}</span>
                        ${locked
                            ? `<span class="chapter-lock">🔒 ${chapter.coins_required ? `${audioEscape(chapter.coins_required)} coins` : "Premium"}</span>`
                            : `<span class="chapter-free">FREE</span>`
                        }
                    </div>
                </div>

                <span class="chapter-play">▶</span>
            </a>
        `;
    }).join("");
}

function clearAudioFilters() {
    if (audio$("audioSearch")) {
        audio$("audioSearch").value = "";
    }

    if (audio$("languageFilter")) {
        audio$("languageFilter").value = "";
    }

    if (audio$("categoryFilter")) {
        audio$("categoryFilter").value = "";
    }

    if (audio$("sortFilter")) {
        audio$("sortFilter").value = "latest";
    }

    audioPageNumber = 1;
    loadAudioResults();
}

function bindAudioEvents() {
    audio$("searchButton")?.addEventListener(
        "click",
        () => {
            audioPageNumber = 1;
            loadAudioResults();
        }
    );

    audio$("audioSearch")?.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                audioPageNumber = 1;
                loadAudioResults();
            }
        }
    );

    audio$("audioSearch")?.addEventListener(
        "input",
        () => {
            clearTimeout(audioSearchTimer);

            audioSearchTimer = setTimeout(() => {
                audioPageNumber = 1;
                loadAudioResults();
            }, 500);
        }
    );

    audio$("languageFilter")?.addEventListener(
        "change",
        () => {
            audioPageNumber = 1;
            loadAudioResults();
        }
    );

    audio$("categoryFilter")?.addEventListener(
        "change",
        () => {
            audioPageNumber = 1;
            loadAudioResults();
        }
    );

    audio$("sortFilter")?.addEventListener(
        "change",
        () => {
            audioPageNumber = 1;
            loadAudioResults();
        }
    );

    audio$("clearFiltersButton")?.addEventListener(
        "click",
        clearAudioFilters
    );

    audio$("previousPage")?.addEventListener(
        "click",
        () => {
            if (audioPageNumber <= 1) {
                return;
            }

            audioPageNumber--;
            loadAudioResults();
            audio$("browseAudio")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );

    audio$("nextPage")?.addEventListener(
        "click",
        () => {
            if (audioPageNumber >= audioTotalPages) {
                return;
            }

            audioPageNumber++;
            loadAudioResults();
            audio$("browseAudio")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );
}

async function initAudioPage() {
    bindAudioEvents();

    await Promise.all([
        loadFeaturedAudio(),
        loadLanguages(),
        loadCategories(),
        loadContinueListening(),
        loadAudioResults()
    ]);

    const params = new URLSearchParams(
        window.location.search
    );

    const novelId = Number(
        params.get("id") || 0
    );

    if (
        Number.isInteger(novelId) &&
        novelId > 0
    ) {
        await loadNovelDetails(novelId);
    }
}

document.addEventListener(
    "DOMContentLoaded",
    initAudioPage
);
