const API =
    "https://mylikith-backend.onrender.com";

const params =
    new URLSearchParams(
        window.location.search
    );

const originalId =
    params.get("id");

let original = null;
let chapters = [];


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!originalId) {

            showError(
                "No Original was selected."
            );

            return;

        }

        loadOriginal();

    }
);


/* =========================================================
   LOAD ORIGINAL
========================================================= */

async function loadOriginal() {

    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Original not found."
            );

        }

original =
    data.original;

renderOriginal();

await recordOriginalView();

await loadChapters();

    } catch (error) {

        console.error(
            "Original loading error:",
            error
        );

        showError(
            error.message
        );

    }

}

/* =========================================================
   RECORD ORIGINAL VIEW
========================================================= */

async function recordOriginalView() {

    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/view`,
                {
                    method: "POST"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            console.warn(
                "Original view was not recorded:",
                data.message
            );

            return;
        }


        if (
            data.success &&
            typeof data.views !== "undefined"
        ) {

            original.views =
                Number(data.views);

            const viewsElement =
                document.getElementById(
                    "originalViews"
                );

            if (viewsElement) {

                viewsElement.textContent =
                    formatNumber(
                        original.views
                    );

            }

        }

    } catch (error) {

        console.warn(
            "Original view tracking error:",
            error
        );

    }

}

/* =========================================================
   RENDER ORIGINAL
========================================================= */

function renderOriginal() {

    document.title =
        `${original.title} - MyLikith Originals`;

    document.getElementById(
        "originalTitle"
    ).textContent =
        original.title || "Untitled Original";

    document.getElementById(
        "originalDescription"
    ).textContent =
        original.description ||
        "An exclusive MyLikith Original.";

    document.getElementById(
        "originalLanguage"
    ).textContent =
        original.language || "Original";

    document.getElementById(
        "originalCategory"
    ).textContent =
        original.category || "Story";

    document.getElementById(
        "originalStatus"
    ).textContent =
        original.status || "Ongoing";

    document.getElementById(
        "originalViews"
    ).textContent =
        formatNumber(
            original.views || 0
        );

    document.getElementById(
        "originalLikes"
    ).textContent =
        formatNumber(
            original.likes || 0
        );

    document.getElementById(
        "originalRating"
    ).textContent =
        Number(
            original.rating || 0
        ).toFixed(1);


    const cover =
        document.getElementById(
            "originalCover"
        );

    if (cover) {

        cover.src =
            original.cover_url ||
            "assets/images/default-cover.png";

    }


    document.getElementById(
        "startOriginalBtn"
    ).onclick =
        startReading;


    document.getElementById(
        "shareOriginalBtn"
    ).onclick =
        shareOriginal;

}


/* =========================================================
   LOAD CHAPTERS
========================================================= */

async function loadChapters() {

    const container =
        document.getElementById(
            "originalChapters"
        );

    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/chapters`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load chapters."
            );

        }

        chapters =
            Array.isArray(data.chapters)
                ? data.chapters
                : [];


        document.getElementById(
            "chapterCount"
        ).textContent =
            `${chapters.length} ${
                chapters.length === 1
                    ? "Chapter"
                    : "Chapters"
            }`;


        renderChapters();


    } catch (error) {

        console.error(
            "Chapter loading error:",
            error
        );

        container.innerHTML = `
            <div class="original-error">
                Unable to load chapters.
            </div>
        `;

    }

}


/* =========================================================
   RENDER CHAPTERS
========================================================= */

function renderChapters() {

    const container =
        document.getElementById(
            "originalChapters"
        );

    if (!chapters.length) {

        container.innerHTML = `
            <div class="original-empty">

                <strong>
                    Chapters are coming soon.
                </strong>

                <p>
                    This Original is currently being created.
                </p>

            </div>
        `;

        return;

    }

    container.innerHTML = "";

    chapters.forEach(
        (chapter, index) => {

            const card =
                document.createElement(
                    "a"
                );

            card.className =
                "original-chapter-card";

            card.href =
    `original-chapter.html?id=${encodeURIComponent(
        chapter.id
    )}`;


            const access =
                chapter.is_premium
                    ? `
                        <span class="original-premium">
                            🔒 PREMIUM
                        </span>
                    `
                    : `
                        <span class="original-free">
                            FREE
                        </span>
                    `;


            card.innerHTML = `

                <div class="original-chapter-left">

                    <div class="original-chapter-top">

                        <h3>
                            Chapter ${chapter.chapter_no}
                        </h3>

                        ${access}

                    </div>

                    <p class="original-chapter-title">
                        ${escapeHTML(
                            chapter.title ||
                            `Chapter ${chapter.chapter_no}`
                        )}
                    </p>

                </div>

                <div class="original-chapter-arrow">
                    →
                </div>

            `;

            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   START READING
========================================================= */

function startReading() {

    if (!chapters.length) {

        alert(
            "No episodes are available yet."
        );

        return;
    }

    window.location.href =
        `original-chapter.html?id=${encodeURIComponent(
            chapters[0].id
        )}`;

}


/* =========================================================
   SHARE
========================================================= */

async function shareOriginal() {

    const shareData = {

        title:
            original.title,

        text:
            `Read ${original.title} on MyLikith Originals.`,

        url:
            window.location.href

    };


    try {

        if (
            navigator.share
        ) {

            await navigator.share(
                shareData
            );

        } else {

            await navigator.clipboard.writeText(
                window.location.href
            );

            alert(
                "Original link copied."
            );

        }

    } catch (error) {

        console.log(
            "Share cancelled."
        );

    }

}


/* =========================================================
   HELPERS
========================================================= */

function formatNumber(num) {

    if (num >= 1000000) {

        return (
            num / 1000000
        ).toFixed(1) + "M";

    }

    if (num >= 1000) {

        return (
            num / 1000
        ).toFixed(1) + "K";

    }

    return num;

}


function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function showError(message) {

    document.querySelector(
        ".original-page"
    ).innerHTML = `

        <div class="original-error"
             style="margin:160px 24px;">

            <h2>
                MyLikith Original
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}