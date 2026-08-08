const API = "https://mylikith-backend.onrender.com";

const formSection = document.getElementById("classicFormSection");
const form = document.getElementById("classicForm");
const list = document.getElementById("classicsList");
const messageBox = document.getElementById("classicsMessage");

const addBtn = document.getElementById("addClassicBtn");
const closeBtn = document.getElementById("closeClassicForm");
const cancelBtn = document.getElementById("cancelClassicBtn");

const formTitle = document.getElementById("classicFormTitle");

const fields = {
    id: document.getElementById("classicId"),
    title: document.getElementById("classicTitle"),
    author: document.getElementById("classicAuthor"),
    language: document.getElementById("classicLanguage"),
    originalLanguage: document.getElementById("classicOriginalLanguage"),
    year: document.getElementById("classicYear"),
    category: document.getElementById("classicCategory"),
    source: document.getElementById("classicSource"),
    sourceUrl: document.getElementById("classicSourceUrl"),
    cover: document.getElementById("classicCover"),
    license: document.getElementById("classicLicense"),
    description: document.getElementById("classicDescription"),
    featured: document.getElementById("classicFeatured"),
    published: document.getElementById("classicPublished")
};


/* =========================================================
   LOAD CLASSICS
========================================================= */

async function loadClassics() {

    list.innerHTML = `
        <div class="classics-loading">

            <div class="classics-spinner"></div>

            <p>
                Loading Classics...
            </p>

        </div>
    `;

    try {

        const response = await adminFetch(
            `${API}/api/admin/classics`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load Classics."
            );

        }

        renderClassics(
            Array.isArray(data)
                ? data
                : data.classics
        );

    } catch (error) {

        console.error(
            "Load Classics error:",
            error
        );

        list.innerHTML = `
            <div class="classics-error">

                <h3>
                    Unable to load Classics
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <button
                    class="classics-primary-btn"
                    onclick="loadClassics()"
                >
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================================================
   RENDER CLASSICS
========================================================= */

function renderClassics(classics) {

    list.innerHTML = "";

    if (!Array.isArray(classics) || !classics.length) {

        list.innerHTML = `
            <div class="classics-empty">

                <div class="classics-empty-icon">
                    📖
                </div>

                <h3>
                    No Classics Yet
                </h3>

                <p>
                    Add your first public-domain classic.
                </p>

                <button
                    class="classics-primary-btn"
                    onclick="openAddForm()"
                >
                    + Add Classic
                </button>

            </div>
        `;

        return;
    }


    classics.forEach(classic => {

        const card =
            document.createElement("article");

        card.className =
            "classic-admin-card";


        const cover = classic.cover_image
            ? `
                <img
                    src="${escapeAttribute(classic.cover_image)}"
                    alt="${escapeAttribute(classic.title)}"
                    class="classic-admin-cover"
                >
              `
            : `
                <div class="classic-admin-cover-placeholder">
                    📖
                </div>
              `;


        card.innerHTML = `

            <div class="classic-admin-card-top">

                ${cover}

                <div class="classic-admin-main">

                    <div class="classic-admin-title-row">

                        <div>

                            <h3>
                                ${escapeHTML(classic.title)}
                            </h3>

                            <p>
                                ${escapeHTML(classic.author_name)}
                            </p>

                        </div>

                        ${
                            classic.is_featured
                                ? `
                                    <span class="classic-badge featured">
                                        Featured
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    <div class="classic-meta">

                        <span>
                            🌐 ${escapeHTML(classic.language || "Unknown")}
                        </span>

                        ${
                            classic.publication_year
                                ? `
                                    <span>
                                        📅 ${classic.publication_year}
                                    </span>
                                  `
                                : ""
                        }

                        ${
                            classic.category
                                ? `
                                    <span>
                                        📚 ${escapeHTML(classic.category)}
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    <div class="classic-status-row">

                        <span
                            class="classic-badge ${
                                classic.is_published
                                    ? "published"
                                    : "unpublished"
                            }"
                        >
                            ${
                                classic.is_published
                                    ? "Published"
                                    : "Unpublished"
                            }
                        </span>

                        <span class="classic-views">
                            👁 ${Number(classic.view_count || 0)}
                        </span>

                    </div>

                </div>

            </div>


            ${
                classic.description
                    ? `
                        <p class="classic-admin-description">
                            ${escapeHTML(
                                truncate(
                                    classic.description,
                                    180
                                )
                            )}
                        </p>
                      `
                    : ""
            }


            <div class="classic-source">

                <strong>
                    Source:
                </strong>

                <span>
                    ${escapeHTML(
                        classic.source_name ||
                        "Not specified"
                    )}
                </span>

            </div>


            <div class="classic-admin-actions">

                <button
                    type="button"
                    class="classics-secondary-btn"
                    onclick="editClassic(${classic.id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="classics-secondary-btn"
                    onclick="manageChapters(${classic.id})"
                >
                    Chapters
                </button>

                <button
                    type="button"
                    class="classics-danger-btn"
                    onclick="deleteClassic(
                        ${classic.id},
                        '${escapeJS(classic.title)}'
                    )"
                >
                    Delete
                </button>

            </div>

        `;


        list.appendChild(card);

    });

}


/* =========================================================
   OPEN ADD FORM
========================================================= */

function openAddForm() {

    form.reset();

    fields.id.value = "";

    fields.language.value =
        "English";

    fields.license.value =
        "Public Domain";

    fields.published.checked =
        true;

    fields.featured.checked =
        false;

    formTitle.textContent =
        "Add Classic";

    formSection.hidden =
        false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   OPEN EDIT FORM
========================================================= */

async function editClassic(id) {

    try {

        const response = await adminFetch(
            `${API}/api/admin/classics/${id}`
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


        fields.id.value =
            classic.id || "";

        fields.title.value =
            classic.title || "";

        fields.author.value =
            classic.author_name || "";

        fields.language.value =
            classic.language || "English";

        fields.originalLanguage.value =
            classic.original_language || "";

        fields.year.value =
            classic.publication_year || "";

        fields.category.value =
            classic.category || "";

        fields.source.value =
            classic.source_name || "";

        fields.sourceUrl.value =
            classic.source_url || "";

        fields.cover.value =
            classic.cover_image || "";

        fields.license.value =
            classic.license || "Public Domain";

        fields.description.value =
            classic.description || "";

        fields.featured.checked =
            Boolean(classic.is_featured);

        fields.published.checked =
            Boolean(classic.is_published);


        formTitle.textContent =
            "Edit Classic";

        formSection.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Edit Classic error:",
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
   SAVE CLASSIC
========================================================= */

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const id =
            fields.id.value.trim();


        const payload = {

            title:
                fields.title.value.trim(),

            author_name:
                fields.author.value.trim(),

            original_language:
                fields.originalLanguage.value.trim(),

            language:
                fields.language.value.trim(),

            description:
                fields.description.value.trim(),

            cover_image:
                fields.cover.value.trim(),

            publication_year:
                fields.year.value
                    ? Number(fields.year.value)
                    : null,

            source_name:
                fields.source.value.trim(),

            source_url:
                fields.sourceUrl.value.trim(),

            license:
                fields.license.value.trim() ||
                "Public Domain",

            category:
                fields.category.value.trim(),

            is_featured:
                fields.featured.checked,

            is_published:
                fields.published.checked

        };


        if (
            !payload.title ||
            !payload.author_name ||
            !payload.language
        ) {

            showMessage(
                "Title, author and language are required.",
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

            const response =
                await adminFetch(

                    id
                        ? `${API}/api/admin/classics/${id}`
                        : `${API}/api/admin/classics`,

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
                            JSON.stringify(payload)

                    }

                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to save Classic."
                );

            }


            showMessage(
                id
                    ? "Classic updated successfully."
                    : "Classic created successfully.",
                "success"
            );


            closeForm();

            await loadClassics();


        } catch (error) {

            console.error(
                "Save Classic error:",
                error
            );

            showMessage(
                error.message ||
                "Unable to save Classic.",
                "error"
            );

        } finally {

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Save Classic";

        }

    }
);


/* =========================================================
   DELETE CLASSIC
========================================================= */

async function deleteClassic(id, title) {

    const confirmed =
        confirm(
            `Delete "${title}"?\n\n` +
            "This will also permanently delete all chapters " +
            "belonging to this Classic."
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await adminFetch(
                `${API}/api/admin/classics/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete Classic."
            );

        }


        showMessage(
            "Classic deleted successfully.",
            "success"
        );


        await loadClassics();


    } catch (error) {

        console.error(
            "Delete Classic error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to delete Classic.",
            "error"
        );

    }

}


/* =========================================================
   CLOSE FORM
========================================================= */

function closeForm() {

    form.reset();

    fields.id.value =
        "";

    fields.language.value =
        "English";

    fields.license.value =
        "Public Domain";

    fields.published.checked =
        true;

    fields.featured.checked =
        false;

    formTitle.textContent =
        "Add Classic";

    formSection.hidden =
        true;

}


/* =========================================================
   CHAPTER MANAGEMENT
========================================================= */

function manageChapters(id) {

    window.location.href =
        `admin-classic-chapters.html?id=${id}`;

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message, type) {

    messageBox.textContent =
        message;

    messageBox.className =
        `classics-message ${type}`;


    setTimeout(() => {

        messageBox.textContent =
            "";

        messageBox.className =
            "classics-message";

    }, 4000);

}


/* =========================================================
   HELPERS
========================================================= */

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


function escapeAttribute(value) {

    return escapeHTML(value);

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

if (addBtn) {

    addBtn.addEventListener(
        "click",
        openAddForm
    );

}


if (closeBtn) {

    closeBtn.addEventListener(
        "click",
        closeForm
    );

}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeForm
    );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadClassics();