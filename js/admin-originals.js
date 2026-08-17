const API = "https://mylikith-backend.onrender.com";

const PART_SIZE = 10 * 1024 * 1024;
const MAX_RETRIES = 3;

let currentOriginalId = null;
let currentOriginal = null;
let currentChapterId = null;

let selectedVideoFile = null;
let uploadCancelled = false;
let uploadRunning = false;
let activeUploadXHR = null;

const originalsList =
    document.getElementById("originalsList");

const originalsMessage =
    document.getElementById("originalsMessage");

const originalFormSection =
    document.getElementById("originalFormSection");

const originalForm =
    document.getElementById("originalForm");

const originalFormTitle =
    document.getElementById("originalFormTitle");

const episodesSection =
    document.getElementById("episodesSection");

const episodesList =
    document.getElementById("episodesList");

const episodeFormSection =
    document.getElementById("episodeFormSection");

const episodeForm =
    document.getElementById("episodeForm");

const uploadSection =
    document.getElementById("uploadSection");

const videoFile =
    document.getElementById("videoFile");

const uploadDropzone =
    document.getElementById("uploadDropzone");

const selectedFileBox =
    document.getElementById("selectedFile");

const uploadProgressBox =
    document.getElementById("uploadProgressBox");

const uploadProgressBar =
    document.getElementById("uploadProgressBar");

const uploadStatusText =
    document.getElementById("uploadStatusText");

const uploadPercent =
    document.getElementById("uploadPercent");

const uploadPartText =
    document.getElementById("uploadPartText");

const uploadSpeedText =
    document.getElementById("uploadSpeedText");

const uploadEtaText =
    document.getElementById("uploadEtaText");

const uploadResult =
    document.getElementById("uploadResult");

const startUploadBtn =
    document.getElementById("startUploadBtn");

const cancelUploadBtn =
    document.getElementById("cancelUploadBtn");


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadOriginals();

loadOriginalReports();

document
    .getElementById(
        "refreshOriginalReportsBtn"
    )
    .addEventListener(
        "click",
        loadOriginalReports
    );

        document
            .getElementById("newOriginalBtn")
            .addEventListener(
                "click",
                openNewOriginalForm
            );

        document
            .getElementById("closeOriginalForm")
            .addEventListener(
                "click",
                closeOriginalForm
            );

        document
            .getElementById("cancelOriginalBtn")
            .addEventListener(
                "click",
                closeOriginalForm
            );

        originalForm.addEventListener(
            "submit",
            saveOriginal
        );

        document
            .getElementById("newEpisodeBtn")
            .addEventListener(
                "click",
                openNewEpisodeForm
            );

        document
            .getElementById("refreshEpisodesBtn")
            .addEventListener(
                "click",
                () => {
                    if (currentOriginalId) {
                        loadEpisodes(currentOriginalId);
                    }
                }
            );

        document
            .getElementById("closeEpisodeForm")
            .addEventListener(
                "click",
                closeEpisodeForm
            );

        document
            .getElementById("cancelEpisodeBtn")
            .addEventListener(
                "click",
                closeEpisodeForm
            );

        episodeForm.addEventListener(
            "submit",
            saveEpisode
        );

        document
            .getElementById("chooseVideoBtn")
            .addEventListener(
                "click",
                () => videoFile.click()
            );

        videoFile.addEventListener(
            "change",
            handleVideoSelection
        );

        uploadDropzone.addEventListener(
            "dragover",
            event => {
                event.preventDefault();
                uploadDropzone.classList.add("dragover");
            }
        );

        uploadDropzone.addEventListener(
            "dragleave",
            () => {
                uploadDropzone.classList.remove("dragover");
            }
        );

        uploadDropzone.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                uploadDropzone.classList.remove(
                    "dragover"
                );

                const file =
                    event.dataTransfer.files?.[0];

                if (file) {
                    selectVideoFile(file);
                }

            }
        );

        startUploadBtn.addEventListener(
            "click",
            startVideoUpload
        );

cancelUploadBtn.addEventListener(
    "click",
    cancelCurrentUpload
);

        document
            .getElementById("closeUploadBtn")
            .addEventListener(
                "click",
                closeUploadPanel
            );

    }
);

/* =========================================================
   ORIGINAL COMMENT REPORTS
========================================================= */

