document.addEventListener(
    "DOMContentLoaded",
    () => {

        bindAudioAdminTabs();

        bindAudioNovelCreateForm();

        bindAudioChapterCreateForm();

        loadAdminAudioNovels();

        loadAdminAudioChapters();

        loadAdminAudioComments();

        loadAdminAudioReports();

    }
);


function bindAudioAdminTabs(){

    const tabs =
        document.querySelectorAll(
            ".audio-admin-tab"
        );

    const sections =
        document.querySelectorAll(
            ".audio-admin-section"
        );


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.section;


                    tabs.forEach(
                        item => {

                            item.classList.toggle(
                                "active",
                                item === tab
                            );

                        }
                    );


                    sections.forEach(
                        section => {

                            section.classList.toggle(
                                "active",
                                section.id === target
                            );

                        }
                    );

                }
            );

        }
    );

}

/* =========================================================
   LOAD AUDIO NOVELS
   ========================================================= */

const ADMIN_AUDIO_API =
    "https://mylikith-backend.onrender.com/api/admin/audio";


async function loadAdminAudioNovels(){

    const container =
        document.getElementById(
            "audioNovelsList"
        );

    const count =
        document.getElementById(
            "audioNovelCount"
        );


    if(!container){
        return;
    }


    container.innerHTML = `
        <div class="audio-admin-loading">
            Loading Audio Novels...
        </div>
    `;


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/novels`,
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            localStorage.getItem("token")
                    }
                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to load Audio Novels."
            );

        }


        const audio =
            Array.isArray(data.audio)
                ? data.audio
                : [];


        if(count){

            count.textContent =
                audio.length;

        }


        renderAdminAudioNovels(
            audio
        );


    }catch(error){

        console.error(
            "Admin Audio Novels load error:",
            error
        );


        container.innerHTML = `
            <div class="audio-admin-loading">
                Failed to load Audio Novels.
            </div>
        `;

    }

}


/* =========================================================
   RENDER AUDIO NOVELS
   ========================================================= */

function renderAdminAudioNovels(
    audio
){

    const container =
        document.getElementById(
            "audioNovelsList"
        );


    if(!container){
        return;
    }


    if(!audio.length){

        container.innerHTML = `
            <div class="audio-admin-loading">
                No Audio Novels found.
            </div>
        `;

        return;
    }


    container.innerHTML =
        audio.map(
            item => {

                const cover =
                    item.cover_url ||
                    "assets/images/default-cover.jpg";


                const premium =
                    item.premium_only
                        ? `
                            <span
                                class="audio-admin-badge premium"
                            >
                                👑 Premium
                            </span>
                          `
                        : "";


                const featured =
                    item.featured
                        ? `
                            <span
                                class="audio-admin-badge featured"
                            >
                                ⭐ Featured
                            </span>
                          `
                        : "";


                const publishStatus =
                    String(
                        item.publish_status ||
                        ""
                    ).toLowerCase();


                const visibility =
                    String(
                        item.visibility ||
                        ""
                    ).toLowerCase();


                const published =
                    publishStatus ===
                    "published";


                return `

                    <article
                        class="audio-admin-novel-card"
                    >

                        <div
                            class="audio-admin-novel-cover"
                        >

                            <img
                                src="${escapeAdminAudioHtml(
                                    cover
                                )}"
                                alt="${escapeAdminAudioHtml(
                                    item.title
                                )}"
                                loading="lazy"
                                onerror="this.onerror=null;this.src='assets/images/default-cover.jpg';"
                            >

                        </div>


                        <div
                            class="audio-admin-novel-info"
                        >

                            <div
                                class="audio-admin-novel-title-row"
                            >

                                <h3>
                                    ${escapeAdminAudioHtml(
                                        item.title
                                    )}
                                </h3>


                                <div
                                    class="audio-admin-badges"
                                >

                                    ${premium}

                                    ${featured}

                                </div>

                            </div>


                            <p
                                class="audio-admin-writer"
                            >
                                ✍
                                ${escapeAdminAudioHtml(
                                    item.writer_name ||
                                    "Unknown writer"
                                )}
                            </p>


                            <div
                                class="audio-admin-meta"
                            >

                                <span>
                                    🌐
                                    ${escapeAdminAudioHtml(
                                        item.language ||
                                        "—"
                                    )}
                                </span>

                                <span>
                                    📂
                                    ${escapeAdminAudioHtml(
                                        item.category ||
                                        "—"
                                    )}
                                </span>

                                <span>
                                    👁
                                    ${Number(
                                        item.views || 0
                                    ).toLocaleString()}
                                </span>

                                <span>
                                    ❤️
                                    ${Number(
                                        item.likes || 0
                                    ).toLocaleString()}
                                </span>

                                <span>
                                    ⭐
                                    ${Number(
                                        item.rating || 0
                                    ).toFixed(1)}
                                    (${Number(
                                        item.rating_count || 0
                                    )})
                                </span>

                            </div>


                            <div
                                class="audio-admin-status-row"
                            >

                                <span
                                    class="audio-admin-status ${escapeAdminAudioHtml(
                                        publishStatus
                                    )}"
                                >
                                    ${escapeAdminAudioHtml(
                                        item.publish_status ||
                                        "unknown"
                                    )}
                                </span>


                                <span
                                    class="audio-admin-status visibility ${escapeAdminAudioHtml(
                                        visibility
                                    )}"
                                >
                                    ${escapeAdminAudioHtml(
                                        item.visibility ||
                                        "unknown"
                                    )}
                                </span>


                                <span
                                    class="audio-admin-id"
                                >
                                    ID: ${item.id}
                                </span>

                            </div>


                            <!-- ACTIONS -->

                            <div
                                class="audio-admin-novel-actions"
                            >

                                <button
                                    type="button"
                                    class="audio-novel-action edit"
                                    data-audio-novel-action="edit"
                                    data-audio-novel-id="${item.id}"
                                >
                                    ✏️ Edit
                                </button>


                                <button
                                    type="button"
                                    class="audio-novel-action publish"
                                    data-audio-novel-action="publish"
                                    data-audio-novel-id="${item.id}"
                                    data-published="${published}"
                                >
                                    ${
                                        published
                                            ? "📢 Unpublish"
                                            : "📢 Publish"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="audio-novel-action feature"
                                    data-audio-novel-action="featured"
                                    data-audio-novel-id="${item.id}"
                                    data-featured="${Boolean(
                                        item.featured
                                    )}"
                                >
                                    ${
                                        item.featured
                                            ? "⭐ Unfeature"
                                            : "⭐ Feature"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="audio-novel-action delete"
                                    data-audio-novel-action="delete"
                                    data-audio-novel-id="${item.id}"
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    bindAdminAudioNovelActions();

}

/* =========================================================
   AUDIO NOVEL ACTIONS
   ========================================================= */

function bindAdminAudioNovelActions(){

    document
        .querySelectorAll(
            "[data-audio-novel-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const action =
                            button.dataset
                                .audioNovelAction;

                        const novelId =
                            Number(
                                button.dataset
                                    .audioNovelId
                            );


                        if(
                            !Number.isInteger(
                                novelId
                            ) ||
                            novelId <= 0
                        ){

                            return;

                        }


                        if(
                            action ===
                            "edit"
                        ){

                            await editAdminAudioNovel(
                                novelId
                            );

                            return;

                        }


                        if(
                            action ===
                            "publish"
                        ){

                            const published =
                                button.dataset
                                    .published ===
                                "true";


                            await toggleAdminAudioNovelPublish(
                                novelId,
                                !published
                            );

                            return;

                        }


                        if(
                            action ===
                            "featured"
                        ){

                            const featured =
                                button.dataset
                                    .featured ===
                                "true";


                            await toggleAdminAudioNovelFeatured(
                                novelId,
                                !featured
                            );

                            return;

                        }


                        if(
                            action ===
                            "delete"
                        ){

                            await deleteAdminAudioNovel(
                                novelId
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   EDIT AUDIO NOVEL
   ========================================================= */

async function editAdminAudioNovel(
    novelId
){

    try{

        const listResponse =
    await fetch(
        `${ADMIN_AUDIO_API}/novels`,
        {
            headers: {

                Authorization:
                    "Bearer " +
                    localStorage.getItem(
                        "token"
                    )

            }
        }
    );


        const data =
            await listResponse.json();


        if(
            !listResponse.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to load Audio Novel."
            );

        }


        const novels =
            Array.isArray(
                data.audio
            )
                ? data.audio
                : [];


        const novel =
            novels.find(
                item =>
                    Number(item.id) ===
                    novelId
            );


        if(!novel){

            throw new Error(
                "Audio Novel not found."
            );

        }


        editingAudioNovelId =
            novelId;


        document
            .getElementById(
                "audioNovelTitle"
            )
            .value =
                novel.title || "";


        document
            .getElementById(
                "audioNovelDescription"
            )
            .value =
                novel.description || "";


        document
            .getElementById(
                "audioNovelCover"
            )
            .value =
                novel.cover_url || "";

        /*
        -------------------------------------------------
        EXISTING COVER INPUT / PREVIEW
        These elements are local to the create-form binder,
        so edit mode must resolve them again instead of
        referencing an out-of-scope variable.
        -------------------------------------------------
        */

        const coverFileInput =
            document.getElementById(
                "audioNovelCoverFile"
            );

        const coverPreviewWrap =
            document.getElementById(
                "audioNovelCoverPreviewWrap"
            );

        const coverPreview =
            document.getElementById(
                "audioNovelCoverPreview"
            );

        if(coverFileInput){
            coverFileInput.value = "";
        }

        if(coverPreview && novel.cover_url){
            coverPreview.src = novel.cover_url;

            if(coverPreviewWrap){
                coverPreviewWrap.hidden = false;
            }
        }else if(coverPreviewWrap){
            coverPreviewWrap.hidden = true;
        }


        document
            .getElementById(
                "audioNovelLanguage"
            )
            .value =
                novel.language || "";


        document
            .getElementById(
                "audioNovelCategory"
            )
            .value =
                novel.category || "";


        document
            .getElementById(
                "audioNovelCategories"
            )
            .value =
                Array.isArray(
                    novel.categories
                )
                    ? novel.categories.join(
                        ", "
                    )
                    : "";


        document
            .getElementById(
                "audioNovelContentType"
            )
            .value =
                novel.content_type ||
                "story";


        document
            .getElementById(
                "audioNovelStatus"
            )
            .value =
                novel.status ||
                "ongoing";


        document
            .getElementById(
                "audioNovelPublishStatus"
            )
            .value =
                novel.publish_status ||
                "draft";


        document
            .getElementById(
                "audioNovelVisibility"
            )
            .value =
                novel.visibility ||
                "private";


        document
            .getElementById(
                "audioNovelPremium"
            )
            .checked =
                Boolean(
                    novel.premium_only
                );


        document
            .getElementById(
                "audioNovelFeatured"
            )
            .checked =
                Boolean(
                    novel.featured
                );


        const releaseDate =
            document
                .getElementById(
                    "audioNovelReleaseDate"
                );


        if(
            novel.release_date
        ){

            const date =
                new Date(
                    novel.release_date
                );


            if(
                !Number.isNaN(
                    date.getTime()
                )
            ){

                const local =
                    new Date(
                        date.getTime() -
                        date.getTimezoneOffset()
                        * 60000
                    )
                    .toISOString()
                    .slice(
                        0,
                        16
                    );


                releaseDate.value =
                    local;

            }

        }else{

            releaseDate.value =
                "";

        }


        const panel =
            document.getElementById(
                "audioNovelCreateForm"
            );


        panel.hidden =
            false;


        const heading =
            panel.querySelector(
                ".audio-create-header h2"
            );


        if(heading){

            heading.textContent =
                "Edit Audio Novel";

        }


        const submitButton =
            document
                .getElementById(
                    "audioNovelForm"
                )
                .querySelector(
                    'button[type="submit"]'
                );


        if(submitButton){

            submitButton.textContent =
                "Update Audio Novel";

        }


        panel.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });


    }catch(error){

        console.error(
            "Audio Novel edit load error:",
            error
        );


        alert(
            error.message ||
            "Failed to load Audio Novel."
        );

    }

}


/* =========================================================
   PUBLISH / UNPUBLISH
   ========================================================= */

async function toggleAdminAudioNovelPublish(
    novelId,
    published
){

    const action =
        published
            ? "publish"
            : "unpublish";


    if(
        !confirm(
            `Are you sure you want to ${action} this Audio Novel?`
        )
    ){

        return;

    }


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/novels/${novelId}/publish`,
                {

                    method:
                        "PATCH",

                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            ),

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            published
                        })

                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to update publish status."
            );

        }


        await loadAdminAudioNovels();


    }catch(error){

        console.error(
            "Audio Novel publish error:",
            error
        );


        alert(
            error.message ||
            "Failed to update publish status."
        );

    }

}


/* =========================================================
   FEATURE / UNFEATURE
   ========================================================= */

async function toggleAdminAudioNovelFeatured(
    novelId,
    featured
){

    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/novels/${novelId}/featured`,
                {

                    method:
                        "PATCH",

                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            ),

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            featured
                        })

                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to update featured status."
            );

        }


        await loadAdminAudioNovels();


    }catch(error){

        console.error(
            "Audio Novel featured error:",
            error
        );


        alert(
            error.message ||
            "Failed to update featured status."
        );

    }

}


/* =========================================================
   DELETE AUDIO NOVEL
   ========================================================= */

async function deleteAdminAudioNovel(
    novelId
){

    if(
        !confirm(
            "Delete this Audio Novel?\n\nThis is allowed only when the novel has no chapters."
        )
    ){

        return;

    }


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/novels/${novelId}`,
                {

                    method:
                        "DELETE",

                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            )

                    }

                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to delete Audio Novel."
            );

        }


        alert(
            "Audio Novel deleted successfully."
        );


        await loadAdminAudioNovels();


    }catch(error){

        console.error(
            "Audio Novel delete error:",
            error
        );


        alert(
            error.message ||
            "Failed to delete Audio Novel."
        );

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeAdminAudioHtml(
    value
){

    return String(
        value ?? ""
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* =========================================================
   LOAD AUDIO CHAPTERS
   ========================================================= */

async function loadAdminAudioChapters(){

    const container =
        document.getElementById(
            "audioChaptersList"
        );

    const count =
        document.getElementById(
            "audioChapterCount"
        );

    if(!container){
        return;
    }


    container.innerHTML = `
        <div class="audio-admin-loading">
            Loading Audio Chapters...
        </div>
    `;


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/chapters`,
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            localStorage.getItem("token")
                    }
                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to load Audio Chapters."
            );

        }


        const chapters =
            Array.isArray(data.chapters)
                ? data.chapters
                : [];


        if(count){

            count.textContent =
                chapters.length;

        }


        populateAudioChapterNovelFilter(
            chapters
        );


        renderAdminAudioChapters(
            chapters
        );


    }catch(error){

        console.error(
            "Admin Audio Chapters load error:",
            error
        );


        container.innerHTML = `
            <div class="audio-admin-loading">
                Failed to load Audio Chapters.
            </div>
        `;

    }

}


/* =========================================================
   NOVEL FILTER
   ========================================================= */

function populateAudioChapterNovelFilter(
    chapters
){

    const select =
        document.getElementById(
            "audioChapterNovelFilter"
        );


    if(!select){
        return;
    }


    const novels =
        new Map();


    chapters.forEach(
        chapter => {

            if(
                chapter.audio_novel_id &&
                chapter.audio_novel_title
            ){

                novels.set(
                    String(
                        chapter.audio_novel_id
                    ),
                    chapter.audio_novel_title
                );

            }

        }
    );


    select.innerHTML = `
        <option value="all">
            All Audio Novels
        </option>
    `;


    Array.from(
        novels.entries()
    )
    .sort(
        (a,b) =>
            a[1].localeCompare(
                b[1]
            )
    )
    .forEach(
        ([id,title]) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = id;

            option.textContent =
                title;

            select.appendChild(
                option
            );

        }
    );


    select.onchange =
        () => {

            const selected =
                select.value;


            const filtered =
                selected === "all"
                    ? chapters
                    : chapters.filter(
                        chapter =>
                            String(
                                chapter.audio_novel_id
                            ) === selected
                    );


            renderAdminAudioChapters(
                filtered
            );

        };

}


/* =========================================================
   RENDER AUDIO CHAPTERS
   ========================================================= */

function renderAdminAudioChapters(
    chapters
){

    const container =
        document.getElementById(
            "audioChaptersList"
        );


    if(!container){
        return;
    }


    if(!chapters.length){

        container.innerHTML = `
            <div class="audio-admin-loading">
                No Audio Chapters found.
            </div>
        `;

        return;
    }


    container.innerHTML =
        chapters.map(
            chapter => {

                const duration =
                    formatAdminAudioDuration(
                        chapter.audio_duration_seconds
                    );


                const audioStatus =
                    String(
                        chapter.audio_status ||
                        "unknown"
                    );


                const published =
                    Boolean(
                        chapter.is_published
                    );


                const draft =
                    Boolean(
                        chapter.is_draft
                    );


                const premium =
                    Boolean(
                        chapter.is_premium
                    );


                return `

                    <article
                        class="audio-admin-chapter-card"
                    >

                        <div
                            class="audio-admin-chapter-number"
                        >
                            ${Number(
                                chapter.chapter_no || 0
                            )}
                        </div>


                        <div
                            class="audio-admin-chapter-info"
                        >

                            <div
                                class="audio-admin-chapter-title-row"
                            >

                                <div>

                                    <h3>
                                        ${escapeAdminAudioHtml(
                                            chapter.title ||
                                            "Untitled Chapter"
                                        )}
                                    </h3>

                                    <p>
                                        🎧
                                        ${escapeAdminAudioHtml(
                                            chapter.audio_novel_title ||
                                            "Unknown Audio Novel"
                                        )}
                                    </p>

                                </div>


                                <div
                                    class="audio-admin-badges"
                                >

                                    ${
                                        premium
                                            ? `
                                                <span
                                                    class="audio-admin-badge premium"
                                                >
                                                    👑 Premium
                                                </span>
                                              `
                                            : ""
                                    }


                                    ${
                                        draft
                                            ? `
                                                <span
                                                    class="audio-admin-badge draft"
                                                >
                                                    Draft
                                                </span>
                                              `
                                            : ""
                                    }

                                </div>

                            </div>


                            <div
                                class="audio-admin-chapter-meta"
                            >

                                <span>
                                    ⏱
                                    ${duration}
                                </span>

                                <span>
                                    🎵
                                    ${escapeAdminAudioHtml(
                                        audioStatus
                                    )}
                                </span>

                                <span>
                                    👁
                                    ${Number(
                                        chapter.views || 0
                                    ).toLocaleString()}
                                </span>

                                <span>
                                    ❤️
                                    ${Number(
                                        chapter.likes || 0
                                    ).toLocaleString()}
                                </span>

                                <span>
                                    ⭐
                                    ${Number(
                                        chapter.rating || 0
                                    ).toFixed(1)}
                                    (${Number(
                                        chapter.rating_count || 0
                                    )})
                                </span>

                            </div>


                            <div
                                class="audio-admin-chapter-status"
                            >

                                <span
                                    class="audio-admin-status ${
                                        published
                                            ? "published"
                                            : draft
                                                ? "draft"
                                                : ""
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


                                ${
                                    premium
                                        ? `
                                            <span
                                                class="audio-admin-status premium-status"
                                            >
                                                ${Number(
                                                    chapter.coins_required || 0
                                                )}
                                                coins
                                            </span>
                                          `
                                        : `
                                            <span
                                                class="audio-admin-status"
                                            >
                                                Free
                                            </span>
                                          `
                                }


                                ${
                                    chapter.early_access
                                        ? `
                                            <span
                                                class="audio-admin-status"
                                            >
                                                Early Access
                                            </span>
                                          `
                                        : ""
                                }


                                <span
                                    class="audio-admin-id"
                                >
                                    ID: ${chapter.id}
                                </span>

                            </div>


                            <!-- CHAPTER ACTIONS -->

                            <div
                                class="audio-admin-chapter-actions"
                            >

                                <button
                                    type="button"
                                    class="audio-chapter-action edit"
                                    data-audio-chapter-action="edit"
                                    data-audio-chapter-id="${chapter.id}"
                                >
                                    ✏️ Edit
                                </button>


                                <button
                                    type="button"
                                    class="audio-chapter-action publish"
                                    data-audio-chapter-action="publish"
                                    data-audio-chapter-id="${chapter.id}"
                                    data-published="${published}"
                                >
                                    ${
                                        published
                                            ? "📢 Unpublish"
                                            : "📢 Publish"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="audio-chapter-action delete"
                                    data-audio-chapter-action="delete"
                                    data-audio-chapter-id="${chapter.id}"
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    bindAdminAudioChapterActions();

}

/* =========================================================
   AUDIO CHAPTER ACTIONS
   ========================================================= */

function bindAdminAudioChapterActions(){

    document
        .querySelectorAll(
            "[data-audio-chapter-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const action =
                            button.dataset
                                .audioChapterAction;


                        const chapterId =
                            Number(
                                button.dataset
                                    .audioChapterId
                            );


                        if(
                            !Number.isInteger(
                                chapterId
                            ) ||
                            chapterId <= 0
                        ){

                            return;

                        }


                        if(
                            action ===
                            "edit"
                        ){

                            await editAdminAudioChapter(
                                chapterId
                            );

                            return;

                        }


                        if(
                            action ===
                            "publish"
                        ){

                            const published =
                                button.dataset
                                    .published ===
                                "true";


                            await toggleAdminAudioChapterPublish(
                                chapterId,
                                !published
                            );

                            return;

                        }


                        if(
                            action ===
                            "delete"
                        ){

                            await deleteAdminAudioChapter(
                                chapterId
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   EDIT AUDIO CHAPTER
   ========================================================= */

async function editAdminAudioChapter(
    chapterId
){

    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/chapters`,
                {
                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            )

                    }
                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to load Audio Chapters."
            );

        }


        const chapters =
            Array.isArray(
                data.chapters
            )
                ? data.chapters
                : [];


        const chapter =
            chapters.find(
                item =>
                    Number(item.id) ===
                    chapterId
            );


        if(!chapter){

            throw new Error(
                "Audio Chapter not found."
            );

        }


        editingAudioChapterId =
            chapterId;


        const panel =
            document.getElementById(
                "audioChapterCreateForm"
            );


        const form =
            document.getElementById(
                "audioChapterForm"
            );


        panel.hidden =
            false;


 await loadAudioNovelOptions();

