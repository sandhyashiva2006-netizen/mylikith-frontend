const ORIGINAL_CHAPTER_API =
    "https://mylikith-backend.onrender.com/api/originals";


let chapterId = null;


const video =
    document.getElementById(
        "originalVideo"
    );


const loading =
    document.getElementById(
        "playerLoading"
    );


const errorBox =
    document.getElementById(
        "playerError"
    );


const errorMessage =
    document.getElementById(
        "playerErrorMessage"
    );


const retryButton =
    document.getElementById(
        "retryButton"
    );


const premiumNotice =
    document.getElementById(
        "premiumNotice"
    );


document.addEventListener(
    "DOMContentLoaded",
    initChapter
);


retryButton.addEventListener(
    "click",
    loadChapterVideo
);


async function initChapter() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    chapterId =
        Number(
            params.get("id")
        );


    if (
        !Number.isInteger(chapterId) ||
        chapterId < 1
    ) {

        showError(
            "Invalid episode."
        );

        return;
    }


    await loadChapterVideo();

}


/* =========================================================
   LOAD VIDEO
========================================================= */

async function loadChapterVideo() {

    showLoading();


    try {

        const response =
            await fetch(
                `${ORIGINAL_CHAPTER_API}/chapter/${chapterId}/video`
            );


        const data =
            await response.json();


        if (
            response.status === 403 &&
            data.locked
        ) {

            showPremiumLocked(
                data
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load episode."
            );

        }


        if (
            !data.success ||
            !data.url
        ) {

            throw new Error(
                "Video URL was not returned."
            );

        }


        renderChapterInfo(
            data.chapter
        );


        video.src =
            data.url;


        video.hidden =
            false;


        loading.hidden =
            true;


        errorBox.hidden =
            true;


        video.load();


        document.title =
            `${data.chapter.title} — MyLikith Originals`;


    } catch (error) {

        console.error(
            "Original video error:",
            error
        );


        showError(
            error.message ||
            "Unable to load video."
        );

    }

}


/* =========================================================
   CHAPTER INFO
========================================================= */

function renderChapterInfo(
    chapter
) {

    document.getElementById(
        "originalTitle"
    ).textContent =
        chapter.original_title ||
        "MyLikith Original";


    document.getElementById(
        "episodeTitle"
    ).textContent =
        chapter.title ||
        `Episode ${
            chapter.chapter_no
        }`;


    document.getElementById(
        "episodeMeta"
    ).innerHTML = `

        <span class="episode-meta-pill">
            🎬 Episode ${
                Number(
                    chapter.chapter_no
                )
            }
        </span>

        <span class="episode-meta-pill">
            ▶ Video
        </span>

        ${
            chapter.mime_type
                ? `
                    <span class="episode-meta-pill">
                        ${escapeHTML(
                            chapter.mime_type
                        )}
                    </span>
                  `
                : ""
        }

    `;

}


/* =========================================================
   PREMIUM
========================================================= */

function showPremiumLocked(
    data
) {

    loading.hidden =
        true;

    video.hidden =
        true;

    errorBox.hidden =
        true;

    premiumNotice.hidden =
        false;


    const chapter =
        data.chapter || {};


    document.getElementById(
        "originalTitle"
    ).textContent =
        chapter.original_title ||
        "MyLikith Original";


    document.getElementById(
        "episodeTitle"
    ).textContent =
        chapter.title ||
        "Premium Episode";


    document.getElementById(
        "episodeMeta"
    ).innerHTML = `

        <span class="episode-meta-pill">
            🎬 Episode ${
                Number(
                    chapter.chapter_no ||
                    0
                )
            }
        </span>

        <span class="episode-meta-pill">
            👑 Premium
        </span>

        ${
            Number(
                chapter.coins_required ||
                0
            ) > 0
                ? `
                    <span class="episode-meta-pill">
                        🪙 ${
                            Number(
                                chapter.coins_required
                            )
                        } Coins
                    </span>
                  `
                : ""
        }

    `;


    document.getElementById(
        "premiumMessage"
    ).textContent =
        data.message ||
        "This episode requires premium access.";

}


/* =========================================================
   STATES
========================================================= */

function showLoading() {

    loading.hidden =
        false;

    errorBox.hidden =
        true;

    premiumNotice.hidden =
        true;

    video.hidden =
        true;

}


function showError(
    message
) {

    loading.hidden =
        true;

    video.hidden =
        true;

    premiumNotice.hidden =
        true;

    errorBox.hidden =
        false;


    errorMessage.textContent =
        message;

}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(
    value
) {

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