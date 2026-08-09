const API =
    "https://mylikith-backend.onrender.com";

const params =
    new URLSearchParams(
        window.location.search
    );

const chapterId =
    params.get("chapter");

let currentChapter = null;
let chapters = [];
let currentIndex = -1;


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!chapterId) {

            showError(
                "No chapter was selected."
            );

            return;

        }

        loadChapter();

        setupReadingProgress();

    }
);


/* =========================================================
   LOAD CHAPTER
========================================================= */

async function loadChapter() {

    try {

        const response =
            await fetch(
                `${API}/api/originals/chapter/${chapterId}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load chapter."
            );

        }


        if (data.locked) {

            renderLockedChapter(
                data.chapter
            );

            return;

        }


        currentChapter =
            data.chapter;


        renderChapter();

        await loadChapterList(
            currentChapter.original_id
        );

    } catch (error) {

        console.error(
            "Original reader error:",
            error
        );

        showError(
            error.message
        );

    }

}


/* =========================================================
   RENDER
========================================================= */

function renderChapter() {

    document.title =
        `${currentChapter.title} - MyLikith Originals`;


    document.getElementById(
        "chapterTitle"
    ).textContent =
        `Chapter ${currentChapter.chapter_no} — ${
            currentChapter.title || ""
        }`;


    document.getElementById(
        "chapterContent"
    ).innerHTML =
        formatContent(
            currentChapter.content
        );


    document.getElementById(
        "backToOriginalBtn"
    ).onclick = () => {

        window.location.href =
            `original.html?id=${encodeURIComponent(
                currentChapter.original_id
            )}`;

    };

}


/* =========================================================
   LOAD CHAPTER LIST
========================================================= */

async function loadChapterList(
    originalId
) {

    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/chapters`
            );

        const data =
            await response.json();

        if (!response.ok) {

            return;

        }

        chapters =
            Array.isArray(data.chapters)
                ? data.chapters
                : [];


        currentIndex =
            chapters.findIndex(
                chapter =>
                    Number(chapter.id) ===
                    Number(chapterId)
            );


        setupNavigation();

    } catch (error) {

        console.warn(
            "Unable to load chapter navigation:",
            error
        );

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const previous =
        document.getElementById(
            "prevChapterBtn"
        );

    const next =
        document.getElementById(
            "nextChapterBtn"
        );


    if (currentIndex <= 0) {

        previous.disabled = true;

    } else {

        previous.disabled = false;

        previous.onclick = () => {

            const chapter =
                chapters[
                    currentIndex - 1
                ];

            window.location.href =
                `original-reader.html?chapter=${chapter.id}`;

        };

    }


    if (
        currentIndex === -1 ||
        currentIndex >= chapters.length - 1
    ) {

        next.disabled = true;

    } else {

        next.disabled = false;

        next.onclick = () => {

            const chapter =
                chapters[
                    currentIndex + 1
                ];

            window.location.href =
                `original-reader.html?chapter=${chapter.id}`;

        };

    }

}


/* =========================================================
   LOCKED CHAPTER
========================================================= */

function renderLockedChapter(
    chapter
) {

    document.getElementById(
        "chapterTitle"
    ).textContent =
        `Chapter ${chapter.chapter_no} — ${
            chapter.title || ""
        }`;


    document.getElementById(
        "chapterContent"
    ).style.display =
        "none";


    document.getElementById(
        "chapterLockContainer"
    ).innerHTML = `

        <div class="original-premium-lock">

            <div class="lock-icon">
                🔒
            </div>

            <h2>
                Premium Original
            </h2>

            <p>
                This chapter is part of
                MyLikith Originals Premium content.
            </p>

            <p>
                Premium access is required
                to continue reading.
            </p>

            <a href="premium.html">
                ✨ Become Premium
            </a>

        </div>

    `;


    document.getElementById(
        "backToOriginalBtn"
    ).onclick = () => {

        window.location.href =
            `original.html?id=${encodeURIComponent(
                chapter.original_id
            )}`;

    };

}


/* =========================================================
   READING PROGRESS
========================================================= */

function setupReadingProgress() {

    window.addEventListener(
        "scroll",
        () => {

            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            if (height <= 0) {
                return;
            }

            const scroll =
                window.scrollY;

            const percentage =
                Math.min(
                    100,
                    Math.max(
                        0,
                        (scroll / height) * 100
                    )
                );


            const bar =
                document.getElementById(
                    "progressBar"
                );

            if (bar) {

                bar.style.width =
                    `${percentage}%`;

            }


            const badge =
                document.getElementById(
                    "readingProgress"
                );

            if (badge) {

                badge.textContent =
                    `${Math.round(
                        percentage
                    )}%`;

            }

        }
    );

}


/* =========================================================
   HELPERS
========================================================= */

function formatContent(
    content
) {

    if (!content) {

        return `
            <p>
                This chapter has no content yet.
            </p>
        `;

    }

    return escapeHTML(
        content
    ).replace(
        /\n/g,
        "<br><br>"
    );

}


function escapeHTML(
    value
) {

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


function showError(
    message
) {

    document.querySelector(
        ".original-reader"
    ).innerHTML = `

        <div class="original-error"
             style="margin-top:120px;">

            <h2>
                MyLikith Originals
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}