async function loadOriginalReports() {

    const container =
        document.getElementById(
            "originalReportsList"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        `<div class="originals-loading">
            Loading reports...
        </div>`;


    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals/comment-reports`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load comment reports."
            );

        }


        renderOriginalReports(
            data.reports || []
        );


    } catch (error) {

        console.error(
            "Load Original comment reports error:",
            error
        );


        container.innerHTML =
            `<div class="originals-empty">

                <div style="font-size:40px;margin-bottom:10px;">
                    🚩
                </div>

                <h3 style="color:#fff;margin:0 0 8px;">
                    Unable to Load Reports
                </h3>

                <p style="margin:0;">
                    ${escapeHTML(
                        error.message ||
                        "Unable to load comment reports."
                    )}
                </p>

            </div>`;

    }

}

function renderOriginalReports(
    reports
) {

    const container =
        document.getElementById(
            "originalReportsList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(reports) ||
        !reports.length
    ) {

        container.innerHTML =
            `<div class="originals-empty">

                <div style="font-size:42px;margin-bottom:10px;">
                    ✅
                </div>

                <h3 style="color:#fff;margin:0 0 8px;">
                    No Comment Reports
                </h3>

                <p style="margin:0;">
                    There are currently no reported Original comments.
                </p>

            </div>`;

        return;
    }


    reports.forEach(
        (report) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "original-card";


            const reportedDate =
                report.reported_at
                    ? new Date(
                        report.reported_at
                    ).toLocaleString()
                    : "Unknown";


            card.innerHTML = `

                <div class="original-card-top">

                    <div class="original-card-main">

                        <div class="original-card-title-row">

                            <h3>
                                🚩 ${escapeHTML(
                                    report.original_title ||
                                    "Unknown Original"
                                )}
                            </h3>


                            <span class="original-meta-pill">

                                Report #${Number(
                                    report.report_id
                                )}

                            </span>

                        </div>


                        <div
                            class="original-card-description"
                            style="margin-top:12px;"
                        >

                            <strong>
                                Reported Comment
                            </strong>


                            <p>
                                ${escapeHTML(
                                    report.comment ||
                                    ""
                                )}
                            </p>

                        </div>


                        <div class="original-card-meta">

                            <span class="original-meta-pill">

                                👤 Commenter:
                                ${escapeHTML(
                                    report.commenter_name ||
                                    "Unknown"
                                )}

                            </span>


                            <span class="original-meta-pill">

                                🚩 Reporter:
                                ${escapeHTML(
                                    report.reporter_name ||
                                    "Unknown"
                                )}

                            </span>


                            <span class="original-meta-pill">

                                📅 ${escapeHTML(
                                    reportedDate
                                )}

                            </span>

                        </div>


                        <div
                            class="original-card-description"
                            style="margin-top:12px;"
                        >

                            <strong>
                                Report Reason
                            </strong>


                            <p>
                                ${escapeHTML(
                                    report.report_reason ||
                                    "No reason provided."
                                )}
                            </p>

                        </div>


                        <div class="original-report-actions">

                            <button
                                type="button"
                                class="original-report-delete"
                                data-report-id="${report.report_id}"
                            >
                                🗑 Delete Comment
                            </button>


                            <button
                                type="button"
                                class="original-report-dismiss"
                                data-report-id="${report.report_id}"
                            >
                                ✓ Dismiss Report
                            </button>

                        </div>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    const deleteButtons =
        container.querySelectorAll(
            ".original-report-delete"
        );


    deleteButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    deleteReportedOriginalComment(
                        button.dataset.reportId
                    );

                }
            );

        }
    );


    const dismissButtons =
        container.querySelectorAll(
            ".original-report-dismiss"
        );


    dismissButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    dismissOriginalCommentReport(
                        button.dataset.reportId
                    );

                }
            );

        }
    );

}

async function deleteReportedOriginalComment(
    reportId
) {

    const confirmed =
        confirm(
            "Delete this comment permanently?\n\nThis will also remove all reports for this comment."
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals/comment-reports/${reportId}/comment`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete comment."
            );

        }


        alert(
            "Comment deleted successfully."
        );


        await loadOriginalReports();


    } catch (error) {

        console.error(
            "Admin Original comment delete error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete comment."
        );

    }

}

async function dismissOriginalCommentReport(
    reportId
) {

    const confirmed =
        confirm(
            "Dismiss this report?\n\nThe comment will remain."
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals/comment-reports/${reportId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to dismiss report."
            );

        }


        alert(
            "Report dismissed successfully."
        );


        await loadOriginalReports();


    } catch (error) {

        console.error(
            "Admin Original report dismiss error:",
            error
        );


        alert(
            error.message ||
            "Unable to dismiss report."
        );

    }

}

/* =========================================================
   ORIGINALS
========================================================= */

async function loadOriginals() {

    originalsList.innerHTML =
        `<div class="originals-loading">
            Loading Originals...
        </div>`;

    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals`
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load Originals."
            );
        }

        renderOriginals(
            Array.isArray(data)
                ? data
                : data.originals
        );

    } catch (error) {

        console.error(
            "Load Originals error:",
            error
        );

        originalsList.innerHTML =
            `<div class="originals-empty">
                Unable to load Originals.
                <br><br>
                ${escapeHTML(error.message)}
            </div>`;
    }
}


function renderOriginals(originals) {

    originalsList.innerHTML = "";

    if (
        !Array.isArray(originals) ||
        !originals.length
    ) {

        originalsList.innerHTML =
            `<div class="originals-empty">
                <div style="font-size:42px;margin-bottom:10px;">
                    🎬
                </div>

                <h3 style="color:#fff;margin:0 0 8px;">
                    No Originals Yet
                </h3>

                <p style="margin:0;">
                    Create your first MyLikith Original series.
                </p>
            </div>`;

        return;
    }


    originals.forEach(original => {

        const card =
            document.createElement("article");

        card.className =
            "original-card";

        const cover =
            original.cover_url
                ? `
                    <img
                        class="original-card-cover"
                        src="${escapeAttribute(original.cover_url)}"
                        alt="${escapeAttribute(original.title)}"
                    >
                  `
                : `
                    <div class="original-card-cover-placeholder">
                        🎬
                    </div>
                  `;

        const publishStatus =
            String(
                original.publish_status || "draft"
            ).toLowerCase();

        const visibility =
            String(
                original.visibility || "private"
            ).toLowerCase();

        card.innerHTML = `

            <div class="original-card-top">

                ${cover}

                <div class="original-card-main">

                    <div class="original-card-title-row">

                        <h3>
                            ${escapeHTML(original.title)}
                        </h3>

                        <span class="original-meta-pill">
                            ${escapeHTML(
                                original.content_type || "video"
                            )}
                        </span>

                    </div>


                    ${
                        original.description
                            ? `
                                <p class="original-card-description">
                                    ${escapeHTML(
                                        truncate(
                                            original.description,
                                            260
                                        )
                                    )}
                                </p>
                              `
                            : ""
                    }


                    <div class="original-card-meta">

                        <span class="original-meta-pill">
                            🌐 ${escapeHTML(
                                original.language || "Unknown"
                            )}
                        </span>

                        <span class="original-meta-pill">
                            📚 ${escapeHTML(
                                original.category || "Uncategorized"
                            )}
                        </span>

                        <span class="original-meta-pill">
                            🎞 ${Number(
                                original.chapter_count || 0
                            )} Episodes
                        </span>

                        <span class="original-meta-pill">
                            👁 ${Number(
                                original.views || 0
                            )}
                        </span>

                    </div>


                    <div
                        class="original-card-status"
                        style="margin-top:10px;"
                    >

                        <span
                            class="original-status-pill ${publishStatus}"
                        >
                            ${
                                publishStatus === "published"
                                    ? "Published"
                                    : "Draft"
                            }
                        </span>

                        <span
                            class="original-status-pill ${visibility}"
                        >
                            ${
                                visibility === "public"
                                    ? "Public"
                                    : "Private"
                            }
                        </span>

                        ${
                            original.premium_only
                                ? `
                                    <span class="original-status-pill draft">
                                        👑 Premium Only
                                    </span>
                                  `
                                : ""
                        }

                        ${
                            original.featured
                                ? `
                                    <span class="original-status-pill published">
                                        ⭐ Featured
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                </div>

            </div>


            <div class="original-card-actions">

                <button
                    type="button"
                    class="originals-secondary-btn"
                    data-action="edit"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="originals-primary-btn"
                    data-action="episodes"
                >
                    Episodes
                </button>

                <button
                    type="button"
                    class="originals-danger-btn"
                    data-action="delete"
                >
                    Delete
                </button>

            </div>
        `;


        card
            .querySelector(
                '[data-action="edit"]'
            )
            .addEventListener(
                "click",
                () => editOriginal(original.id)
            );


        card
            .querySelector(
                '[data-action="episodes"]'
            )
            .addEventListener(
                "click",
                () => openEpisodes(original)
            );


        card
            .querySelector(
                '[data-action="delete"]'
            )
            .addEventListener(
                "click",
                () => deleteOriginal(
                    original.id,
                    original.title
                )
            );


        originalsList.appendChild(card);

    });
}


/* =========================================================
   ORIGINAL FORM
========================================================= */

function openNewOriginalForm() {

    originalForm.reset();

    document.getElementById(
        "originalId"
    ).value = "";

    document.getElementById(
        "originalLanguage"
    ).value = "English";

    document.getElementById(
        "originalStatus"
    ).value = "ongoing";

    document.getElementById(
        "originalPublishStatus"
    ).value = "draft";

    document.getElementById(
        "originalVisibility"
    ).value = "private";

    originalFormTitle.textContent =
        "Create Original";

    originalFormSection.hidden =
        false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


async function editOriginal(id) {

    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals/${id}`
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load Original."
            );
        }

        const original =
            data.original;

        document.getElementById(
            "originalId"
        ).value = original.id;

        document.getElementById(
            "originalTitle"
        ).value = original.title || "";

        document.getElementById(
            "originalDescription"
        ).value = original.description || "";

        document.getElementById(
            "originalLanguage"
        ).value = original.language || "English";

        document.getElementById(
            "originalCategory"
        ).value = original.category || "";

        document.getElementById(
            "originalCover"
        ).value = original.cover_url || "";

        document.getElementById(
            "originalStatus"
        ).value = original.status || "ongoing";

        document.getElementById(
            "originalPublishStatus"
        ).value =
            String(
                original.publish_status || "draft"
            ).toLowerCase();

        document.getElementById(
            "originalVisibility"
        ).value =
            original.visibility || "private";

        document.getElementById(
            "originalPremiumOnly"
        ).checked =
            Boolean(original.premium_only);

        document.getElementById(
            "originalFeatured"
        ).checked =
            Boolean(original.featured);

        if (original.release_date) {

            const date =
                new Date(
                    original.release_date
                );

            if (!Number.isNaN(date.getTime())) {

                document.getElementById(
                    "originalReleaseDate"
                ).value =
                    toLocalDateTimeValue(date);

            }

        } else {

            document.getElementById(
                "originalReleaseDate"
            ).value = "";

        }


        originalFormTitle.textContent =
            "Edit Original";

        originalFormSection.hidden =
            false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        showMessage(
            error.message ||
            "Unable to load Original.",
            "error"
        );
    }
}


