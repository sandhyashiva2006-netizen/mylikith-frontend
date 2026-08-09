const API = "https://mylikith-backend.onrender.com";

const params = new URLSearchParams(window.location.search);
const classicId = params.get("id");

const bookmarkedChapterId =
    params.get("chapter");

let classic = null;
let chapters = [];
let currentChapterIndex = -1;

let savedProgress = null;
let progressSaveTimer = null;
let restoringProgress = false;


/* =========================================================
   ELEMENTS
========================================================= */

const classicCover =
    document.getElementById("classicCover");

const classicLanguage =
    document.getElementById("classicLanguage");

const classicTitle =
    document.getElementById("classicTitle");

const classicAuthor =
    document.getElementById("classicAuthor");

const classicDescription =
    document.getElementById("classicDescription");

const classicYear =
    document.getElementById("classicYear");

const classicCategory =
    document.getElementById("classicCategory");

const classicLicense =
    document.getElementById("classicLicense");

const chaptersList =
    document.getElementById("chaptersList");

const chapterTitle =
    document.getElementById("chapterTitle");

const chapterContent =
    document.getElementById("chapterContent");

const chapterNavigation =
    document.getElementById("chapterNavigation");

const previousChapter =
    document.getElementById("previousChapter");

const nextChapter =
    document.getElementById("nextChapter");

const chapterPosition =
    document.getElementById("chapterPosition");

const classicBookmarkBtn =
    document.getElementById(
        "classicBookmarkBtn"
    );

let currentChapterBookmarked = false;


/* =========================================================
   VALIDATE ID
========================================================= */

if (!classicId) {

    showPageError(
        "Classic not found.",
        "No Classic ID was provided."
    );

} else {

    loadClassic();

    loadReadingProgress()
        .finally(() => {
            loadChapters();
        });

    registerView();

}


/* =========================================================
   LOAD CLASSIC
========================================================= */

async function loadClassic() {

    try {

        const response = await fetch(
            `${API}/api/classics/${classicId}`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load Classic."
            );

        }

        classic =
            data.classic || data;

        renderClassic();


    } catch (error) {

        console.error(
            "Classic loading error:",
            error
        );

        showPageError(
            "Unable to load Classic.",
            error.message
        );

    }

}


/* =========================================================
   RENDER CLASSIC
========================================================= */

function renderClassic() {

    if (!classic) {
        return;
    }


    document.title =
        `${classic.title} - MyLikith Classics`;


    classicTitle.textContent =
        classic.title || "Untitled Classic";


    classicAuthor.textContent =
        classic.author_name ||
        "Unknown Author";


    classicLanguage.textContent =
        classic.language ||
        "Unknown Language";


    classicDescription.textContent =
        classic.description ||
        "A timeless work from the MyLikith Classics collection.";


    if (classic.publication_year) {

        classicYear.textContent =
            `📅 ${classic.publication_year}`;

    } else {

        classicYear.textContent =
            "";

    }


    if (classic.category) {

        classicCategory.textContent =
            `📚 ${classic.category}`;

    } else {

        classicCategory.textContent =
            "";

    }


    if (classic.license) {

        classicLicense.textContent =
            `✓ ${classic.license}`;

    } else {

        classicLicense.textContent =
            "";

    }


    if (classic.cover_image) {

        classicCover.innerHTML = `
            <img
                src="${escapeAttribute(classic.cover_image)}"
                alt="${escapeAttribute(classic.title || "Classic")}"
            >
        `;


        const image =
            classicCover.querySelector("img");


        image.addEventListener(
            "error",
            () => {

                classicCover.innerHTML =
                    "📖";

            }
        );

    }

}

/* =========================================================
   LOAD READING PROGRESS
========================================================= */

async function loadReadingProgress() {

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            `${API}/api/classic-progress/${classicId}`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        if (
            data.success &&
            data.progress
        ) {

            savedProgress =
                data.progress;

        }

    } catch (error) {

        console.warn(
            "Unable to load Classic progress:",
            error
        );

    }

}

/* =========================================================
   LOAD CHAPTERS
========================================================= */

async function loadChapters() {

    chaptersList.innerHTML = `
        <div class="classic-reader-loading">
            Loading chapters...
        </div>
    `;


    try {

        const response = await fetch(
            `${API}/api/classics/${classicId}/chapters`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load chapters."
            );

        }


        chapters =
            Array.isArray(data)
                ? data
                : data.chapters;


        if (!Array.isArray(chapters)) {

            chapters = [];

        }


        renderChapterList();


if (chapters.length > 0) {

    let startIndex = 0;

    if (savedProgress) {

        const savedChapterId =
            Number(savedProgress.chapter_id);

        const savedIndex =
            chapters.findIndex(
                chapter =>
                    Number(chapter.id) ===
                    savedChapterId
            );

        if (savedIndex >= 0) {

            startIndex = savedIndex;

        } else if (
            savedProgress.chapter_number
        ) {

            const numberIndex =
                chapters.findIndex(
                    chapter =>
                        Number(
                            chapter.chapter_number
                        ) ===
                        Number(
                            savedProgress.chapter_number
                        )
                );

            if (numberIndex >= 0) {

                startIndex = numberIndex;

            }

        }

    }

    restoringProgress = true;

selectChapter(
    startIndex,
    false
);

restoringProgress = false;

} else {

            chaptersList.innerHTML = `
                <div class="classic-reader-no-chapters">

                    <div>
                        📝
                    </div>

                    <p>
                        No chapters available yet.
                    </p>

                </div>
            `;

        }


    } catch (error) {

        console.error(
            "Chapter loading error:",
            error
        );


        chaptersList.innerHTML = `
            <div class="classic-reader-error">

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>
        `;

    }

}

/* =========================================================
   OPEN BOOKMARKED CHAPTER
   Explicit bookmark URL takes priority over progress
========================================================= */

if (bookmarkedChapterId) {

    const bookmarkedId =
        Number(bookmarkedChapterId);


    const bookmarkedIndex =
        chapters.findIndex(
            chapter =>
                Number(chapter.id) ===
                bookmarkedId
        );


    if (bookmarkedIndex >= 0) {

        startIndex =
            bookmarkedIndex;

    }

}

/* =========================================================
   RENDER CHAPTER LIST
========================================================= */

