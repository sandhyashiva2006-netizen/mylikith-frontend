document.addEventListener(
    "DOMContentLoaded",
    () => {

        bindAudioAdminTabs();

        loadAdminAudioNovels();

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
                        ? `<span class="audio-admin-badge premium">
                            👑 Premium
                           </span>`
                        : "";


                const featured =
                    item.featured
                        ? `<span class="audio-admin-badge featured">
                            ⭐ Featured
                           </span>`
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
                                ✍ ${escapeAdminAudioHtml(
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

                        </div>

                    </article>

                `;

            }
        )
        .join("");

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