async function saveOriginal(event) {

    event.preventDefault();

    const id =
        document.getElementById(
            "originalId"
        ).value.trim();

    const categoryValue =
        document.getElementById(
            "originalCategory"
        ).value.trim();

    const payload = {

        title:
            document.getElementById(
                "originalTitle"
            ).value.trim(),

        description:
            document.getElementById(
                "originalDescription"
            ).value.trim(),

        cover_url:
            document.getElementById(
                "originalCover"
            ).value.trim(),

        language:
            document.getElementById(
                "originalLanguage"
            ).value,

        category:
            categoryValue,

        categories:
            categoryValue
                .split(",")
                .map(value => value.trim())
                .filter(Boolean),

        content_type:
            "video",

        status:
            document.getElementById(
                "originalStatus"
            ).value,

        publish_status:
            document.getElementById(
                "originalPublishStatus"
            ).value,

        visibility:
            document.getElementById(
                "originalVisibility"
            ).value,

        premium_only:
            document.getElementById(
                "originalPremiumOnly"
            ).checked,

        featured:
            document.getElementById(
                "originalFeatured"
            ).checked,

        release_date:
            document.getElementById(
                "originalReleaseDate"
            ).value || null

    };


    if (!payload.title) {

        showMessage(
            "Original title is required.",
            "error"
        );

        return;
    }


    const saveBtn =
        document.getElementById(
            "saveOriginalBtn"
        );

    saveBtn.disabled = true;
    saveBtn.textContent =
        "Saving...";


    try {

        const response =
            await adminFetch(
                id
                    ? `${API}/api/admin/originals/${id}`
                    : `${API}/api/admin/originals`,
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
                "Unable to save Original."
            );
        }

        showMessage(
            id
                ? "Original updated successfully."
                : "Original created successfully.",
            "success"
        );

        closeOriginalForm();

        await loadOriginals();

    } catch (error) {

        console.error(
            "Save Original error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to save Original.",
            "error"
        );

    } finally {

        saveBtn.disabled = false;
        saveBtn.textContent =
            "Save Original";

    }
}


function closeOriginalForm() {

    originalForm.reset();

    originalFormSection.hidden =
        true;
}


/* =========================================================
   DELETE ORIGINAL
========================================================= */

async function deleteOriginal(id, title) {

    if (
        !confirm(
            `Delete "${title}"?\n\n` +
            "This will delete the Original record and its episodes if the database relationships allow it."
        )
    ) {
        return;
    }


    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals/${id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to delete Original."
            );
        }

        showMessage(
            "Original deleted successfully.",
            "success"
        );

        if (
            String(currentOriginalId) ===
            String(id)
        ) {
            closeEpisodes();
        }

        await loadOriginals();

    } catch (error) {

        console.error(
            "Delete Original error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to delete Original.",
            "error"
        );
    }
}


/* =========================================================
   EPISODES
========================================================= */

