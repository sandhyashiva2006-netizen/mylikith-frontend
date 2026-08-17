const API = "https://mylikith-backend.onrender.com";

const formSection = document.getElementById("classicFormSection");
const form = document.getElementById("classicForm");
const list = document.getElementById("classicsList");
const messageBox = document.getElementById("classicsMessage");

const addBtn = document.getElementById("addClassicBtn");
const closeBtn = document.getElementById("closeClassicForm");
const cancelBtn = document.getElementById("cancelClassicBtn");

const formTitle = document.getElementById("classicFormTitle");

const classicImportUrl = document.getElementById("classicImportUrl");
const previewClassicImportBtn = document.getElementById("previewClassicImportBtn");
const classicImportPreview = document.getElementById("classicImportPreview");

let pendingClassicImport = null;

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
            Add your first public-domain classic using
            the button above.
        </p>

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
   CLASSICS IMPORTER
========================================================= */

async function previewClassicImport() {

    const sourceUrl = classicImportUrl.value.trim();

    if (!sourceUrl) {
        showMessage("Enter a source URL first.", "error");
        return;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(sourceUrl);
    } catch (_) {
        showMessage("Please enter a valid source URL.", "error");
        return;
    }

    if (!/^https?:$/.test(parsedUrl.protocol)) {
        showMessage("Only HTTP and HTTPS source URLs are supported.", "error");
        return;
    }

    previewClassicImportBtn.disabled = true;
    previewClassicImportBtn.textContent = "Fetching...";
    classicImportPreview.hidden = false;
    classicImportPreview.innerHTML = `
        <div class="classics-loading">
            <div class="classics-spinner"></div>
            <p>Fetching and detecting chapters...</p>
        </div>
    `;

    try {
        const response = await adminFetch(
            `${API}/api/admin/classics/import/preview`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ source_url: sourceUrl })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch this source.");
        }

        pendingClassicImport = {
            source: data.source,
            suggested: data.suggested || {},
            chapters: Array.isArray(data.chapters) ? data.chapters : []
        };

        renderClassicImportPreview(pendingClassicImport);

    } catch (error) {
        console.error("Classic importer preview error:", error);
        pendingClassicImport = null;
        classicImportPreview.innerHTML = `
            <div class="classics-error">
                <h3>Unable to import this source</h3>
                <p>${escapeHTML(error.message || "Unknown error")}</p>
            </div>
        `;
    } finally {
        previewClassicImportBtn.disabled = false;
        previewClassicImportBtn.textContent = "Fetch & Preview";
    }
}