document
    .getElementById(
        "audioChapterNovel"
    )
    .value =
        String(
            chapter.audio_novel_id
        );

        document
            .getElementById(
                "audioChapterNumber"
            )
            .value =
                chapter.chapter_no || "";


        document
            .getElementById(
                "audioChapterTitle"
            )
            .value =
                chapter.title || "";


        document
            .getElementById(
                "audioChapterPremium"
            )
            .value =
                chapter.is_premium
                    ? "premium"
                    : "free";


        document
            .getElementById(
                "audioChapterCoins"
            )
            .value =
                Number(
                    chapter.coins_required || 0
                );


        document
            .getElementById(
                "audioChapterEarlyAccess"
            )
            .checked =
                Boolean(
                    chapter.early_access
                );


        document
            .getElementById(
                "audioChapterPublishStatus"
            )
            .value =
                chapter.is_published
                    ? "published"
                    : "draft";


        const publishAt =
            document
                .getElementById(
                    "audioChapterPublishAt"
                );


        if(
            chapter.publish_at
        ){

            const date =
                new Date(
                    chapter.publish_at
                );


            if(
                !Number.isNaN(
                    date.getTime()
                )
            ){

                const local =
                    new Date(
                        date.getTime() -
                        date.getTimezoneOffset()
                        * 60000
                    )
                    .toISOString()
                    .slice(
                        0,
                        16
                    );


                publishAt.value =
                    local;

            }

        }else{

            publishAt.value =
                "";

        }


        /*
        -------------------------------------------------
        EXISTING AUDIO FILE
        -------------------------------------------------
        */

        const fileInput =
            document.getElementById(
                "audioChapterFile"
            );


        fileInput.value =
            "";


        fileInput.required =
            false;


        const fileInfo =
            document.getElementById(
                "audioChapterFileInfo"
            );


        fileInfo.hidden =
            false;


        document
            .getElementById(
                "audioChapterFileName"
            )
            .textContent =
                chapter.audio_original_name ||
                "Existing audio file";


        document
            .getElementById(
                "audioChapterFileSize"
            )
            .textContent =
                chapter.audio_size_bytes
                    ? formatAudioUploadSize(
                        Number(
                            chapter.audio_size_bytes
                        )
                    )
                    : "";


        document
            .getElementById(
                "audioChapterDuration"
            )
            .textContent =
                formatAudioUploadDuration(
                    Number(
                        chapter.audio_duration_seconds ||
                        0
                    )
                );


        /*
        -------------------------------------------------
        CHANGE FORM TITLE
        -------------------------------------------------
        */

        const heading =
            panel.querySelector(
                ".audio-create-header h2"
            );


        if(heading){

            heading.textContent =
                "Edit Audio Chapter";

        }


        const description =
            panel.querySelector(
                ".audio-create-header p"
            );


        if(description){

            description.textContent =
                "Update chapter details. Leave the audio file unchanged.";

        }


        const submitButton =
            document.getElementById(
                "submitAudioChapterBtn"
            );


        if(submitButton){

            submitButton.textContent =
                "Update Chapter";

        }


        panel.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });


    }catch(error){

        console.error(
            "Audio Chapter edit error:",
            error
        );


        alert(
            error.message ||
            "Failed to load Audio Chapter."
        );

    }

}


/* =========================================================
   PUBLISH / UNPUBLISH AUDIO CHAPTER
   ========================================================= */

async function toggleAdminAudioChapterPublish(
    chapterId,
    published
){

    const action =
        published
            ? "publish"
            : "unpublish";


    if(
        !confirm(
            `Are you sure you want to ${action} this Audio Chapter?`
        )
    ){

        return;

    }


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/chapters/${chapterId}/publish`,
                {

                    method:
                        "PATCH",

                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            ),

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            published
                        })

                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to update chapter publish status."
            );

        }


        await loadAdminAudioChapters();


    }catch(error){

        console.error(
            "Audio Chapter publish error:",
            error
        );


        alert(
            error.message ||
            "Failed to update chapter publish status."
        );

    }

}


/* =========================================================
   DELETE AUDIO CHAPTER
   ========================================================= */

async function deleteAdminAudioChapter(
    chapterId
){

    if(
        !confirm(
            "Delete this Audio Chapter?\n\nThe database record and stored audio file will be removed."
        )
    ){

        return;

    }


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/chapters/${chapterId}`,
                {

                    method:
                        "DELETE",

                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            )

                    }

                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to delete Audio Chapter."
            );

        }


        alert(
            "Audio Chapter deleted successfully."
        );


        await loadAdminAudioChapters();


    }catch(error){

        console.error(
            "Audio Chapter delete error:",
            error
        );


        alert(
            error.message ||
            "Failed to delete Audio Chapter."
        );

    }

}


/* =========================================================
   FORMAT DURATION
   ========================================================= */

function formatAdminAudioDuration(
    seconds
){

    const value =
        Number(seconds);


    if(
        !Number.isFinite(value) ||
        value <= 0
    ){

        return "—";

    }


    const total =
        Math.round(value);


    const minutes =
        Math.floor(
            total / 60
        );


    const remaining =
        total % 60;


    return `${minutes}:${String(
        remaining
    ).padStart(2,"0")}`;

}

/* =========================================================
   LOAD AUDIO COMMENTS
   ========================================================= */

async function loadAdminAudioComments(){

    const container =
        document.getElementById(
            "audioCommentsList"
        );

    const count =
        document.getElementById(
            "audioCommentCount"
        );

    if(!container){
        return;
    }

    container.innerHTML = `
        <div class="audio-admin-loading">
            Loading Audio Comments...
        </div>
    `;

    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/comments`,
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            localStorage.getItem("token")
                    }
                }
            );

        const data =
            await response.json();

        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to load Audio Comments."
            );

        }

        const comments =
            Array.isArray(data.comments)
                ? data.comments
                : [];

        if(count){
            count.textContent =
                comments.length;
        }

        renderAdminAudioComments(
            comments
        );

    }catch(error){

        console.error(
            "Admin Audio Comments load error:",
            error
        );

        container.innerHTML = `
            <div class="audio-admin-loading">
                Failed to load Audio Comments.
            </div>
        `;

    }

}


/* =========================================================
   RENDER AUDIO COMMENTS
   ========================================================= */

function renderAdminAudioComments(
    comments
){

    const container =
        document.getElementById(
            "audioCommentsList"
        );

    if(!container){
        return;
    }

    if(!comments.length){

        container.innerHTML = `
            <div class="audio-admin-loading">
                No Audio Comments found.
            </div>
        `;

        return;
    }

    container.innerHTML =
        comments.map(
            comment => {

                const date =
                    comment.created_at
                        ? new Date(
                            comment.created_at
                          ).toLocaleString()
                        : "—";

                return `

                    <article
                        class="audio-admin-comment-card"
                    >

                        <div
                            class="audio-admin-comment-avatar"
                        >

                            ${
                                comment.profile_image
                                    ? `
                                        <img
                                            src="${escapeAdminAudioHtml(
                                                comment.profile_image
                                            )}"
                                            alt=""
                                        >
                                      `
                                    : `
                                        <span>
                                            ${
                                                escapeAdminAudioHtml(
                                                    (
                                                        comment.user_name ||
                                                        "R"
                                                    )
                                                    .charAt(0)
                                                    .toUpperCase()
                                                )
                                            }
                                        </span>
                                      `
                            }

                        </div>


                        <div
                            class="audio-admin-comment-info"
                        >

                            <div
                                class="audio-admin-comment-header"
                            >

                                <div>

                                    <strong>
                                        ${escapeAdminAudioHtml(
                                            comment.user_name ||
                                            "Reader"
                                        )}
                                    </strong>

                                    <span>
                                        ${date}
                                    </span>

                                </div>

                                <span
                                    class="audio-admin-id"
                                >
                                    ID:
                                    ${comment.id}
                                </span>

                            </div>


                            <div
                                class="audio-admin-comment-context"
                            >

                                🎧
                                ${escapeAdminAudioHtml(
                                    comment.audio_novel_title ||
                                    "Unknown Audio"
                                )}

                                →

                                Chapter
                                ${Number(
                                    comment.chapter_no || 0
                                )}

                                :
                                ${escapeAdminAudioHtml(
                                    comment.chapter_title ||
                                    "Untitled"
                                )}

                            </div>


                            <p
                                class="audio-admin-comment-text"
                            >
                                ${escapeAdminAudioHtml(
                                    comment.comment
                                )}
                            </p>


                            <div
                                class="audio-admin-comment-actions"
                            >

                                <button
                                    type="button"
                                    class="audio-admin-delete-comment"
                                    data-comment-id="${comment.id}"
                                >
                                    🗑 Delete Comment
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    bindAdminAudioCommentActions();

}


/* =========================================================
   COMMENT ACTIONS
   ========================================================= */