async function openEpisodes(original) {

    currentOriginalId =
        Number(original.id);

    currentOriginal =
        original;

    document.getElementById(
        "episodesOriginalTitle"
    ).textContent =
        original.title;

    document.getElementById(
        "episodesOriginalMeta"
    ).textContent =
        `${original.language || "Unknown"} • ${
            original.category || "Uncategorized"
        }`;

    episodesSection.hidden =
        false;

    episodeFormSection.hidden =
        true;

    uploadSection.hidden =
        true;

    await loadEpisodes(
        currentOriginalId
    );

    episodesSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


async function loadEpisodes(originalId) {

    episodesList.innerHTML =
        `<div class="originals-loading">
            Loading episodes...
        </div>`;

    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals/${originalId}/chapters`
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load episodes."
            );
        }

        renderEpisodes(
            data.chapters || []
        );

    } catch (error) {

        console.error(
            "Load episodes error:",
            error
        );

        episodesList.innerHTML =
            `<div class="originals-empty">
                Unable to load episodes.
                <br><br>
                ${escapeHTML(error.message)}
            </div>`;
    }
}


function renderEpisodes(episodes) {

    episodesList.innerHTML = "";

    if (
        !Array.isArray(episodes) ||
        !episodes.length
    ) {

        episodesList.innerHTML =
            `<div class="originals-empty">
                <div style="font-size:40px;">
                    🎞
                </div>

                <h3 style="color:#fff;margin:10px 0 7px;">
                    No Episodes Yet
                </h3>

                <p style="margin:0;">
                    Create the first episode for this Original.
                </p>
            </div>`;

        return;
    }


    episodes.forEach(chapter => {

        const card =
            document.createElement("article");

        card.className =
            "episode-card";


        const mediaStatus =
            String(
                chapter.media_status || "pending"
            ).toLowerCase();


        const published =
            Boolean(
                chapter.is_published
            );

        const draft =
            Boolean(
                chapter.is_draft
            );


        card.innerHTML = `

            <div class="episode-card-main">

                <div>

                    <div class="episode-number">
                        EPISODE ${Number(
                            chapter.chapter_no
                        )}
                    </div>

                    <h3>
                        ${escapeHTML(
                            chapter.title ||
                            `Episode ${chapter.chapter_no}`
                        )}
                    </h3>


                    <div class="episode-meta">

                        <span class="original-meta-pill">
                            🎬 Video
                        </span>

                        <span class="original-meta-pill">
                            ${
                                chapter.is_premium
                                    ? `👑 ${Number(
                                        chapter.coins_required || 0
                                    )} coins`
                                    : "Free"
                            }
                        </span>

                        ${
                            chapter.early_access
                                ? `
                                    <span class="original-meta-pill">
                                        ⚡ Early Access
                                    </span>
                                  `
                                : ""
                        }

                        <span
                            class="original-status-pill ${
                                published
                                    ? "published"
                                    : "draft"
                            }"
                        >
                            ${
                                published
                                    ? "Published"
                                    : draft
                                        ? "Draft"
                                        : "Unpublished"
                            }
                        </span>

                    </div>

                </div>


                <div class="episode-actions">

                    <button
                        type="button"
                        class="originals-secondary-btn"
                        data-action="edit"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="originals-primary-btn"
                        data-action="upload"
                    >
                        ${
                            mediaStatus === "ready"
                                ? "Replace Video"
                                : "Upload Video"
                        }
                    </button>

                    <button
                        type="button"
                        class="originals-danger-btn"
                        data-action="delete"
                    >
                        Delete
                    </button>

                </div>

            </div>


            <div class="episode-video">

                <div class="episode-video-grid">

                    <span
                        class="media-status-pill ${mediaStatus}"
                    >
                        Media: ${escapeHTML(
                            mediaStatus
                        )}
                    </span>

                    ${
                        chapter.media_original_name
                            ? `
                                <span class="original-meta-pill">
                                    📁 ${escapeHTML(
                                        chapter.media_original_name
                                    )}
                                </span>
                              `
                            : ""
                    }

                    ${
                        chapter.media_size_bytes
                            ? `
                                <span class="original-meta-pill">
                                    💾 ${formatBytes(
                                        chapter.media_size_bytes
                                    )}
                                </span>
                              `
                            : ""
                    }

                </div>

            </div>
        `;


        card
            .querySelector(
                '[data-action="edit"]'
            )
            .addEventListener(
                "click",
                () => editEpisode(chapter)
            );


        card
            .querySelector(
                '[data-action="upload"]'
            )
            .addEventListener(
                "click",
                () => openUploadPanel(chapter)
            );


        card
            .querySelector(
                '[data-action="delete"]'
            )
            .addEventListener(
                "click",
                () => deleteEpisode(
                    chapter.id,
                    chapter.title
                )
            );


        episodesList.appendChild(card);

    });
}


/* =========================================================
   EPISODE FORM
========================================================= */

function openNewEpisodeForm() {

    if (!currentOriginalId) {

        showMessage(
            "Select an Original first.",
            "error"
        );

        return;
    }

    episodeForm.reset();

    const nextNumber =
        getNextEpisodeNumber();

    document.getElementById(
        "episodeId"
    ).value = "";

    document.getElementById(
        "episodeNo"
    ).value =
        nextNumber;

    document.getElementById(
        "episodeTitle"
    ).value =
        `Episode ${nextNumber}`;

    document.getElementById(
        "episodeCoins"
    ).value = 0;

    document.getElementById(
        "episodeDraft"
    ).checked = true;

    document.getElementById(
        "episodePublished"
    ).checked = false;

    document.getElementById(
        "episodePremium"
    ).checked = false;

    document.getElementById(
        "episodeEarlyAccess"
    ).checked = false;

    document.getElementById(
        "episodePublishAt"
    ).value = "";

    document.getElementById(
        "episodeFormTitle"
    ).textContent =
        "Create Episode";

    episodeFormSection.hidden =
        false;

    uploadSection.hidden =
        true;

    episodeFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function editEpisode(chapter) {

    document.getElementById(
        "episodeId"
    ).value =
        chapter.id;

    document.getElementById(
        "episodeNo"
    ).value =
        chapter.chapter_no;

    document.getElementById(
        "episodeTitle"
    ).value =
        chapter.title || "";

    document.getElementById(
        "episodeCoins"
    ).value =
        chapter.coins_required || 0;

    document.getElementById(
        "episodePremium"
    ).checked =
        Boolean(chapter.is_premium);

    document.getElementById(
        "episodeEarlyAccess"
    ).checked =
        Boolean(chapter.early_access);

    document.getElementById(
        "episodeDraft"
    ).checked =
        Boolean(chapter.is_draft);

    document.getElementById(
        "episodePublished"
    ).checked =
        Boolean(chapter.is_published);

    document.getElementById(
        "episodePublishAt"
    ).value =
        chapter.publish_at
            ? toLocalDateTimeValue(
                new Date(
                    chapter.publish_at
                )
            )
            : "";

    document.getElementById(
        "episodeFormTitle"
    ).textContent =
        "Edit Episode";

    episodeFormSection.hidden =
        false;

    episodeFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


async function saveEpisode(event) {

    event.preventDefault();

    if (!currentOriginalId) {

        showMessage(
            "No Original selected.",
            "error"
        );

        return;
    }


    const id =
        document.getElementById(
            "episodeId"
        ).value.trim();

    const chapterNo =
        Number(
            document.getElementById(
                "episodeNo"
            ).value
        );

    const title =
        document.getElementById(
            "episodeTitle"
        ).value.trim();


    if (
        !Number.isInteger(chapterNo) ||
        chapterNo < 1
    ) {

        showMessage(
            "Enter a valid episode number.",
            "error"
        );

        return;
    }


    if (!title) {

        showMessage(
            "Episode title is required.",
            "error"
        );

        return;
    }


    const payload = {

        chapter_no:
            chapterNo,

        title:
            title,

        /*
           Originals are video episodes.
           The existing backend currently requires
           non-empty content when creating a chapter.
        */
        content:
            "VIDEO_EPISODE",

        is_premium:
            document.getElementById(
                "episodePremium"
            ).checked,

        coins_required:
            Number(
                document.getElementById(
                    "episodeCoins"
                ).value
            ) || 0,

        early_access:
            document.getElementById(
                "episodeEarlyAccess"
            ).checked,

        is_draft:
            document.getElementById(
                "episodeDraft"
            ).checked,

        is_published:
            document.getElementById(
                "episodePublished"
            ).checked,

        publish_at:
            document.getElementById(
                "episodePublishAt"
            ).value || null

    };


    const saveBtn =
        document.getElementById(
            "saveEpisodeBtn"
        );

    saveBtn.disabled = true;
    saveBtn.textContent =
        "Saving...";


    try {

        const response =
            await adminFetch(
                id
                    ? `${API}/api/admin/originals/${currentOriginalId}/chapters/${id}`
                    : `${API}/api/admin/originals/${currentOriginalId}/chapters`,
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
                "Unable to save episode."
            );
        }

        showMessage(
            id
                ? "Episode updated successfully."
                : "Episode created successfully.",
            "success"
        );

        closeEpisodeForm();

        await loadEpisodes(
            currentOriginalId
        );

        await loadOriginals();

    } catch (error) {

        console.error(
            "Save Episode error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to save episode.",
            "error"
        );

    } finally {

        saveBtn.disabled = false;
        saveBtn.textContent =
            "Save Episode";
    }
}


function closeEpisodeForm() {

    episodeForm.reset();

    episodeFormSection.hidden =
        true;
}


function getNextEpisodeNumber() {

    const cards =
        episodesList.querySelectorAll(
            ".episode-card"
        );

    let highest = 0;

    cards.forEach(card => {

        const value =
            card.querySelector(
                ".episode-number"
            )?.textContent
                ?.match(/\d+/);

        if (value) {

            highest =
                Math.max(
                    highest,
                    Number(value[0])
                );
        }

    });

    return highest + 1;
}


/* =========================================================
   DELETE EPISODE
========================================================= */

async function deleteEpisode(
    id,
    title
) {

    if (
        !confirm(
            `Delete "${title}"?\n\n` +
            "The episode record will be permanently removed."
        )
    ) {
        return;
    }


    try {

        const response =
            await adminFetch(
                `${API}/api/admin/originals/${currentOriginalId}/chapters/${id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete episode."
            );
        }

        showMessage(
            "Episode deleted successfully.",
            "success"
        );

        await loadEpisodes(
            currentOriginalId
        );

        await loadOriginals();

    } catch (error) {

        console.error(
            "Delete episode error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to delete episode.",
            "error"
        );
    }
}


/* =========================================================
   UPLOAD PANEL
========================================================= */

function openUploadPanel(chapter) {

    currentChapterId =
        Number(chapter.id);

    selectedVideoFile = null;

    videoFile.value = "";

    selectedFileBox.hidden =
        true;

    uploadProgressBox.hidden =
        true;

    uploadResult.textContent =
        "";

    uploadStatusText.textContent =
        "Ready to upload";

    uploadPercent.textContent =
        "0%";

    uploadProgressBar.style.width =
        "0%";

    uploadPartText.textContent =
        "Part 0 / 0";

    uploadSpeedText.textContent =
        "0 MB/s";

    uploadEtaText.textContent =
        "ETA —";

    startUploadBtn.disabled =
        false;

    cancelUploadBtn.disabled =
        true;

    document.getElementById(
        "uploadEpisodeTitle"
    ).textContent =
        `Upload — Episode ${
            Number(chapter.chapter_no)
        }: ${chapter.title || ""}`;

    uploadSection.hidden =
        false;

    uploadSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function closeUploadPanel() {

    if (uploadRunning) {

        showMessage(
            "Wait for the current upload to finish or cancel it first.",
            "error"
        );

        return;
    }

    uploadSection.hidden =
        true;

    selectedVideoFile = null;

    videoFile.value = "";
}


function handleVideoSelection(event) {

    const file =
        event.target.files?.[0];

    if (file) {
        selectVideoFile(file);
    }
}


function selectVideoFile(file) {

    if (
        !file.type ||
        !file.type.startsWith("video/")
    ) {

        showMessage(
            "Please select a video file.",
            "error"
        );

        return;
    }


    selectedVideoFile =
        file;

    selectedFileBox.hidden =
        false;

    selectedFileBox.innerHTML =
        `<strong>
            ${escapeHTML(file.name)}
        </strong>

        <br>

        <small>
            ${formatBytes(file.size)}
            • ${escapeHTML(file.type)}
        </small>`;


    uploadProgressBox.hidden =
        false;

    uploadStatusText.textContent =
        "Ready to upload";

    uploadPercent.textContent =
        "0%";

    uploadProgressBar.style.width =
        "0%";

    startUploadBtn.disabled =
        false;
}

async function cancelCurrentUpload() {

    if (!uploadRunning) {
        return;
    }

    uploadCancelled = true;

    cancelUploadBtn.disabled = true;
    startUploadBtn.disabled = true;

    uploadStatusText.textContent =
        "Cancelling upload...";

    if (activeUploadXHR) {
        try {
            activeUploadXHR.abort();
        } catch (error) {
            console.warn(
                "Unable to abort active XHR:",
                error
            );
        }
    }
}

/* =========================================================
   LARGE VIDEO UPLOAD
========================================================= */

async function startVideoUpload() {

    if (!selectedVideoFile) {

        showMessage(
            "Select a video first.",
            "error"
        );

        return;
    }


    if (!currentChapterId) {

        showMessage(
            "No episode selected.",
            "error"
        );

        return;
    }


    if (uploadRunning) {
        return;
    }


    uploadRunning = true;
    uploadCancelled = false;

    startUploadBtn.disabled = true;
    cancelUploadBtn.disabled = false;

    uploadResult.textContent = "";

    const file =
        selectedVideoFile;


    try {

        uploadStatusText.textContent =
            "Starting B2 multipart upload...";


        const startResponse =
            await adminFetch(
                `${API}/api/admin/originals/chapters/${currentChapterId}/media/start`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            file_name:
                                file.name,

                            mime_type:
                                file.type ||
                                "video/mp4",

                            file_size:
                                file.size
                        })
                }
            );


        const startData =
            await startResponse.json();


        if (!startResponse.ok) {

            throw new Error(
                startData.message ||
                "Unable to start video upload."
            );
        }


        const uploadId =
            startData.upload_id;

        const objectKey =
            startData.object_key;

        const partSize =
            Number(
                startData.part_size
            ) || PART_SIZE;


        const totalParts =
            Math.ceil(
                file.size /
                partSize
            );


        uploadPartText.textContent =
            `Part 0 / ${totalParts}`;


        const parts = [];

        const uploadStartedAt =
            performance.now();

        let uploadedBytes = 0;


        for (
            let partNumber = 1;
            partNumber <= totalParts;
            partNumber++
        ) {

            if (uploadCancelled) {
                throw new UploadCancelledError();
            }


            const start =
                (partNumber - 1) *
                partSize;

            const end =
                Math.min(
                    start + partSize,
                    file.size
                );

            const blob =
                file.slice(
                    start,
                    end
                );


            uploadStatusText.textContent =
                `Uploading part ${partNumber} of ${totalParts}...`;

            uploadPartText.textContent =
                `Part ${partNumber} / ${totalParts}`;


            const etag =
                await uploadPartWithRetry(
                    currentChapterId,
                    uploadId,
                    objectKey,
                    partNumber,
                    blob,
                    loaded => {

                        updateUploadProgress(
                            uploadedBytes,
                            loaded,
                            file.size,
                            uploadStartedAt
                        );

                    }
                );


            parts.push({

                part_number:
                    partNumber,

                etag:
                    etag

            });


            uploadedBytes +=
                blob.size;


            updateUploadProgress(
                uploadedBytes,
                0,
                file.size,
                uploadStartedAt
            );
        }


        if (uploadCancelled) {
            throw new UploadCancelledError();
        }


        uploadStatusText.textContent =
            "Completing B2 multipart upload...";


        const completeResponse =
            await adminFetch(
                `${API}/api/admin/originals/chapters/${currentChapterId}/media/complete`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            upload_id:
                                uploadId,

                            object_key:
                                objectKey,

                            parts:
                                parts

                        })
                }
            );


        const completeData =
            await completeResponse.json();


        if (!completeResponse.ok) {

            throw new Error(
                completeData.message ||
                "Unable to complete video upload."
            );
        }


        updateUploadProgress(
            file.size,
            0,
            file.size,
            uploadStartedAt
        );


        uploadStatusText.textContent =
            "Upload complete";

        uploadPercent.textContent =
            "100%";

        uploadProgressBar.style.width =
            "100%";


        uploadResult.innerHTML =
            `<strong>
                ✓ Video uploaded successfully.
            </strong>

            <br>

            ${escapeHTML(
                completeData.object_key ||
                objectKey
            )}`;


        cancelUploadBtn.disabled =
            true;


        await loadEpisodes(
            currentOriginalId
        );

        await loadOriginals();


    } catch (error) {

        console.error(
            "Video upload error:",
            error
        );


        if (
            error instanceof
            UploadCancelledError
        ) {

            uploadStatusText.textContent =
                "Upload cancelled.";

            uploadResult.textContent =
                "The multipart upload was cancelled.";

        } else {

            uploadStatusText.textContent =
                "Upload failed.";

            uploadResult.textContent =
                error.message ||
                "Video upload failed.";

            showMessage(
                error.message ||
                "Video upload failed.",
                "error"
            );
        }

    } finally {

    activeUploadXHR = null;

    uploadRunning = false;

    startUploadBtn.disabled =
        false;

    cancelUploadBtn.disabled =
        true;
}
}


