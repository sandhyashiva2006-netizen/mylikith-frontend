const API = "https://mylikith-backend.onrender.com";

const params = new URLSearchParams(window.location.search);
const classicId = params.get("id");

let classic = null;
let chapters = [];
let currentChapterIndex = -1;

let savedProgress = null;
let progressSaveTimer = null;

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

    loadChapters();

    loadReadingProgress();

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
        localStorage.getItem("token");

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
            "Unable to load Classic reading progress:",
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

    selectChapter(startIndex);

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

function selectChapter(index) {

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

    saveReadingProgress();

    document.title =
        `${chapter.title || `Chapter ${chapter.chapter_number}`} — ${classic?.title || "Classic"} | MyLikith`;


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
   SAVE READING PROGRESS
========================================================= */

async function saveReadingProgress() {

    const token =
        localStorage.getItem("token");

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

    clearTimeout(progressSaveTimer);

    progressSaveTimer =
        setTimeout(async () => {

            const chapter =
                chapters[currentChapterIndex];

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

                                progress_percent: 0
                            })
                        }
                    );

                if (!response.ok) {

                    console.warn(
                        "Unable to save Classic progress."
                    );

                }

            } catch (error) {

                console.warn(
                    "Classic progress save error:",
                    error
                );

            }

        }, 500);

}

/* =========================================================
   PREVIOUS / NEXT
========================================================= */

if (previousChapter) {

    previousChapter.addEventListener(
        "click",
        () => {

            if (
                currentChapterIndex > 0
            ) {

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
        () => {

            if (
                currentChapterIndex <
                chapters.length - 1
            ) {

                selectChapter(
                    currentChapterIndex + 1
                );

            }

        }
    );

}


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