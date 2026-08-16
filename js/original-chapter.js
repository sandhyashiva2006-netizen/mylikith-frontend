const ORIGINAL_CHAPTER_API =
    "https://mylikith-backend.onrender.com/api/originals";


let chapterId = null;
let originalChapterList = [];

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

const premiumTitle =
    document.getElementById(
        "premiumTitle"
    );

const premiumActions =
    document.getElementById(
        "premiumActions"
    );

const loginPremiumBtn =
    document.getElementById(
        "loginPremiumBtn"
    );

const unlockPremiumBtn =
    document.getElementById(
        "unlockPremiumBtn"
    );

const walletPremiumBtn =
    document.getElementById(
        "walletPremiumBtn"
    );

const episodeNavigation =
    document.getElementById(
        "episodeNavigation"
    );

const previousEpisodeBtn =
    document.getElementById(
        "previousEpisodeBtn"
    );

const nextEpisodeBtn =
    document.getElementById(
        "nextEpisodeBtn"
    );

let lockedChapterData = null;

let savedProgressPercent = 0;
let progressSaveTimer = null;
let lastProgressSaveTime = 0;
let progressRestorePending = false;

document.addEventListener(
    "DOMContentLoaded",
    initChapter
);


retryButton.addEventListener(
    "click",
    loadChapterVideo
);

loginPremiumBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            `login.html?redirect=${encodeURIComponent(
                window.location.href
            )}`;

    }
);

walletPremiumBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "wallet.html";

    }
);

unlockPremiumBtn.addEventListener(
    "click",
    unlockPremiumEpisode
);

video.addEventListener(
    "timeupdate",
    handleVideoProgress
);

video.addEventListener(
    "ended",
    () => {
        saveVideoProgress(
            100
        );
    }
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

        const token =
    localStorage.getItem("token");

const headers = {};

if (token) {

    headers.Authorization =
        `Bearer ${token}`;

}

const response =
    await fetch(
        `${ORIGINAL_CHAPTER_API}/chapter/${chapterId}/video`,
        {
            headers
        }
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


setupEpisodeNavigation(
    data.chapter.original_id,
    data.chapter.id
);

        const VIDEO_CDN =
    "https://mylikith-video-cdn.sandhyashiva2006.workers.dev";

const originalVideoUrl =
    new URL(data.url);

let videoPath =
    originalVideoUrl.pathname;

const bucketPrefix =
    "/mylikith-originals/";

if (videoPath.startsWith(bucketPrefix)) {
    videoPath =
        videoPath.substring(bucketPrefix.length - 1);
}

video.src =
    `${VIDEO_CDN}${videoPath}`;


        video.hidden =
            false;


        loading.hidden =
            true;


        errorBox.hidden =
            true;


video.load();

loadSavedVideoProgress();

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


    lockedChapterData =
        data.chapter || {};


    const chapter =
        lockedChapterData;


setupEpisodeNavigation(
    chapter.original_id,
    chapter.id
);

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


    premiumTitle.textContent =
        "Premium Episode";


    premiumMessage.textContent =
        data.message ||
        "This episode requires coins to unlock.";


const currentUser =
    JSON.parse(
        localStorage.getItem("user") || "null"
    );

const isLoggedIn =
    !!currentUser;


loginPremiumBtn.hidden =
    isLoggedIn;


unlockPremiumBtn.hidden =
    !isLoggedIn;


walletPremiumBtn.hidden =
    !isLoggedIn;


if (!isLoggedIn) {

    premiumTitle.textContent =
        "Login Required";

    premiumMessage.textContent =
        "Please login to watch this premium episode.";

    return;

}


    unlockPremiumBtn.textContent =
        `🪙 Unlock for ${
            Number(
                chapter.coins_required ||
                0
            )
        } Coins`;

}

async function unlockPremiumEpisode() {

    if (
        !chapterId ||
        !lockedChapterData
    ) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {

        window.location.href =
            `login.html?redirect=${encodeURIComponent(
                window.location.href
            )}`;

        return;
    }

    const coinsRequired =
        Number(
            lockedChapterData.coins_required || 0
        );

    if (coinsRequired <= 0) {

        alert(
            "This episode does not have a valid coin price."
        );

        return;
    }

    const confirmed =
        confirm(
            `Unlock "${lockedChapterData.title || "this episode"}" for ${coinsRequired} coins?`
        );

    if (!confirmed) {
        return;
    }

    unlockPremiumBtn.disabled =
        true;

    unlockPremiumBtn.textContent =
        "⏳ Unlocking...";

    try {

        const response =
            await fetch(
                `${ORIGINAL_CHAPTER_API}/chapter/${chapterId}/unlock`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (response.status === 401) {

            window.location.href =
                `login.html?redirect=${encodeURIComponent(
                    window.location.href
                )}`;

            return;
        }

        if (
            !response.ok ||
            !data.success
        ) {

            if (
                response.status === 400 &&
                data.message ===
                    "Not enough coins."
            ) {

                alert(
                    `You need ${data.coins_required} coins, but you only have ${data.coins_balance} coins.`
                );

                walletPremiumBtn.hidden =
                    false;

                return;
            }

            throw new Error(
                data.message ||
                "Unable to unlock episode."
            );
        }

        await loadChapterVideo();

    } catch (error) {

        console.error(
            "Episode unlock error:",
            error
        );

        alert(
            error.message ||
            "Unable to unlock episode."
        );

    } finally {

        unlockPremiumBtn.disabled =
            false;

        unlockPremiumBtn.textContent =
            `🪙 Unlock for ${coinsRequired} Coins`;

    }
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

/* =========================================================
   EPISODE NAVIGATION
========================================================= */

async function setupEpisodeNavigation(
    originalId,
    currentChapterId
) {

    if (
        !originalId ||
        !episodeNavigation
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                `${ORIGINAL_CHAPTER_API}/${originalId}/chapters`
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !Array.isArray(data.chapters)
        ) {
            return;
        }

        originalChapterList =
            data.chapters;


        const currentIndex =
            originalChapterList.findIndex(
                chapter =>
                    Number(chapter.id) ===
                    Number(currentChapterId)
            );


        if (
            currentIndex === -1
        ) {
            return;
        }


        const previousChapter =
            currentIndex > 0
                ? originalChapterList[
                    currentIndex - 1
                ]
                : null;


        const nextChapter =
            currentIndex <
            originalChapterList.length - 1
                ? originalChapterList[
                    currentIndex + 1
                ]
                : null;


        episodeNavigation.hidden =
            false;


        previousEpisodeBtn.hidden =
            !previousChapter;


        nextEpisodeBtn.hidden =
            !nextChapter;


        previousEpisodeBtn.onclick =
            () => {

                if (!previousChapter) {
                    return;
                }

                window.location.href =
                    `original-chapter.html?id=${encodeURIComponent(
                        previousChapter.id
                    )}`;

            };


        nextEpisodeBtn.onclick =
            () => {

                if (!nextChapter) {
                    return;
                }

                window.location.href =
                    `original-chapter.html?id=${encodeURIComponent(
                        nextChapter.id
                    )}`;

            };


    } catch (error) {

        console.error(
            "Episode navigation error:",
            error
        );

        episodeNavigation.hidden =
            true;

    }

}

/* =========================================================
   ORIGINAL EPISODE PROGRESS
========================================================= */

async function loadSavedVideoProgress() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response =
            await fetch(
                `${ORIGINAL_CHAPTER_API}/chapter/${chapterId}/progress`,
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
            !data.success
        ) {
            return;
        }


        savedProgressPercent =
            Number(
                data.progress_percent || 0
            );


        if (
            savedProgressPercent <= 0
        ) {
            return;
        }


        if (
            savedProgressPercent >= 100
        ) {
            return;
        }


        restoreVideoProgress();

    } catch (error) {

        console.error(
            "Load video progress error:",
            error
        );

    }

}