/* =========================================================
   UPLOAD PART + RETRY
========================================================= */

async function uploadPartWithRetry(
    chapterId,
    uploadId,
    objectKey,
    partNumber,
    blob,
    progressCallback
) {

    let lastError = null;


    for (
        let attempt = 1;
        attempt <= MAX_RETRIES;
        attempt++
    ) {

        if (uploadCancelled) {
            throw new UploadCancelledError();
        }


        try {

            const signResponse =
                await adminFetch(
                    `${API}/api/admin/originals/chapters/${chapterId}/media/sign-part`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                upload_id:
                                    uploadId,

                                object_key:
                                    objectKey,

                                part_number:
                                    partNumber

                            })
                    }
                );


            const signData =
                await signResponse.json();


            if (!signResponse.ok) {

                throw new Error(
                    signData.message ||
                    "Unable to sign upload part."
                );
            }


            const etag =
                await uploadBlobWithProgress(
                    signData.url,
                    blob,
                    progressCallback
                );


            if (!etag) {

                throw new Error(
                    "B2 did not return an ETag."
                );
            }


            return etag;


        } catch (error) {

            lastError =
                error;

            console.warn(
                `Part ${partNumber} attempt ${attempt} failed:`,
                error
            );


            if (
                attempt <
                MAX_RETRIES
            ) {

                uploadStatusText.textContent =
                    `Retrying part ${partNumber} (${attempt + 1}/${MAX_RETRIES})...`;

                await sleep(
                    1200 * attempt
                );
            }
        }
    }


    throw new Error(
        `Part ${partNumber} failed after ${MAX_RETRIES} attempts: ${
            lastError?.message ||
            "Unknown error"
        }`
    );
}


/* =========================================================
   XHR PUT — REAL PROGRESS
========================================================= */