function bindAdminAudioCommentActions(){

    document
        .querySelectorAll(
            ".audio-admin-delete-comment"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const commentId =
                            Number(
                                button.dataset.commentId
                            );

                        if(
                            !Number.isInteger(
                                commentId
                            ) ||
                            commentId <= 0
                        ){
                            return;
                        }


                        const confirmed =
                            confirm(
                                "Delete this audio comment? This action cannot be undone."
                            );


                        if(!confirmed){
                            return;
                        }


                        try{

                            const response =
                                await fetch(
                                    `${ADMIN_AUDIO_API}/comments/${commentId}`,
                                    {
                                        method:
                                            "DELETE",

                                        headers: {
                                            Authorization:
                                                "Bearer " +
                                                localStorage.getItem(
                                                    "token"
                                                )
                                        }
                                    }
                                );


                            const data =
                                await response.json();


                            if(
                                !response.ok ||
                                !data.success
                            ){

                                throw new Error(
                                    data.message ||
                                    "Failed to delete comment."
                                );

                            }


                            await loadAdminAudioComments();


                        }catch(error){

                            console.error(
                                "Admin Audio Comment delete error:",
                                error
                            );

                            alert(
                                error.message ||
                                "Failed to delete comment."
                            );

                        }

                    }
                );

            }
        );

}

/* =========================================================
   LOAD AUDIO REPORTS
   ========================================================= */