function renderChapterList() {

    chaptersList.innerHTML = "";


    chapters.forEach(
        (chapter, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "classic-chapter-item";


            button.innerHTML = `

                <span class="classic-chapter-number">
                    ${Number(chapter.chapter_number)}
                </span>

                <span class="classic-chapter-item-title">
                    ${escapeHTML(
                        chapter.title ||
                        `Chapter ${chapter.chapter_number}`
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                () => selectChapter(index)
            );


            chaptersList.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   SELECT CHAPTER
========================================================= */

function selectChapter(index, saveProgress = true) {

    if (
        index < 0 ||
        index >= chapters.length
    ) {
        return;
    }


    currentChapterIndex =
        index;


    const chapter =
        chapters[index];


    chapterTitle.textContent =
        chapter.title ||
        `Chapter ${chapter.chapter_number}`;


    chapterContent.innerHTML =
        formatChapterContent(
            chapter.content || ""
        );


    chapterNavigation.hidden =
        false;


    chapterPosition.textContent =
        `${index + 1} / ${chapters.length}`;


    previousChapter.disabled =
        index === 0;


    nextChapter.disabled =
        index === chapters.length - 1;


    updateActiveChapter();

currentChapterBookmarked = false;

updateClassicBookmarkButton();

loadClassicBookmarkStatus();

    document.title =
        `${chapter.title || `Chapter ${chapter.chapter_number}`} — ${classic?.title || "Classic"} | MyLikith`;


    if (
        saveProgress &&
        !restoringProgress
    ) {

        saveCurrentChapterProgress();

    }


    if (window.innerWidth < 900) {

        const readerContent =
            document.querySelector(
                ".classic-reader-content"
            );


        if (readerContent) {

            readerContent.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }

}


/* =========================================================
   ACTIVE CHAPTER
========================================================= */

function updateActiveChapter() {

    const items =
        document.querySelectorAll(
            ".classic-chapter-item"
        );


    items.forEach(
        (item, index) => {

            item.classList.toggle(
                "active",
                index === currentChapterIndex
            );

        }
    );

}

/* =========================================================
   CLASSIC BOOKMARK
========================================================= */

async function loadClassicBookmarkStatus() {

    if (
        !classicBookmarkBtn ||
        !classicId ||
        currentChapterIndex < 0 ||
        !chapters[currentChapterIndex]
    ) {
        return;
    }


    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");


    if (!token) {

        currentChapterBookmarked = false;

        updateClassicBookmarkButton();

        return;
    }


    const chapter =
        chapters[currentChapterIndex];


    try {

        const response =
            await fetch(
                `${API}/api/writers/classic-bookmark/status/${classicId}/${chapter.id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            currentChapterBookmarked = false;

            updateClassicBookmarkButton();

            return;
        }


        const data =
            await response.json();


        currentChapterBookmarked =
            data.success &&
            data.bookmarked === true;


        updateClassicBookmarkButton();


    } catch (error) {

        console.warn(
            "Unable to load Classic bookmark status:",
            error
        );


        currentChapterBookmarked = false;

        updateClassicBookmarkButton();

    }

}


/* ---------------------------------------------------------
   UPDATE BOOKMARK BUTTON
--------------------------------------------------------- */

function updateClassicBookmarkButton() {

    if (!classicBookmarkBtn) {
        return;
    }


    if (
        currentChapterIndex < 0 ||
        !chapters[currentChapterIndex]
    ) {

        classicBookmarkBtn.hidden = true;

        return;
    }


    classicBookmarkBtn.hidden = false;


    if (currentChapterBookmarked) {

        classicBookmarkBtn.textContent =
            "🔖 Bookmarked";

        classicBookmarkBtn.classList.add(
            "bookmarked"
        );

        classicBookmarkBtn.setAttribute(
            "aria-label",
            "Remove bookmark"
        );

    } else {

        classicBookmarkBtn.textContent =
            "🔖 Bookmark";

        classicBookmarkBtn.classList.remove(
            "bookmarked"
        );

        classicBookmarkBtn.setAttribute(
            "aria-label",
            "Bookmark chapter"
        );

    }

}


/* ---------------------------------------------------------
   TOGGLE BOOKMARK
--------------------------------------------------------- */

async function toggleClassicBookmark() {

    if (
        currentChapterIndex < 0 ||
        !chapters[currentChapterIndex]
    ) {
        return;
    }


    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");


    if (!token) {

        alert(
            "Please login to bookmark this chapter."
        );

        return;
    }


    const chapter =
        chapters[currentChapterIndex];


    const originalText =
        classicBookmarkBtn.textContent;


    classicBookmarkBtn.disabled = true;

    classicBookmarkBtn.textContent =
        "Saving...";


    try {

        const response =
            await fetch(
                `${API}/api/writers/classic-bookmark`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        classic_id:
                            Number(classicId),

                        chapter_id:
                            Number(chapter.id),

                        chapter_number:
                            Number(
                                chapter.chapter_number
                            )

                    })
                }
            );


        const data =
            await response.json();


        if (
            response.status === 401
        ) {

            alert(
                "Please login to bookmark this chapter."
            );

            return;
        }


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to update bookmark."
            );

        }


        currentChapterBookmarked =
            data.bookmarked === true;


        updateClassicBookmarkButton();


    } catch (error) {

        console.error(
            "Classic bookmark error:",
            error
        );


        classicBookmarkBtn.textContent =
            originalText;


        alert(
            error.message ||
            "Unable to update bookmark."
        );

    } finally {

        classicBookmarkBtn.disabled = false;

        updateClassicBookmarkButton();

    }

}

if (classicBookmarkBtn) {

    classicBookmarkBtn.addEventListener(
        "click",
        toggleClassicBookmark
    );

}

/* =========================================================
   FORMAT CONTENT
========================================================= */

function formatChapterContent(content) {

    const safeContent =
        escapeHTML(content);


    return safeContent
        .split(/\n{2,}/)
        .map(paragraph => {

            const cleaned =
                paragraph
                    .replace(/\n/g, "<br>");

            return `
                <p>
                    ${cleaned}
                </p>
            `;

        })
        .join("");

}

/* =========================================================
   CLASSIC READING PROGRESS
========================================================= */


/* ---------------------------------------------------------
   GET CURRENT CHAPTER SCROLL PROGRESS
--------------------------------------------------------- */

function getChapterScrollProgress() {

    const content =
        document.getElementById(
            "chapterContent"
        );


    if (!content) {
        return 0;
    }


    const contentTop =
        content.getBoundingClientRect().top +
        window.scrollY;


    const contentHeight =
        content.scrollHeight;


    const viewportHeight =
        window.innerHeight;


    const maxScroll =
        contentHeight -
        viewportHeight;


    if (maxScroll <= 0) {

        return 100;

    }


    const currentScroll =
        window.scrollY -
        contentTop;


    const percentage =
        (
            currentScroll /
            maxScroll
        ) * 100;


    return Math.min(
        100,
        Math.max(
            0,
            Math.round(percentage)
        )
    );

}