function uploadBlobWithProgress(
    url,
    blob,
    progressCallback
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const xhr =
                new XMLHttpRequest();

            activeUploadXHR = xhr;

            xhr.open(
                "PUT",
                url,
                true
            );

            xhr.upload.onprogress =
                event => {

                    if (
                        event.lengthComputable
                    ) {

                        progressCallback(
                            event.loaded
                        );
                    }
                };

            xhr.onload =
                () => {

                    if (
                        activeUploadXHR === xhr
                    ) {
                        activeUploadXHR = null;
                    }

                    if (
                        xhr.status >= 200 &&
                        xhr.status < 300
                    ) {

                        resolve(
                            xhr.getResponseHeader(
                                "ETag"
                            )
                        );

                    } else {

                        reject(
                            new Error(
                                `B2 upload failed with HTTP ${xhr.status}.`
                            )
                        );
                    }
                };

            xhr.onerror =
                () => {

                    if (
                        activeUploadXHR === xhr
                    ) {
                        activeUploadXHR = null;
                    }

                    reject(
                        new Error(
                            "Network error while uploading to B2."
                        )
                    );
                };

            xhr.onabort =
                () => {

                    if (
                        activeUploadXHR === xhr
                    ) {
                        activeUploadXHR = null;
                    }

                    reject(
                        new UploadCancelledError()
                    );
                };

            if (uploadCancelled) {

                xhr.abort();

                return;
            }

            xhr.send(blob);
        }
    );
}


/* =========================================================
   PROGRESS
========================================================= */

function updateUploadProgress(
    completedBytes,
    currentPartLoaded,
    totalBytes,
    startedAt
) {

    const totalLoaded =
        Math.min(
            completedBytes +
            currentPartLoaded,
            totalBytes
        );


    const percent =
        totalBytes > 0
            ? (
                totalLoaded /
                totalBytes
            ) * 100
            : 0;


    uploadProgressBar.style.width =
        `${percent.toFixed(2)}%`;

    uploadPercent.textContent =
        `${Math.floor(percent)}%`;


    const elapsedSeconds =
        Math.max(
            (
                performance.now() -
                startedAt
            ) / 1000,
            0.1
        );


    const bytesPerSecond =
        totalLoaded /
        elapsedSeconds;


    uploadSpeedText.textContent =
        `${formatBytes(
            bytesPerSecond
        )}/s`;


    const remainingBytes =
        Math.max(
            totalBytes -
            totalLoaded,
            0
        );


    if (
        bytesPerSecond > 0 &&
        remainingBytes > 0
    ) {

        const seconds =
            remainingBytes /
            bytesPerSecond;

        uploadEtaText.textContent =
            `ETA ${
                formatDuration(
                    seconds
                )
            }`;

    } else if (
        totalLoaded >=
        totalBytes
    ) {

        uploadEtaText.textContent =
            "ETA 0s";

    } else {

        uploadEtaText.textContent =
            "ETA —";
    }
}


/* =========================================================
   HELPERS
========================================================= */

function showMessage(
    message,
    type
) {

    originalsMessage.textContent =
        message;

    originalsMessage.className =
        `originals-message ${type}`;

    window.clearTimeout(
        showMessage.timer
    );

    showMessage.timer =
        window.setTimeout(
            () => {

                originalsMessage.textContent =
                    "";

                originalsMessage.className =
                    "originals-message";

            },
            4500
        );
}


function formatBytes(bytes) {

    const value =
        Number(bytes) || 0;

    if (value <= 0) {
        return "0 B";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    const index =
        Math.min(
            Math.floor(
                Math.log(value) /
                Math.log(1024)
            ),
            units.length - 1
        );

    return `${
        (
            value /
            Math.pow(
                1024,
                index
            )
        ).toFixed(
            index === 0
                ? 0
                : 2
        )
    } ${units[index]}`;
}


function formatDuration(seconds) {

    const value =
        Math.max(
            Math.round(
                Number(seconds) || 0
            ),
            0
        );

    if (value < 60) {
        return `${value}s`;
    }

    const minutes =
        Math.floor(
            value / 60
        );

    const remaining =
        value % 60;

    if (minutes < 60) {
        return `${minutes}m ${remaining}s`;
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    const mins =
        minutes % 60;

    return `${hours}h ${mins}m`;
}


function truncate(
    value,
    length
) {

    const text =
        String(
            value || ""
        );

    if (
        text.length <=
        length
    ) {
        return text;
    }

    return (
        text.substring(
            0,
            length
        ) +
        "..."
    );
}


function escapeHTML(value) {

    return String(
        value ?? ""
    )
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


function escapeAttribute(value) {
    return escapeHTML(value);
}


function toLocalDateTimeValue(
    date
) {

    const pad =
        value =>
            String(
                value
            ).padStart(
                2,
                "0"
            );

    return (
        date.getFullYear() +
        "-" +
        pad(
            date.getMonth() + 1
        ) +
        "-" +
        pad(
            date.getDate()
        ) +
        "T" +
        pad(
            date.getHours()
        ) +
        ":" +
        pad(
            date.getMinutes()
        )
    );
}


function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


function closeEpisodes() {

    currentOriginalId =
        null;

    currentOriginal =
        null;

    currentChapterId =
        null;

    episodesSection.hidden =
        true;

    episodeFormSection.hidden =
        true;

    uploadSection.hidden =
        true;
}


class UploadCancelledError
    extends Error {

    constructor() {

        super(
            "Upload cancelled."
        );

        this.name =
            "UploadCancelledError";
    }
}