async function loadAdminAudioReports(){

    const container =
        document.getElementById(
            "audioReportsList"
        );

    const count =
        document.getElementById(
            "audioReportCount"
        );


    if(!container){
        return;
    }


    container.innerHTML = `
        <div class="audio-admin-loading">
            Loading Audio Reports...
        </div>
    `;


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/reports`,
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            )
                    }
                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to load Audio Reports."
            );

        }


        const reports =
            Array.isArray(
                data.reports
            )
                ? data.reports
                : [];


        if(count){

            const pending =
                reports.filter(
                    report =>
                        String(
                            report.status ||
                            "pending"
                        ).toLowerCase() ===
                        "pending"
                ).length;

            count.textContent =
                pending;

        }


        renderAdminAudioReports(
            reports
        );


    }catch(error){

        console.error(
            "Admin Audio Reports load error:",
            error
        );


        container.innerHTML = `
            <div class="audio-admin-loading">
                Failed to load Audio Reports.
            </div>
        `;

    }

}


/* =========================================================
   RENDER AUDIO REPORTS
   ========================================================= */

function renderAdminAudioReports(
    reports
){

    const container =
        document.getElementById(
            "audioReportsList"
        );


    if(!container){
        return;
    }


    if(!reports.length){

        container.innerHTML = `
            <div class="audio-admin-loading">
                🎉 No Audio Reports found.
            </div>
        `;

        return;

    }


    container.innerHTML =
        reports.map(
            report => {

                const status =
                    String(
                        report.status ||
                        "pending"
                    ).toLowerCase();


                const date =
                    report.created_at
                        ? new Date(
                            report.created_at
                          ).toLocaleString()
                        : "—";


                const isChapterReport =
                    report.report_type ===
                    "audio_chapter_comment";


                const location =
                    isChapterReport
                        ? `
                            Chapter
                            ${Number(
                                report.chapter_no || 0
                            )}
                            :
                            ${escapeAdminAudioHtml(
                                report.chapter_title ||
                                "Untitled"
                            )}
                          `
                        : "Audio Novel Comment";


                return `

                    <article
                        class="audio-admin-report-card"
                    >

                        <div
                            class="audio-admin-report-header"
                        >

                            <div>

                                <span
                                    class="audio-admin-report-type"
                                >
                                    ${
                                        isChapterReport
                                            ? "🎧 Chapter Comment"
                                            : "🎧 Audio Comment"
                                    }
                                </span>

                                <h3>
                                    ${escapeAdminAudioHtml(
                                        report.audio_novel_title ||
                                        "Unknown Audio"
                                    )}
                                </h3>

                            </div>


                            <span
                                class="audio-admin-report-status ${escapeAdminAudioHtml(
                                    status
                                )}"
                            >
                                ${escapeAdminAudioHtml(
                                    status
                                )}
                            </span>

                        </div>


                        <div
                            class="audio-admin-report-context"
                        >

                            📖
                            ${location}

                        </div>


                        <div
                            class="audio-admin-report-comment"
                        >

                            <span>
                                Reported Comment
                            </span>

                            <p>
                                ${escapeAdminAudioHtml(
                                    report.comment
                                )}
                            </p>

                        </div>


                        <div
                            class="audio-admin-report-details"
                        >

                            <div>

                                <span>
                                    👤 Commenter
                                </span>

                                <strong>
                                    ${escapeAdminAudioHtml(
                                        report.commenter_name ||
                                        "Reader"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    🚩 Reporter
                                </span>

                                <strong>
                                    ${escapeAdminAudioHtml(
                                        report.reporter_name ||
                                        "Reader"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    📝 Reason
                                </span>

                                <strong>
                                    ${escapeAdminAudioHtml(
                                        report.reason ||
                                        "No reason provided"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    📅 Reported
                                </span>

                                <strong>
                                    ${escapeAdminAudioHtml(
                                        date
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div
                            class="audio-admin-report-actions"
                        >

                            ${
                                status === "pending"
                                    ? `

                                        <button
                                            type="button"
                                            class="audio-report-resolve"
                                            data-report-id="${report.report_id}"
                                            data-report-type="${report.report_type}"
                                        >
                                            ✅ Resolve
                                        </button>


                                        <button
                                            type="button"
                                            class="audio-report-reject"
                                            data-report-id="${report.report_id}"
                                            data-report-type="${report.report_type}"
                                        >
                                            ❌ Reject
                                        </button>

                                      `
                                    : `
                                        <span
                                            class="audio-admin-reviewed-label"
                                        >
                                            Reviewed
                                        </span>
                                      `
                            }

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    bindAdminAudioReportActions();

}


/* =========================================================
   REPORT ACTIONS
   ========================================================= */

function bindAdminAudioReportActions(){

    document
        .querySelectorAll(
            ".audio-report-resolve"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateAdminAudioReport(
                            button.dataset.reportType,
                            button.dataset.reportId,
                            "resolved"
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".audio-report-reject"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateAdminAudioReport(
                            button.dataset.reportType,
                            button.dataset.reportId,
                            "rejected"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   UPDATE REPORT STATUS
   ========================================================= */

async function updateAdminAudioReport(
    reportType,
    reportId,
    status
){

    const action =
        status === "resolved"
            ? "resolve"
            : "reject";


    const confirmed =
        confirm(
            `Are you sure you want to ${action} this report?`
        );


    if(!confirmed){
        return;
    }


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/reports/${encodeURIComponent(
                    reportType
                )}/${encodeURIComponent(
                    reportId
                )}`,
                {
                    method:
                        "PATCH",

                    headers: {
                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            ),

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            status
                        })
                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to update report."
            );

        }


        await loadAdminAudioReports();


    }catch(error){

        console.error(
            "Admin Audio Report update error:",
            error
        );


        alert(
            error.message ||
            "Failed to update report."
        );

    }

}

/* =========================================================
   AUDIO NOVEL EDIT STATE
   ========================================================= */

let editingAudioNovelId = null;


/* =========================================================
   AUDIO NOVEL COVER UPLOAD
   ========================================================= */

async function uploadAudioNovelCover(novelId, file){

    if(!novelId || !(file instanceof File)){
        return null;
    }

    const allowedTypes = new Set([
        "image/jpeg",
        "image/png",
        "image/webp"
    ]);

    if(!allowedTypes.has(file.type)){
        throw new Error(
            "Please select a JPG, PNG or WebP cover image."
        );
    }

    if(file.size <= 0 || file.size > 5 * 1024 * 1024){
        throw new Error(
            "Cover image must be 5 MB or smaller."
        );
    }

    const token =
        localStorage.getItem("token");

    const startResponse =
        await fetch(
            `${ADMIN_AUDIO_API}/novels/${novelId}/cover/start`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        "Bearer " + token,
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    file_name: file.name,
                    mime_type: file.type,
                    file_size: file.size
                })
            }
        );

    const startData =
        await startResponse.json();

    if(
        !startResponse.ok ||
        !startData.success
    ){
        throw new Error(
            startData.message ||
            "Unable to prepare cover upload."
        );
    }

    const uploadResponse =
        await fetch(
            startData.upload_url,
            {
                method: "PUT",
                headers: {
                    "Content-Type": file.type
                },
                body: file
            }
        );

    if(!uploadResponse.ok){
        throw new Error(
            "Cover image upload failed."
        );
    }

    const completeResponse =
        await fetch(
            `${ADMIN_AUDIO_API}/novels/${novelId}/cover/complete`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        "Bearer " + token,
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    object_key:
                        startData.object_key,
                    public_url:
                        startData.public_url
                })
            }
        );

    const completeData =
        await completeResponse.json();

    if(
        !completeResponse.ok ||
        !completeData.success
    ){
        throw new Error(
            completeData.message ||
            "Unable to save uploaded cover."
        );
    }

    return completeData.cover_url;
}


/* =========================================================
   AUDIO NOVEL CREATE FORM
   ========================================================= */

function bindAudioNovelCreateForm(){

    const openButton =
        document.getElementById(
            "createAudioNovelBtn"
        );

    const closeButton =
        document.getElementById(
            "closeAudioNovelForm"
        );

    const cancelButton =
        document.getElementById(
            "cancelAudioNovelBtn"
        );

    const form =
        document.getElementById(
            "audioNovelForm"
        );

    const panel =
        document.getElementById(
            "audioNovelCreateForm"
        );

    const coverFileInput =
        document.getElementById(
            "audioNovelCoverFile"
        );

    const coverPreviewWrap =
        document.getElementById(
            "audioNovelCoverPreviewWrap"
        );

    const coverPreview =
        document.getElementById(
            "audioNovelCoverPreview"
        );


    if(
        !openButton ||
        !closeButton ||
        !cancelButton ||
        !form ||
        !panel
    ){

        return;

    }


    function openForm(){

        panel.hidden = false;

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


function closeForm(){

    editingAudioNovelId = null;

    panel.hidden = true;

    form.reset();

    if(coverPreviewWrap){
        coverPreviewWrap.hidden = true;
    }

    if(coverPreview){
        coverPreview.removeAttribute("src");
    }

    document
        .getElementById(
            "audioNovelContentType"
        )
        .value = "story";

    document
        .getElementById(
            "audioNovelStatus"
        )
        .value = "ongoing";

    document
        .getElementById(
            "audioNovelPublishStatus"
        )
        .value = "draft";

    document
        .getElementById(
            "audioNovelVisibility"
        )
        .value = "private";


    const heading =
        panel.querySelector(
            ".audio-create-header h2"
        );

    if(heading){

        heading.textContent =
            "Create Audio Novel";

    }


    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );

    if(submitButton){

        submitButton.textContent =
            "Create Audio Novel";

    }

}


    openButton.addEventListener(
    "click",
    () => {

        editingAudioNovelId =
            null;

        const heading =
            panel.querySelector(
                ".audio-create-header h2"
            );

        if(heading){

            heading.textContent =
                "Create Audio Novel";

        }


        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );

        if(submitButton){

            submitButton.textContent =
                "Create Audio Novel";

        }


        openForm();

    }
);


    closeButton.addEventListener(
        "click",
        closeForm
    );


    cancelButton.addEventListener(
        "click",
        closeForm
    );


    if(coverFileInput){

        coverFileInput.addEventListener(
            "change",
            () => {

                const file =
                    coverFileInput.files[0];

                if(!file){
                    if(coverPreviewWrap){
                        coverPreviewWrap.hidden = true;
                    }
                    return;
                }

                const allowedTypes = new Set([
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ]);

                if(!allowedTypes.has(file.type)){
                    alert(
                        "Please select a JPG, PNG or WebP image."
                    );
                    coverFileInput.value = "";
                    return;
                }

                if(file.size > 5 * 1024 * 1024){
                    alert(
                        "Cover image must be 5 MB or smaller."
                    );
                    coverFileInput.value = "";
                    return;
                }

                const objectUrl =
                    URL.createObjectURL(file);

                if(coverPreview){
                    coverPreview.src = objectUrl;
                }

                if(coverPreviewWrap){
                    coverPreviewWrap.hidden = false;
                }

            }
        );

    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const title =
                document
                    .getElementById(
                        "audioNovelTitle"
                    )
                    .value
                    .trim();


            if(!title){

                alert(
                    "Audio Novel title is required."
                );

                return;

            }


            const categoriesText =
                document
                    .getElementById(
                        "audioNovelCategories"
                    )
                    .value
                    .trim();


            const categories =
                categoriesText
                    ? categoriesText
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean)
                    : [];


            const releaseDate =
                document
                    .getElementById(
                        "audioNovelReleaseDate"
                    )
                    .value;

            const coverFile =
                coverFileInput?.files?.[0] || null;

            const coverUrlInput =
                document
                    .getElementById(
                        "audioNovelCover"
                    )
                    .value
                    .trim();


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


submitButton.disabled =
    true;

submitButton.textContent =
    editingAudioNovelId
        ? "Updating..."
        : "Creating...";


            try{

const response =
    await fetch(
        editingAudioNovelId
            ? `${ADMIN_AUDIO_API}/novels/${editingAudioNovelId}`
            : `${ADMIN_AUDIO_API}/novels`,
        {

            method:
                editingAudioNovelId
                    ? "PUT"
                    : "POST",

                            headers: {

                                Authorization:
                                    "Bearer " +
                                    localStorage.getItem(
                                        "token"
                                    ),

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    title,

                                    description:
                                        document
                                            .getElementById(
                                                "audioNovelDescription"
                                            )
                                            .value
                                            .trim(),

                                    cover_url:
                                        coverUrlInput,

                                    language:
                                        document
                                            .getElementById(
                                                "audioNovelLanguage"
                                            )
                                            .value,

                                    category:
                                        document
                                            .getElementById(
                                                "audioNovelCategory"
                                            )
                                            .value
                                            .trim(),

                                    categories,

                                    content_type:
                                        document
                                            .getElementById(
                                                "audioNovelContentType"
                                            )
                                            .value,

                                    status:
                                        document
                                            .getElementById(
                                                "audioNovelStatus"
                                            )
                                            .value,

                                    publish_status:
                                        document
                                            .getElementById(
                                                "audioNovelPublishStatus"
                                            )
                                            .value,

                                    visibility:
                                        document
                                            .getElementById(
                                                "audioNovelVisibility"
                                            )
                                            .value,

                                    premium_only:
                                        document
                                            .getElementById(
                                                "audioNovelPremium"
                                            )
                                            .checked,

                                    featured:
                                        document
                                            .getElementById(
                                                "audioNovelFeatured"
                                            )
                                            .checked,

                                    release_date:
                                        releaseDate ||
                                        null

                                })

                        }
                    );


                const data =
                    await response.json();


                if(
                    !response.ok ||
                    !data.success
                ){

                    throw new Error(
                        data.message ||
                        "Failed to create Audio Novel."
                    );

                }


                if(coverFile){

                    submitButton.textContent =
                        "Uploading Cover...";

                    const savedNovel =
                        data.audio ||
                        data.novel ||
                        data.audio_novel ||
                        null;

                    const novelId =
                        savedNovel?.id ||
                        editingAudioNovelId;

                    if(!novelId){
                        throw new Error(
                            "Audio Novel was saved, but its ID was not returned for cover upload."
                        );
                    }

                    await uploadAudioNovelCover(
                        novelId,
                        coverFile
                    );

                }


               alert(
    editingAudioNovelId
        ? "Audio Novel updated successfully."
        : "Audio Novel created successfully."
);


                closeForm();


                await loadAdminAudioNovels();


            }catch(error){

                console.error(
                    "Audio Novel creation error:",
                    error
                );


                alert(
                    error.message ||
                    "Failed to create Audio Novel."
                );


            }finally{

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    editingAudioNovelId
                        ? "Update Audio Novel"
                        : "Create Audio Novel";

            }

        }
    );

}

/* =========================================================
   AUDIO CHAPTER EDIT STATE
   ========================================================= */

let editingAudioChapterId = null;

/* =========================================================
   AUDIO CHAPTER CREATION
   ========================================================= */

function bindAudioChapterCreateForm(){

    const openButton =
        document.getElementById(
            "createAudioChapterBtn"
        );

    const closeButton =
        document.getElementById(
            "closeAudioChapterForm"
        );

    const cancelButton =
        document.getElementById(
            "cancelAudioChapterBtn"
        );

    const form =
        document.getElementById(
            "audioChapterForm"
        );

    const panel =
        document.getElementById(
            "audioChapterCreateForm"
        );


    if(
        !openButton ||
        !closeButton ||
        !cancelButton ||
        !form ||
        !panel
    ){

        return;

    }


openButton.addEventListener(
    "click",
    async () => {

        editingAudioChapterId =
            null;


        panel.hidden =
            false;


        const heading =
            panel.querySelector(
                ".audio-create-header h2"
            );


        if(heading){

            heading.textContent =
                "Create Audio Chapter";

        }


        const description =
            panel.querySelector(
                ".audio-create-header p"
            );


        if(description){

            description.textContent =
                "Add a chapter and upload its audio file.";

        }


        const submitButton =
            document.getElementById(
                "submitAudioChapterBtn"
            );


        if(submitButton){

            submitButton.textContent =
                "Create & Upload Chapter";

        }


        fileInput.required =
            true;


        await loadAudioNovelOptions();


        panel.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }
);


function closeForm(){

editingAudioChapterId = null;

    panel.hidden = true;

        form.reset();

        document
            .getElementById(
                "audioChapterCoins"
            )
            .value = 0;

        document
            .getElementById(
                "audioChapterUploadProgress"
            )
            .hidden = true;

        document
            .getElementById(
                "audioChapterFileInfo"
            )
            .hidden = true;

fileInput.required = true;

    }


    closeButton.addEventListener(
        "click",
        closeForm
    );


    cancelButton.addEventListener(
        "click",
        closeForm
    );


    const fileInput =
        document.getElementById(
            "audioChapterFile"
        );


    fileInput.addEventListener(
        "change",
        async () => {

            const file =
                fileInput.files[0];
if(!file){

                return;

            }


            if(
                !file.type.startsWith(
                    "audio/"
                )
            ){

                alert(
                    "Please select a valid audio file."
                );

                fileInput.value = "";

                return;

            }


            document
                .getElementById(
                    "audioChapterFileInfo"
                )
                .hidden = false;


            document
                .getElementById(
                    "audioChapterFileName"
                )
                .textContent =
                    file.name;


            document
                .getElementById(
                    "audioChapterFileSize"
                )
                .textContent =
                    formatAudioUploadSize(
                        file.size
                    );


            try{

                let duration = null;

if(file instanceof File){

    duration =
        await getAudioFileDuration(
            file
        );

}


                document
                    .getElementById(
                        "audioChapterDuration"
                    )
                    .textContent =
                        formatAudioUploadDuration(
                            duration
                        );


            }catch(error){

                console.error(
                    "Audio duration detection error:",
                    error
                );

                document
                    .getElementById(
                        "audioChapterDuration"
                    )
                    .textContent =
                        "Unable to detect";

            }

        }
    );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const novelId =
                Number(
                    document
                        .getElementById(
                            "audioChapterNovel"
                        )
                        .value
                );


            const chapterNo =
                Number(
                    document
                        .getElementById(
                            "audioChapterNumber"
                        )
                        .value
                );


            const title =
                document
                    .getElementById(
                        "audioChapterTitle"
                    )
                    .value
                    .trim();


            const file =
                fileInput.files[0];

            const isEditing =
                Number.isInteger(
                    editingAudioChapterId
                ) &&
                editingAudioChapterId > 0;


if(
    !isEditing &&
    !(file instanceof File)
){

    alert(
        "Please select an audio file."
    );

    submitButton.disabled = false;

    return;

}

            if(
                !Number.isInteger(
                    novelId
                ) ||
                novelId <= 0
            ){

                alert(
                    "Please select an Audio Novel."
                );

                return;

            }


            if(
                !Number.isInteger(
                    chapterNo
                ) ||
                chapterNo <= 0
            ){

                alert(
                    "Enter a valid chapter number."
                );

                return;

            }


            if(!title){

                alert(
                    "Chapter title is required."
                );

                return;

            }


if(
    !file &&
    !isEditing
){

    alert(
        "Please select an audio file."
    );

    return;

}


            const premium =
                document
                    .getElementById(
                        "audioChapterPremium"
                    )
                    .value ===
                    "premium";


            const coins =
                Number(
                    document
                        .getElementById(
                            "audioChapterCoins"
                        )
                        .value || 0
                );


            const earlyAccess =
                document
                    .getElementById(
                        "audioChapterEarlyAccess"
                    )
                    .checked;


            const publishStatus =
                document
                    .getElementById(
                        "audioChapterPublishStatus"
                    )
                    .value;


            const publishAt =
                document
                    .getElementById(
                        "audioChapterPublishAt"
                    )
                    .value;


            const submitButton =
                document.getElementById(
                    "submitAudioChapterBtn"
                );


            submitButton.disabled =
                true;


            try{

                /*
                ---------------------------------------------
                DETECT DURATION
                ---------------------------------------------
                */

                let duration = null;

if(file instanceof File){

    duration =
        await getAudioFileDuration(
            file
        );

}


                /*
---------------------------------------------
CREATE / UPDATE CHAPTER
---------------------------------------------
*/

setAudioUploadStatus(
    isEditing
        ? "Updating chapter..."
        : "Creating chapter..."
);


let chapterId;


if(
    isEditing
){

    const updateResponse =
        await fetch(
            `${ADMIN_AUDIO_API}/chapters/${editingAudioChapterId}`,
            {

                method:
                    "PUT",

                headers: {

                    Authorization:
                        "Bearer " +
                        localStorage.getItem(
                            "token"
                        ),

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        chapter_no:
                            chapterNo,

                        title,

                        is_premium:
                            premium,

                        coins_required:
                            premium
                                ? coins
                                : 0,

                        early_access:
                            earlyAccess,

                        is_draft:
                            publishStatus ===
                            "draft",

                        is_published:
                            publishStatus ===
                            "published",

                        publish_at:
                            publishAt ||
                            null

                    })

            }
        );


    const updateData =
        await updateResponse.json();


    if(
        !updateResponse.ok ||
        !updateData.success
    ){

        throw new Error(
            updateData.message ||
            "Failed to update chapter."
        );

    }


    chapterId =
        editingAudioChapterId;


}else{

    const chapterResponse =
        await fetch(
            `${ADMIN_AUDIO_API}/chapters`,
            {

                method:
                    "POST",

                headers: {

                    Authorization:
                        "Bearer " +
                        localStorage.getItem(
                            "token"
                        ),

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        audio_novel_id:
                            novelId,

                        chapter_no:
                            chapterNo,

                        title,

                        is_premium:
                            premium,

                        coins_required:
                            premium
                                ? coins
                                : 0,

                        early_access:
                            earlyAccess,

                        is_draft:
                            publishStatus ===
                            "draft",

                        is_published:
                            publishStatus ===
                            "published",

                        publish_at:
                            publishAt ||
                            null

                    })

            }
        );


    const chapterData =
        await chapterResponse.json();


    if(
        !chapterResponse.ok ||
        !chapterData.success
    ){

        throw new Error(
            chapterData.message ||
            "Failed to create chapter."
        );

    }


    chapterId =
        Number(
            chapterData.chapter.id
        );

}


                /*
                ---------------------------------------------
                METADATA-ONLY EDIT
                ---------------------------------------------
                */

                if(
                    isEditing &&
                    !file
                ){
                    alert(
                        "Audio Chapter updated successfully."
                    );

                    closeForm();

                    await loadAdminAudioChapters();

                    return;
                }

                /*
                ---------------------------------------------
                START B2 UPLOAD
                ---------------------------------------------
                */

                setAudioUploadStatus(
                    "Starting secure upload..."
                );


                const startResponse =
                    await fetch(
                        `${ADMIN_AUDIO_API}/chapters/${chapterId}/media/start`,
                        {

                            method:
                                "POST",

                            headers: {

                                Authorization:
                                    "Bearer " +
                                    localStorage.getItem(
                                        "token"
                                    ),

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    file_name:
                                        file.name,

                                    mime_type:
                                        file.type,

                                    file_size:
                                        file.size

                                })

                        }
                    );


                const startData =
                    await startResponse.json();


if(
    isEditing &&
    !file
){

    alert(
        "Audio Chapter updated successfully."
    );

    closeForm();

    await loadAdminAudioChapters();

    return;

}

                if(
                    !startResponse.ok ||
                    !startData.success
                ){

                    throw new Error(
                        startData.message ||
                        "Unable to start audio upload."
                    );

                }


                /*
                ---------------------------------------------
                MULTIPART UPLOAD
                ---------------------------------------------
                */

                const uploadResult =
                    await uploadAudioMultipart(
                        chapterId,
                        startData.upload_id,
                        startData.object_key,
                        file,
                        Number(
                            startData.part_size ||
                            10 * 1024 * 1024
                        )
                    );


                /*
                ---------------------------------------------
                COMPLETE UPLOAD
                ---------------------------------------------
                */

                setAudioUploadStatus(
                    "Finalizing audio..."
                );


                const completeResponse =
                    await fetch(
                        `${ADMIN_AUDIO_API}/chapters/${chapterId}/media/complete`,
                        {

                            method:
                                "POST",

                            headers: {

                                Authorization:
                                    "Bearer " +
                                    localStorage.getItem(
                                        "token"
                                    ),

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    upload_id:
                                        startData.upload_id,

                                    object_key:
                                        startData.object_key,

                                    parts:
                                        uploadResult.parts,

                                    duration_seconds:
                                        duration

                                })

                        }
                    );


                const completeData =
                    await completeResponse.json();


                if(
                    !completeResponse.ok ||
                    !completeData.success
                ){

                    throw new Error(
                        completeData.message ||
                        "Unable to complete audio upload."
                    );

                }


                setAudioUploadProgress(
                    100
                );


                setAudioUploadStatus(
                    "Audio upload completed."
                );


                alert(
                    isEditing
                        ? "Audio Chapter updated and uploaded successfully."
                        : "Audio Chapter created and uploaded successfully."
                );


                closeForm();


                await loadAdminAudioChapters();


            }catch(error){

                console.error(
                    "Audio Chapter creation error:",
                    error
                );


                alert(
                    error.message ||
                    "Failed to create Audio Chapter."
                );


            }finally{

                submitButton.disabled =
                    false;

            }

        }
    );

}


/* =========================================================
   LOAD AUDIO NOVEL OPTIONS
   ========================================================= */

async function loadAudioNovelOptions(){

    const select =
        document.getElementById(
            "audioChapterNovel"
        );


    if(!select){
        return;
    }


    try{

        const response =
            await fetch(
                `${ADMIN_AUDIO_API}/novels`,
                {
                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            )

                    }
                }
            );


        const data =
            await response.json();


        if(
            !response.ok ||
            !data.success
        ){

            throw new Error(
                data.message ||
                "Failed to load Audio Novels."
            );

        }


        const novels =
            Array.isArray(
                data.audio
            )
                ? data.audio
                : [];


        select.innerHTML = `
            <option value="">
                Select Audio Novel
            </option>
        `;


        novels.forEach(
            novel => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    novel.id;

                option.textContent =
                    novel.title;

                select.appendChild(
                    option
                );

            }
        );


    }catch(error){

        console.error(
            "Audio Novel options error:",
            error
        );

    }

}


/* =========================================================
   MULTIPART AUDIO UPLOAD
   ========================================================= */

async function uploadAudioMultipart(
    chapterId,
    uploadId,
    objectKey,
    file,
    partSize
){

    const parts = [];

    const totalParts =
        Math.ceil(
            file.size /
            partSize
        );


    for(
        let index = 0;
        index < totalParts;
        index++
    ){

        const partNumber =
            index + 1;


        const start =
            index *
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


        setAudioUploadStatus(
            `Preparing part ${partNumber} of ${totalParts}...`
        );


        const signResponse =
            await fetch(
                `${ADMIN_AUDIO_API}/chapters/${chapterId}/media/sign-part`,
                {

                    method:
                        "POST",

                    headers: {

                        Authorization:
                            "Bearer " +
                            localStorage.getItem(
                                "token"
                            ),

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


        if(
            !signResponse.ok ||
            !signData.success
        ){

            throw new Error(
                signData.message ||
                `Unable to prepare part ${partNumber}.`
            );

        }


        setAudioUploadStatus(
            `Uploading part ${partNumber} of ${totalParts}...`
        );


        const uploadResponse =
            await fetch(
                signData.url,
                {

                    method:
                        "PUT",

                    body:
                        blob

                }
            );


        if(
            !uploadResponse.ok
        ){

            throw new Error(
                `Audio part ${partNumber} upload failed.`
            );

        }


        const etag =
            uploadResponse.headers.get(
                "ETag"
            );


        if(!etag){

            throw new Error(
                `Missing ETag for audio part ${partNumber}.`
            );

        }


        parts.push({

            PartNumber:
                partNumber,

            ETag:
                etag

        });


        setAudioUploadProgress(
            Math.round(
                (
                    partNumber /
                    totalParts
                ) * 100
            )
        );

    }


    return {
        parts
    };

}


/* =========================================================
   AUDIO DURATION
   ========================================================= */

function getAudioFileDuration(
    file
){

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const audio =
                document.createElement(
                    "audio"
                );


            const url =
                URL.createObjectURL(
                    file
                );


            audio.preload =
                "metadata";


            audio.onloadedmetadata =
                () => {

                    const duration =
                        audio.duration;

                    URL.revokeObjectURL(
                        url
                    );

                    if(
                        !Number.isFinite(
                            duration
                        )
                    ){

                        reject(
                            new Error(
                                "Unable to determine audio duration."
                            )
                        );

                        return;

                    }


                    resolve(
                        duration
                    );

                };


            audio.onerror =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Unable to read audio file."
                        )
                    );

                };


            audio.src =
                url;

        }
    );

}


/* =========================================================
   UPLOAD UI
   ========================================================= */

function setAudioUploadProgress(
    percent
){

    const wrapper =
        document.getElementById(
            "audioChapterUploadProgress"
        );

    const bar =
        document.getElementById(
            "audioChapterUploadBar"
        );

    const label =
        document.getElementById(
            "audioChapterUploadPercent"
        );


    if(wrapper){
        wrapper.hidden = false;
    }


    if(bar){
        bar.style.width =
            `${percent}%`;
    }


    if(label){
        label.textContent =
            `${percent}%`;
    }

}


function setAudioUploadStatus(
    message
){

    const wrapper =
        document.getElementById(
            "audioChapterUploadProgress"
        );

    const status =
        document.getElementById(
            "audioChapterUploadStatus"
        );


    if(wrapper){
        wrapper.hidden = false;
    }


    if(status){
        status.textContent =
            message;
    }

}


function formatAudioUploadSize(
    bytes
){

    if(
        !Number.isFinite(
            bytes
        ) ||
        bytes <= 0
    ){

        return "0 B";

    }


    const units =
        [
            "B",
            "KB",
            "MB",
            "GB"
        ];


    const index =
        Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );


    return (
        bytes /
        Math.pow(
            1024,
            index
        )
    )
    .toFixed(
        index === 0
            ? 0
            : 2
    ) +
    " " +
    units[index];

}


function formatAudioUploadDuration(
seconds
){

    if(
        !Number.isFinite(
            seconds
        )
    ){

        return "—";

    }


    const total =
        Math.round(
            seconds
        );


    const minutes =
        Math.floor(
            total / 60
        );


    const remaining =
        total % 60;


    return `${minutes}:${String(
        remaining
    ).padStart(
        2,
        "0"
    )}`;

}