function restoreVideoProgress() {

    if (
        !savedProgressPercent ||
        !video.duration ||
        !Number.isFinite(
            video.duration
        )
    ) {
        progressRestorePending =
            true;

        return;
    }


    const resumeTime =
        video.duration *
        (
            savedProgressPercent /
            100
        );


    if (
        resumeTime > 0 &&
        resumeTime < video.duration
    ) {

        video.currentTime =
            resumeTime;

    }


    progressRestorePending =
        false;

}


function handleVideoProgress() {

    if (
        !video.duration ||
        !Number.isFinite(
            video.duration
        )
    ) {
        return;
    }


    const progressPercent =
        Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    (
                        video.currentTime /
                        video.duration
                    ) * 100
                )
            )
        );


    if (
        progressPercent <= 0
    ) {
        return;
    }


    const now =
        Date.now();


    if (
        now -
        lastProgressSaveTime <
        10000
    ) {
        return;
    }


    lastProgressSaveTime =
        now;


    saveVideoProgress(
        progressPercent
    );

}


async function saveVideoProgress(
    progressPercent
) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    Number(
                        progressPercent
                    )
                )
            )
        );


    if (
        !Number.isFinite(
            progress
        ) ||
        progress <= 0
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${ORIGINAL_CHAPTER_API}/chapter/${chapterId}/progress`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            progress_percent:
                                progress
                        })
                }
            );


        if (!response.ok) {

            console.error(
                "Unable to save video progress."
            );

            return;
        }


        savedProgressPercent =
            progress;

    } catch (error) {

        console.error(
            "Save video progress error:",
            error
        );

    }

}


video.addEventListener(
    "loadedmetadata",
    () => {

        if (
            progressRestorePending
        ) {
            restoreVideoProgress();
        }

    }
);


window.addEventListener(
    "beforeunload",
    () => {

        const token =
            localStorage.getItem(
                "token"
            );


        if (
            !token ||
            !video.duration ||
            !Number.isFinite(
                video.duration
            ) ||
            video.currentTime <= 0
        ) {
            return;
        }


        const progress =
            Math.min(
                100,
                Math.max(
                    0,
                    Math.round(
                        (
                            video.currentTime /
                            video.duration
                        ) * 100
                    )
                )
            );


        if (
            progress <= 0
        ) {
            return;
        }


        fetch(
            `${ORIGINAL_CHAPTER_API}/chapter/${chapterId}/progress`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify({
                        progress_percent:
                            progress
                    }),

                keepalive:
                    true
            }
        ).catch(
            () => {}
        );

    }
);