function renderClassicImportPreview(importData) {

    const chapters = importData.chapters || [];
    const suggestedTitle = importData.suggested?.title || "";
    const suggestedDescription = importData.suggested?.description || "";
    const suggestedCover = importData.suggested?.cover_image || "assets/images/default-cover.png";
    const coverIsSource = Boolean(importData.suggested?.cover_image);

    classicImportPreview.innerHTML = `
        <div class="classic-import-summary">
            <div>
                <span class="classic-import-kicker">SOURCE READY</span>
                <h3>${escapeHTML(suggestedTitle || "Untitled Classic")}</h3>
                <p>${escapeHTML(importData.source?.name || "Unknown source")}</p>
            </div>
            <span class="classic-import-count">${chapters.length} chapters</span>
        </div>

        <div class="classic-import-cover-preview">
            <div class="classic-import-cover-frame">
                <img
                    src="${escapeAttribute(suggestedCover)}"
                    alt="${escapeAttribute(suggestedTitle || "Classic cover")}"
                    onerror="this.onerror=null;this.src='assets/images/default-cover.png';"
                >
            </div>
            <div class="classic-import-cover-info">
                <span class="classic-import-kicker">COVER</span>
                <h4>${coverIsSource ? "Source cover detected" : "Default MyLikith cover"}</h4>
                <p>${coverIsSource ? "A Gutenberg cover was found automatically and will be saved with this Classic." : "No source cover was detected. MyLikith will use the default Classics cover."}</p>
                <label for="importCoverImage">Cover image URL</label>
                <input id="importCoverImage" type="url" value="${escapeAttribute(suggestedCover)}">
            </div>
        </div>

        <div class="classic-import-fields">
            <div class="classic-field">
                <label for="importTitle">Title *</label>
                <input id="importTitle" type="text" value="${escapeAttribute(suggestedTitle)}">
            </div>
            <div class="classic-field">
                <label for="importAuthor">Author *</label>
                <input id="importAuthor" type="text" value="${escapeAttribute(importData.suggested?.author || "")}" placeholder="Enter author name">
            </div>
            <div class="classic-field">
                <label for="importLanguage">Language *</label>
                <input id="importLanguage" type="text" value="English">
            </div>
            <div class="classic-field">
                <label for="importOriginalLanguage">Original Language</label>
                <input id="importOriginalLanguage" type="text">
            </div>
            <div class="classic-field">
                <label for="importYear">Publication Year</label>
                <input id="importYear" type="number">
            </div>
            <div class="classic-field">
                <label for="importCategory">Category</label>
                <input id="importCategory" type="text" placeholder="Novel, Poetry, Drama...">
            </div>
            <div class="classic-field classic-full">
                <label for="importDescription">Description</label>
                <textarea id="importDescription" rows="4">${escapeHTML(suggestedDescription)}</textarea>
            </div>
        </div>

        <label class="classic-import-verification">
            <input type="checkbox" id="importPublicDomainVerified">
            <span>I have verified that this work and this edition are public domain or otherwise legally redistributable.</span>
        </label>

        <div class="classic-import-chapters">
            <h4>Detected Chapters</h4>
            <div class="classic-import-chapter-list">
                ${chapters.slice(0, 50).map((chapter, index) => `
                    <div class="classic-import-chapter-item">
                        <span>${index + 1}</span>
                        <div>
                            <strong>${escapeHTML(chapter.title || `Chapter ${index + 1}`)}</strong>
                            <small>${Number((chapter.content || "").length).toLocaleString()} characters</small>
                        </div>
                    </div>
                `).join("")}
            </div>
            ${chapters.length > 50 ? `<p class="classic-import-note">Showing the first 50 chapters. All ${chapters.length} chapters will be imported.</p>` : ""}
        </div>

        <div class="classic-import-actions">
            <button type="button" class="classics-secondary-btn" onclick="clearClassicImport()">Clear</button>
            <button type="button" class="classics-primary-btn" onclick="importPendingClassic()">Import Classic</button>
        </div>
    `;
}

async function importPendingClassic() {

    if (!pendingClassicImport) {
        showMessage("Fetch a source before importing.", "error");
        return;
    }

    const title = document.getElementById("importTitle")?.value.trim();
    const author = document.getElementById("importAuthor")?.value.trim();
    const language = document.getElementById("importLanguage")?.value.trim();
    const verified = document.getElementById("importPublicDomainVerified")?.checked;

    if (!title || !author || !language) {
        showMessage("Title, author and language are required.", "error");
        return;
    }

    if (!verified) {
        showMessage("Please verify the copyright status before importing.", "error");
        return;
    }

    const importButton = classicImportPreview.querySelector(".classic-import-actions .classics-primary-btn");
    if (importButton) {
        importButton.disabled = true;
        importButton.textContent = "Importing...";
    }

    try {
        const response = await adminFetch(
            `${API}/api/admin/classics/import`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    author_name: author,
                    original_language: document.getElementById("importOriginalLanguage")?.value.trim(),
                    language,
                    description: document.getElementById("importDescription")?.value.trim(),
                    cover_image: document.getElementById("importCoverImage")?.value.trim() || "assets/images/default-cover.png",
                    publication_year: document.getElementById("importYear")?.value || null,
                    category: document.getElementById("importCategory")?.value.trim(),
                    source_name: pendingClassicImport.source?.name || "Unknown source",
                    source_url: pendingClassicImport.source?.url || classicImportUrl.value.trim(),
                    license: "Public Domain",
                    is_featured: false,
                    is_published: true,
                    public_domain_verified: true,
                    chapters: pendingClassicImport.chapters
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to import Classic.");
        }

        showMessage(
            `Classic imported successfully with ${pendingClassicImport.chapters.length} chapters.`,
            "success"
        );

        clearClassicImport();
        await loadClassics();

    } catch (error) {
        console.error("Classic importer import error:", error);
        showMessage(error.message || "Unable to import Classic.", "error");
        if (importButton) {
            importButton.disabled = false;
            importButton.textContent = "Import Classic";
        }
    }
}

function clearClassicImport() {
    pendingClassicImport = null;
    classicImportUrl.value = "";
    classicImportPreview.hidden = true;
    classicImportPreview.innerHTML = "";
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


if (previewClassicImportBtn) {

    previewClassicImportBtn.addEventListener(
        "click",
        previewClassicImport
    );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadClassics();