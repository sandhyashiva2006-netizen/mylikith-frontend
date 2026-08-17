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


        await loadOriginalComments();


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
   ORIGINAL SEO
========================================================= */

function updateOriginalSEO() {

    if (!original) {
        return;
    }


    const title =
        original.title ||
        "MyLikith Original";


    const description =
        original.description ||
        "Watch exclusive MyLikith Originals on MyLikith.";


    const language =
        original.language ||
        "Original";


    const category =
        original.category ||
        "Story";


    const coverImage =
        original.cover_url ||
        "https://mylikith.in/assets/images/og-image.jpg";


    const pageUrl =
        `${window.location.origin}/original?id=${encodeURIComponent(
            originalId
        )}`;


    /*
     * Keep descriptions reasonably sized
     * for search/social previews.
     */

    const cleanDescription =
        description
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 300);


    /*
     * Browser title
     */

    document.title =
        `${title} - MyLikith Originals`;


    /*
     * Description
     */

    const descriptionMeta =
        document.getElementById(
            "metaDescription"
        );


    if (descriptionMeta) {

        descriptionMeta.setAttribute(
            "content",
            cleanDescription
        );

    }


    /*
     * Keywords
     */

    const keywordsMeta =
        document.getElementById(
            "metaKeywords"
        );


    if (keywordsMeta) {

        keywordsMeta.setAttribute(
            "content",
            [
                "MyLikith Originals",
                title,
                language,
                category,
                "MyLikith",
                "original stories"
            ].join(", ")
        );

    }


    /*
     * Canonical URL
     */

    const canonical =
        document.getElementById(
            "canonicalUrl"
        );


    if (canonical) {

        canonical.setAttribute(
            "href",
            pageUrl
        );

    }


    /*
     * Open Graph title
     */

    const ogTitle =
        document.getElementById(
            "ogTitle"
        );


    if (ogTitle) {

        ogTitle.setAttribute(
            "content",
            title
        );

    }


    /*
     * Open Graph description
     */

    const ogDescription =
        document.getElementById(
            "ogDescription"
        );


    if (ogDescription) {

        ogDescription.setAttribute(
            "content",
            cleanDescription
        );

    }


    /*
     * Open Graph image
     */

    const ogImage =
        document.getElementById(
            "ogImage"
        );


    if (ogImage) {

        ogImage.setAttribute(
            "content",
            coverImage
        );

    }


    /*
     * Open Graph URL
     */

    const ogUrl =
        document.getElementById(
            "ogUrl"
        );


    if (ogUrl) {

        ogUrl.setAttribute(
            "content",
            pageUrl
        );

    }


    /*
     * Twitter / X title
     */

    const twitterTitle =
        document.getElementById(
            "twitterTitle"
        );


    if (twitterTitle) {

        twitterTitle.setAttribute(
            "content",
            title
        );

    }


    /*
     * Twitter / X description
     */

    const twitterDescription =
        document.getElementById(
            "twitterDescription"
        );


    if (twitterDescription) {

        twitterDescription.setAttribute(
            "content",
            cleanDescription
        );

    }


    /*
     * Twitter / X image
     */

    const twitterImage =
        document.getElementById(
            "twitterImage"
        );


    if (twitterImage) {

        twitterImage.setAttribute(
            "content",
            coverImage
        );

    }


    /*
     * Structured data
     */

    updateOriginalStructuredData(
        title,
        cleanDescription,
        coverImage,
        pageUrl,
        language,
        category
    );

}

/* =========================================================
   ORIGINAL STRUCTURED DATA
========================================================= */

function updateOriginalStructuredData(
    title,
    description,
    image,
    url,
    language,
    category
) {

    let schema =
        document.getElementById(
            "originalStructuredData"
        );


    if (!schema) {

        schema =
            document.createElement(
                "script"
            );

        schema.type =
            "application/ld+json";

        schema.id =
            "originalStructuredData";


        document.head.appendChild(
            schema
        );

    }


    const data = {

        "@context":
            "https://schema.org",

        "@type":
            "VideoObject",

        name:
            title,

        description:
            description,

        image:
            [
                image
            ],

        url:
            url,

        inLanguage:
            language,

        genre:
            category,

        publisher: {

            "@type":
                "Organization",

            name:
                "MyLikith",

            url:
                "https://mylikith.in"

        }

    };


    schema.textContent =
        JSON.stringify(
            data
        );

}

/* =========================================================
   RENDER ORIGINAL
========================================================= */

function renderOriginal() {

    updateOriginalSEO();

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


setupOriginalComments();

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
   ORIGINAL COMMENTS
========================================================= */

async function loadOriginalComments() {

    const container =
        document.getElementById(
            "originalComments"
        );

    const countElement =
        document.getElementById(
            "originalCommentCount"
        );


    if (!container) {
        return;
    }


    try {

const token =
    localStorage.getItem("token");


const response =
    await fetch(
        `${API}/api/originals/${originalId}/comments`,
        {
            headers: token
                ? {
                    Authorization:
                        `Bearer ${token}`
                }
                : {}
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
                "Unable to load comments."
            );

        }


        const comments =
            Array.isArray(data.comments)
                ? data.comments
                : [];


        if (countElement) {

            countElement.textContent =
                `${comments.length} ${
                    comments.length === 1
                        ? "Comment"
                        : "Comments"
                }`;

        }


        renderOriginalComments(
            comments
        );


    } catch (error) {

        console.error(
            "Original comments loading error:",
            error
        );


        container.innerHTML = `
            <div class="original-error">
                Unable to load comments.
            </div>
        `;

    }

}


function renderOriginalComments(
    comments
) {

    const container =
        document.getElementById(
            "originalComments"
        );


    if (!container) {
        return;
    }


    if (!comments.length) {

        container.innerHTML = `
            <div class="original-empty">

                <strong>
                    No comments yet.
                </strong>

                <p>
                    Be the first to share your thoughts.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML = "";


    comments.forEach(
        (comment) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "original-comment";


            const safeName =
                escapeHTML(
                    comment.user_name ||
                    "Reader"
                );


            const safeComment =
                escapeHTML(
                    comment.comment ||
                    ""
                );


            const profileImage =
                comment.profile_image
                    ? escapeHTML(
                        comment.profile_image
                    )
                    : "";


            item.innerHTML = `

                <div class="original-comment-avatar">

                    ${
                        profileImage
                            ? `
                                <img
                                    src="${profileImage}"
                                    alt="${safeName}"
                                >
                              `
                            : `
                                <span>
                                    ${safeName
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                              `
                    }

                </div>


                <div class="original-comment-content">

<div class="original-comment-header">

    <strong>
        ${safeName}
    </strong>

    <span>
        ${formatCommentDate(
            comment.created_at
        )}
    </span>

</div>


<p>
    ${safeComment}
</p>


${
    comment.is_owner
        ? `
            <button
                type="button"
                class="original-comment-delete"
                data-comment-id="${comment.id}"
            >
                Delete
            </button>
          `
        : ""
}

<button
    type="button"
    class="original-comment-report ${
        comment.is_reported
            ? "reported"
            : ""
    }"
    data-comment-id="${comment.id}"
    ${comment.is_reported ? "disabled" : ""}
>
    ${
        comment.is_reported
            ? "Reported"
            : "Report"
    }
</button>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

const deleteButtons =
    container.querySelectorAll(
        ".original-comment-delete"
    );


deleteButtons.forEach(
    (button) => {

        button.onclick = () => {

            deleteOriginalComment(
                button.dataset.commentId
            );

        };

    }
);

const reportButtons =
    container.querySelectorAll(
        ".original-comment-report"
    );


reportButtons.forEach(
    (button) => {

        button.onclick = () => {

            reportOriginalComment(
                button.dataset.commentId,
                button
            );

        };

    }
);

}

async function deleteOriginalComment(
    commentId
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


    const confirmed =
        confirm(
            "Are you sure you want to delete this comment?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/comments/${commentId}`,
                {
                    method: "DELETE",

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
                "Unable to delete comment."
            );

        }


        await loadOriginalComments();


    } catch (error) {

        console.error(
            "Original comment delete error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete comment."
        );

    }

}

async function reportOriginalComment(
    commentId,
    button
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


    const reason =
        prompt(
            "Why are you reporting this comment?\n\nYou can leave this blank."
        );


    if (reason === null) {
        return;
    }


    try {

        if (button) {

            button.disabled = true;

            button.textContent =
                "Reporting...";

        }


        const response =
            await fetch(
                `${API}/api/originals/${originalId}/comments/${commentId}/report`,
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
                            reason:
                                reason.trim()
                        })
                }
            );


        const data =
            await response.json();


        if (
            response.status === 409
        ) {

            throw new Error(
                "You have already reported this comment."
            );

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to report comment."
            );

        }


if (button) {

    button.textContent = "Reported";

    button.classList.add("reported");

    button.disabled = true;

}


alert(
    "Comment reported successfully."
);


    } catch (error) {

        console.error(
            "Original comment report error:",
            error
        );


        alert(
            error.message ||
            "Unable to report comment."
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                "Report";

        }

    }

}

function formatCommentDate(
    date
) {

    if (!date) {
        return "";
    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "";

    }


    return parsedDate.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function setupOriginalComments() {

    const input =
        document.getElementById(
            "originalCommentInput"
        );

    const submitButton =
        document.getElementById(
            "originalCommentSubmit"
        );

    const characters =
        document.getElementById(
            "originalCommentCharacters"
        );


    if (
        !input ||
        !submitButton
    ) {

        return;

    }


    input.addEventListener(
        "input",
        () => {

            if (characters) {

                characters.textContent =
                    `${input.value.length} / 1000`;

            }

        }
    );


    submitButton.onclick =
        submitOriginalComment;

}


async function submitOriginalComment() {

    const input =
        document.getElementById(
            "originalCommentInput"
        );


    const submitButton =
        document.getElementById(
            "originalCommentSubmit"
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


    if (!input) {
        return;
    }


    const comment =
        input.value.trim();


    if (!comment) {

        alert(
            "Please enter a comment."
        );

        input.focus();

        return;
    }


    if (comment.length > 1000) {

        alert(
            "Comment cannot exceed 1000 characters."
        );

        return;
    }


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Posting...";

    }


    try {

        const response =
            await fetch(
                `${API}/api/originals/${originalId}/comments`,
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
                            comment
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
                "Unable to post comment."
            );

        }


        input.value = "";


        const characters =
            document.getElementById(
                "originalCommentCharacters"
            );


        if (characters) {

            characters.textContent =
                "0 / 1000";

        }


        await loadOriginalComments();


    } catch (error) {

        console.error(
            "Original comment error:",
            error
        );


        alert(
            error.message ||
            "Unable to post comment."
        );


    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Post Comment";

        }

    }

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

        const shareDescription =
    original.description
        ? original.description
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 140)
        : "An exclusive MyLikith Original series.";


const shareText =
    `🎬 Watch ${original.title} on MyLikith Originals!\n\n` +
    `${shareDescription}\n\n` +
    `▶️ Watch now on MyLikith`;

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