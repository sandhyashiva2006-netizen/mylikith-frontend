const API = "https://mylikith-backend.onrender.com";

const params = new URLSearchParams(window.location.search);
const classicId = params.get("id");

const classicTitle = document.getElementById("classicTitle");
const classicAuthor = document.getElementById("classicAuthor");
const classicLanguage = document.getElementById("classicLanguage");
const classicSubtitle = document.getElementById("classicSubtitle");

const chaptersList = document.getElementById("chaptersList");
const chapterMessage = document.getElementById("chapterMessage");

const formSection = document.getElementById("chapterFormSection");
const form = document.getElementById("chapterForm");
const formTitle = document.getElementById("chapterFormTitle");

const chapterId = document.getElementById("chapterId");
const chapterNumber = document.getElementById("chapterNumber");
const chapterTitle = document.getElementById("chapterTitle");
const chapterContent = document.getElementById("chapterContent");

const addChapterBtn = document.getElementById("addChapterBtn");
const closeChapterForm =
    document.getElementById("closeChapterForm");
const cancelChapterBtn =
    document.getElementById("cancelChapterBtn");


/* =========================================================
   VALIDATE CLASSIC ID
========================================================= */

if (!classicId) {

    showMessage(
        "Classic ID is missing.",
        "error"
    );

    chaptersList.innerHTML = `
        <div class="classics-error">

            <h3>
                Invalid Classic
            </h3>

            <p>
                No Classic ID was provided.
            </p>

            <a
                href="admin-classics.html"
                class="classics-primary-btn"
            >
                Back to Classics
            </a>

        </div>
    `;

} else {

    loadClassic();
    loadChapters();

}


/* =========================================================
   LOAD CLASSIC
========================================================= */

async function loadClassic() {

    try {

        const response = await adminFetch(
            `${API}/api/admin/classics/${classicId}`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load Classic."
            );

        }

        const classic =
            data.classic || data;


        classicTitle.textContent =
            classic.title || "Untitled Classic";

        classicAuthor.textContent =
            classic.author_name || "Unknown Author";

        classicLanguage.textContent =
            classic.language || "Unknown Language";

        classicSubtitle.textContent =
            `Managing chapters for ${classic.title || "Classic"}`;


        const info =
            document.getElementById("classicInfo");


        if (
            classic.cover_image &&
            info
        ) {

            const placeholder =
                info.querySelector(
                    ".classic-chapters-cover-placeholder"
                );

            if (placeholder) {

                const image =
                    document.createElement("img");

                image.src =
                    classic.cover_image;

                image.alt =
                    classic.title || "Classic";

                image.className =
                    "classic-chapters-cover";

                image.onerror = function () {

                    this.replaceWith(
                        createCoverPlaceholder()
                    );

                };

                placeholder.replaceWith(image);

            }

        }


    } catch (error) {

        console.error(
            "Load Classic error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to load Classic.",
            "error"
        );

    }

}


/* =========================================================
   LOAD CHAPTERS
========================================================= */

async function loadChapters() {

    chaptersList.innerHTML = `
        <div class="classics-loading">

            <div class="classics-spinner"></div>

            <p>
                Loading chapters...
            </p>

        </div>
    `;


    try {

        const response = await adminFetch(
            `${API}/api/admin/classics/${classicId}/chapters`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load chapters."
            );

        }

        const chapters =
            Array.isArray(data)
                ? data
                : data.chapters;


        renderChapters(
            Array.isArray(chapters)
                ? chapters
                : []
        );


    } catch (error) {

        console.error(
            "Load chapters error:",
            error
        );

        chaptersList.innerHTML = `
            <div class="classics-error">

                <h3>
                    Unable to load chapters
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <button
                    type="button"
                    class="classics-primary-btn"
                    onclick="loadChapters()"
                >
                    Try Again
                </button>

            </div>
        `;

    }

}


/* =========================================================
   RENDER CHAPTERS
========================================================= */

function renderChapters(chapters) {

    chaptersList.innerHTML = "";


    if (!chapters.length) {

        chaptersList.innerHTML = `
            <div class="classics-empty">

                <div class="classics-empty-icon">
                    📝
                </div>

                <h3>
                    No Chapters Yet
                </h3>

                <p>
                    Add the first chapter of this Classic.
                </p>

            </div>
        `;

        return;

    }


    chapters.forEach(chapter => {

        const card =
            document.createElement("article");

        card.className =
            "chapter-admin-card";


        const preview =
            truncate(
                stripHTML(
                    chapter.content || ""
                ),
                180
            );


        card.innerHTML = `

            <div class="chapter-number">
                ${Number(chapter.chapter_number)}
            </div>


            <div class="chapter-admin-main">

                <h3>
                    ${escapeHTML(
                        chapter.title ||
                        `Chapter ${chapter.chapter_number}`
                    )}
                </h3>

                <p>
                    ${escapeHTML(preview)}
                </p>

            </div>


            <div class="chapter-admin-actions">

                <button
                    type="button"
                    class="classics-secondary-btn"
                    onclick="editChapter(${chapter.id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="classics-danger-btn"
                    onclick="deleteChapter(
                        ${chapter.id},
                        '${escapeJS(
                            chapter.title ||
                            `Chapter ${chapter.chapter_number}`
                        )}'
                    )"
                >
                    Delete
                </button>

            </div>

        `;


        chaptersList.appendChild(card);

    });

}


