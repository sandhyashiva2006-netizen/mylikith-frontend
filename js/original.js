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
   LOAD ORIGINAL LIKE STATUS
========================================================= */

async function loadOriginalLikeStatus() {

    const likeButton =
        document.getElementById(
            "originalLikeBtn"
        );

    if (!likeButton) {
        return;
    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        likeButton.textContent =
            "♡ Like";

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/like`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            response.ok &&
            data.success
        ) {

            likeButton.textContent =
                data.liked
                    ? "♥ Liked"
                    : "♡ Like";

        }

    } catch (error) {

        console.warn(
            "Original like status error:",
            error
        );

    }

}


/* =========================================================
   LIKE / UNLIKE ORIGINAL
========================================================= */

async function toggleOriginalLike() {

    const likeButton =
        document.getElementById(
            "originalLikeBtn"
        );

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        window.location.href =
            `login.html?redirect=${encodeURIComponent(
                window.location.href
            )}`;

        return;

    }


    if (!likeButton) {
        return;
    }


    likeButton.disabled =
        true;


    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/like`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to update like."
            );

        }


        original.likes =
            Number(
                data.likes || 0
            );


        document.getElementById(
            "originalLikes"
        ).textContent =
            formatNumber(
                original.likes
            );


        likeButton.textContent =
            data.liked
                ? "♥ Liked"
                : "♡ Like";


    } catch (error) {

        console.error(
            "Original like error:",
            error
        );

        alert(
            error.message ||
            "Unable to update like."
        );

    } finally {

        likeButton.disabled =
            false;

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


const likeButton =
    document.getElementById(
        "originalLikeBtn"
    );

if (likeButton) {

    likeButton.onclick =
        toggleOriginalLike;

}


loadOriginalLikeStatus();


setupOriginalRating();

}

/* =========================================================
   ORIGINAL RATING
========================================================= */

function setupOriginalRating() {

    const stars =
        document.querySelectorAll(
            "#originalRatingStars button"
        );

    if (!stars.length) {
        return;
    }


    stars.forEach(
        (star) => {

            star.addEventListener(
                "click",
                () => {

                    const rating =
                        Number(
                            star.dataset.rating
                        );

                    submitOriginalRating(
                        rating
                    );

                }
            );


            star.addEventListener(
                "mouseenter",
                () => {

                    const rating =
                        Number(
                            star.dataset.rating
                        );

                    highlightOriginalRating(
                        rating
                    );

                }
            );

        }
    );


    const starsContainer =
        document.getElementById(
            "originalRatingStars"
        );

    if (starsContainer) {

        starsContainer.addEventListener(
            "mouseleave",
            () => {

                loadOriginalRating();

            }
        );

    }


    loadOriginalRating();

}


function highlightOriginalRating(
    rating
) {

    const stars =
        document.querySelectorAll(
            "#originalRatingStars button"
        );


    stars.forEach(
        (star) => {

            const value =
                Number(
                    star.dataset.rating
                );

            star.textContent =
                value <= rating
                    ? "★"
                    : "☆";

        }
    );

}


async function loadOriginalRating() {

    const stars =
        document.querySelectorAll(
            "#originalRatingStars button"
        );

    const userRatingElement =
        document.getElementById(
            "originalUserRating"
        );


    if (!stars.length) {
        return;
    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        highlightOriginalRating(
            0
        );

        if (userRatingElement) {

            userRatingElement.textContent =
                "Login to rate";

        }

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/rating`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            response.ok &&
            data.success
        ) {

            const userRating =
                Number(
                    data.user_rating || 0
                );


            highlightOriginalRating(
                userRating
            );


            if (userRatingElement) {

                userRatingElement.textContent =
                    userRating > 0
                        ? `Your rating: ${userRating}/5`
                        : "Not rated";

            }

        }

    } catch (error) {

        console.warn(
            "Original rating load error:",
            error
        );

    }

}


async function submitOriginalRating(
    rating
) {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        window.location.href =
            `login.html?redirect=${encodeURIComponent(
                window.location.href
            )}`;

        return;

    }


    if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
    ) {

        return;

    }


    const stars =
        document.querySelectorAll(
            "#originalRatingStars button"
        );


    stars.forEach(
        (star) => {

            star.disabled = true;

        }
    );


    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/rating`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            rating
                        })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to save rating."
            );

        }


        original.rating =
            Number(
                data.rating || 0
            );


        const ratingElement =
            document.getElementById(
                "originalRating"
            );


        if (ratingElement) {

            ratingElement.textContent =
                original.rating.toFixed(1);

        }


        highlightOriginalRating(
            rating
        );


        const userRatingElement =
            document.getElementById(
                "originalUserRating"
            );


        if (userRatingElement) {

            userRatingElement.textContent =
                `Your rating: ${rating}/5`;

        }


    } catch (error) {

        console.error(
            "Original rating error:",
            error
        );


        alert(
            error.message ||
            "Unable to save rating."
        );


        loadOriginalRating();

    } finally {

        stars.forEach(
            (star) => {

                star.disabled = false;

            }
        );

    }

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
            `Watch ${original.title} on MyLikith Originals.`,

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