/* ---------------------------------------------------------
   CALCULATE OVERALL CLASSIC PROGRESS
--------------------------------------------------------- */

function calculateOverallProgress(
    chapterProgress
) {

    if (
        chapters.length === 0 ||
        currentChapterIndex < 0
    ) {

        return 0;

    }


    const completedChapters =
        currentChapterIndex;


    const currentProgress =
        Math.min(
            100,
            Math.max(
                0,
                Number(chapterProgress) || 0
            )
        );


    const totalProgress =
        (
            completedChapters +
            (currentProgress / 100)
        ) /
        chapters.length *
        100;


    return Math.min(
        100,
        Math.max(
            0,
            Math.round(totalProgress)
        )
    );

}


/* ---------------------------------------------------------
   SAVE CURRENT CHAPTER PROGRESS
--------------------------------------------------------- */

async function saveCurrentChapterProgress(
    forceComplete = false
) {

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

    if (!token) {
        return;
    }

    if (
        !classicId ||
        currentChapterIndex < 0 ||
        !chapters[currentChapterIndex]
    ) {
        return;
    }

    const chapter =
        chapters[currentChapterIndex];

    const chapterProgress =
        forceComplete
            ? 100
            : getChapterScrollProgress();

    const overallProgress =
        calculateOverallProgress(
            chapterProgress
        );

    const saveRequest = async () => {

        try {

            const response =
                await fetch(
                    `${API}/api/classic-progress/${classicId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            chapter_id:
                                chapter.id,

                            chapter_number:
                                chapter.chapter_number,

                            progress_percent:
                                overallProgress

                        })
                    }
                );


            if (!response.ok) {

                console.warn(
                    "Unable to save Classic progress."
                );

                return false;

            }


            const data =
                await response.json();


            if (
                data.success &&
                data.progress
            ) {

                savedProgress =
                    data.progress;

            }


            return true;

        } catch (error) {

            console.warn(
                "Classic progress save error:",
                error
            );

            return false;

        }

    };


    /* -----------------------------------------------------
       FORCE COMPLETE
       Used by Previous / Next
    ----------------------------------------------------- */

    if (forceComplete) {

        clearTimeout(
            progressSaveTimer
        );

        return await saveRequest();

    }


    /* -----------------------------------------------------
       NORMAL AUTO SAVE
    ----------------------------------------------------- */

    clearTimeout(
        progressSaveTimer
    );


    progressSaveTimer =
        setTimeout(
            () => {
                saveRequest();
            },
            1000
        );

}



/* =========================================================
   PREVIOUS / NEXT
========================================================= */

if (previousChapter) {

    previousChapter.addEventListener(
        "click",
        async () => {

            if (
                currentChapterIndex > 0
            ) {

                await saveCurrentChapterProgress(
                    true
                );


                selectChapter(
                    currentChapterIndex - 1
                );

            }

        }
    );

}


if (nextChapter) {

    nextChapter.addEventListener(
        "click",
        async () => {

            if (
                currentChapterIndex <
                chapters.length - 1
            ) {

                await saveCurrentChapterProgress(
                    true
                );


                selectChapter(
                    currentChapterIndex + 1
                );

            }

        }
    );

}

/* =========================================================
   AUTO SAVE WHILE READING
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (
            currentChapterIndex < 0 ||
            restoringProgress
        ) {

            return;

        }


        clearTimeout(
            progressSaveTimer
        );


        progressSaveTimer =
            setTimeout(
                () => {

                    saveCurrentChapterProgress();

                },
                1000
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   REGISTER VIEW
========================================================= */

async function registerView() {

    try {

        await fetch(
            `${API}/api/classics/${classicId}/view`,
            {
                method: "POST"
            }
        );

    } catch (error) {

        console.warn(
            "Unable to register Classic view:",
            error
        );

    }

}


/* =========================================================
   PAGE ERROR
========================================================= */

function showPageError(title, message) {

    const main =
        document.querySelector(
            ".classic-reader-page"
        );


    if (!main) {
        return;
    }


    main.innerHTML = `

        <div class="classic-reader-page-error">

            <div class="classic-reader-error-icon">
                📖
            </div>

            <h1>
                ${escapeHTML(title)}
            </h1>

            <p>
                ${escapeHTML(message || "")}
            </p>

            <a
                href="classics.html"
                class="classic-back-btn"
            >
                ← Back to Classics
            </a>

        </div>

    `;

}


/* =========================================================
   ESCAPE HELPERS
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}