/* =========================================================
   OPEN ADD FORM
========================================================= */

function openAddChapterForm() {

    form.reset();

    chapterId.value =
        "";

    const nextNumber =
        getNextChapterNumber();

    chapterNumber.value =
        nextNumber;

    formTitle.textContent =
        "Add Chapter";

    formSection.hidden =
        false;

    chapterContent.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   GET NEXT CHAPTER NUMBER
========================================================= */

function getNextChapterNumber() {

    const cards =
        document.querySelectorAll(
            ".chapter-number"
        );

    let highest = 0;

    cards.forEach(card => {

        const number =
            Number(
                card.textContent.trim()
            );

        if (
            Number.isFinite(number) &&
            number > highest
        ) {

            highest = number;

        }

    });

    return highest + 1;

}


/* =========================================================
   EDIT CHAPTER
========================================================= */

async function editChapter(id) {

    try {

        const response = await adminFetch(
            `${API}/api/admin/classics/${classicId}/chapters`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load chapters."
            );

        }

        const chapters =
            Array.isArray(data)
                ? data
                : data.chapters;


        const chapter =
            chapters.find(
                item =>
                    Number(item.id) === Number(id)
            );


        if (!chapter) {

            throw new Error(
                "Chapter not found."
            );

        }


        chapterId.value =
            chapter.id;

        chapterNumber.value =
            chapter.chapter_number;

        chapterTitle.value =
            chapter.title || "";

        chapterContent.value =
            chapter.content || "";


        formTitle.textContent =
            "Edit Chapter";

        formSection.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Edit chapter error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to load chapter.",
            "error"
        );

    }

}


/* =========================================================
   SAVE CHAPTER
========================================================= */

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const id =
            chapterId.value.trim();

        const number =
            Number(
                chapterNumber.value
            );

        const title =
            chapterTitle.value.trim();

        const content =
            chapterContent.value.trim();


        if (
            !number ||
            number < 1
        ) {

            showMessage(
                "Chapter number must be at least 1.",
                "error"
            );

            return;

        }


        if (!content) {

            showMessage(
                "Chapter content is required.",
                "error"
            );

            return;

        }


        const submitBtn =
            form.querySelector(
                'button[type="submit"]'
            );


        submitBtn.disabled =
            true;

        submitBtn.textContent =
            id
                ? "Updating..."
                : "Saving...";


        try {

            const url =
                id
                    ? `${API}/api/admin/classics/${classicId}/chapters/${id}`
                    : `${API}/api/admin/classics/${classicId}/chapters`;


            const response =
                await adminFetch(
                    url,
                    {

                        method:
                            id
                                ? "PUT"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                chapter_number:
                                    number,

                                title:
                                    title ||
                                    `Chapter ${number}`,

                                content

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to save chapter."
                );

            }


            showMessage(
                id
                    ? "Chapter updated successfully."
                    : "Chapter created successfully.",
                "success"
            );


            closeForm();

            await loadChapters();


        } catch (error) {

            console.error(
                "Save chapter error:",
                error
            );

            showMessage(
                error.message ||
                "Unable to save chapter.",
                "error"
            );

        } finally {

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Save Chapter";

        }

    }
);


/* =========================================================
   DELETE CHAPTER
========================================================= */

async function deleteChapter(id, title) {

    const confirmed =
        confirm(
            `Delete "${title}"?\n\n` +
            "This action cannot be undone."
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await adminFetch(
                `${API}/api/admin/classics/${classicId}/chapters/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete chapter."
            );

        }


        showMessage(
            "Chapter deleted successfully.",
            "success"
        );


        await loadChapters();


    } catch (error) {

        console.error(
            "Delete chapter error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to delete chapter.",
            "error"
        );

    }

}


/* =========================================================
   CLOSE FORM
========================================================= */

function closeForm() {

    form.reset();

    chapterId.value =
        "";

    formTitle.textContent =
        "Add Chapter";

    formSection.hidden =
        true;

}


/* =========================================================
   COVER PLACEHOLDER
========================================================= */

function createCoverPlaceholder() {

    const placeholder =
        document.createElement("div");

    placeholder.className =
        "classic-chapters-cover-placeholder";

    placeholder.textContent =
        "📖";

    return placeholder;

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message, type) {

    chapterMessage.textContent =
        message;

    chapterMessage.className =
        `classics-message ${type}`;


    setTimeout(() => {

        chapterMessage.textContent =
            "";

        chapterMessage.className =
            "classics-message";

    }, 4000);

}


/* =========================================================
   HELPERS
========================================================= */

function stripHTML(value) {

    const temp =
        document.createElement("div");

    temp.innerHTML =
        value || "";

    return temp.textContent ||
        temp.innerText ||
        "";

}


function truncate(value, length) {

    const text =
        String(value || "");

    if (text.length <= length) {
        return text;
    }

    return text.substring(0, length) + "...";

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeJS(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (addChapterBtn) {

    addChapterBtn.addEventListener(
        "click",
        openAddChapterForm
    );

}


if (closeChapterForm) {

    closeChapterForm.addEventListener(
        "click",
        closeForm
    );

}


if (cancelChapterBtn) {

    cancelChapterBtn.addEventListener(
        "click",
        closeForm
    );

}