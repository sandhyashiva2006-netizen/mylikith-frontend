/* =========================================================
   MYLIKITH ORIGINALS
========================================================= */

const ORIGINALS_API =
    "https://mylikith-backend.onrender.com/api/originals";

const featuredContainer =
    document.getElementById("featuredOriginals");

const originalsContainer =
    document.getElementById("originalsGrid");

const searchInput =
    document.getElementById("originalSearch");

const languageFilter =
    document.getElementById("languageFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const clearFilters =
    document.getElementById("clearFilters");


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadFeaturedOriginals();

        loadOriginals();

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                debounce(
                    loadOriginals,
                    350
                )
            );

        }

        if (languageFilter) {

            languageFilter.addEventListener(
                "change",
                loadOriginals
            );

        }

        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                loadOriginals
            );

        }

        if (clearFilters) {

            clearFilters.addEventListener(
                "click",
                () => {

                    if (searchInput)
                        searchInput.value = "";

                    if (languageFilter)
                        languageFilter.value = "";

                    if (categoryFilter)
                        categoryFilter.value = "";

                    loadOriginals();

                }
            );

        }

    }
);


/* =========================================================
   FEATURED
========================================================= */

async function loadFeaturedOriginals() {

    if (!featuredContainer) return;

    try {

        const response = await fetch(
            `${ORIGINALS_API}/featured`
        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load featured Originals."
            );

        }

        const originals =
            Array.isArray(data.originals)
                ? data.originals
                : [];

        renderOriginals(
            featuredContainer,
            originals
        );

        if (!originals.length) {

            const section =
                document.getElementById(
                    "featuredSection"
                );

            if (section) {

                section.style.display =
                    "none";

            }

        }

    } catch (error) {

        console.error(
            "Featured Originals error:",
            error
        );

        featuredContainer.innerHTML = `
            <div class="originals-error">
                Unable to load featured Originals.
            </div>
        `;

    }

}


/* =========================================================
   ALL ORIGINALS
========================================================= */

async function loadOriginals() {

    if (!originalsContainer) return;

    originalsContainer.innerHTML = `
        <div class="originals-loading">

            <div class="originals-spinner"></div>

            <p>
                Loading Originals...
            </p>

        </div>
    `;

    try {

        const params =
            new URLSearchParams();

        if (
            searchInput &&
            searchInput.value.trim()
        ) {

            params.set(
                "search",
                searchInput.value.trim()
            );

        }

        if (
            languageFilter &&
            languageFilter.value
        ) {

            params.set(
                "language",
                languageFilter.value
            );

        }

        if (
            categoryFilter &&
            categoryFilter.value
        ) {

            params.set(
                "category",
                categoryFilter.value
            );

        }

        const query =
            params.toString();

        const response = await fetch(
            query
                ? `${ORIGINALS_API}?${query}`
                : ORIGINALS_API
        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load Originals."
            );

        }

        const originals =
            Array.isArray(data.originals)
                ? data.originals
                : [];

        populateFilters(originals);

        renderOriginals(
            originalsContainer,
            originals
        );

    } catch (error) {

        console.error(
            "Originals error:",
            error
        );

        originalsContainer.innerHTML = `
            <div class="originals-error">

                <p>
                    Unable to load MyLikith Originals.
                </p>

                <button
                    type="button"
                    onclick="loadOriginals()"
                >
                    Try Again
                </button>

            </div>
        `;

    }

}


/* =========================================================
   RENDER
========================================================= */

function renderOriginals(
    container,
    originals
) {

    if (!container) return;

    if (!originals.length) {

        container.innerHTML = `
            <div class="originals-empty">

                <strong>
                    No Originals available yet.
                </strong>

                <span>
                    MyLikith Originals are being created.
                    Check back soon.
                </span>

            </div>
        `;

        return;

    }

    container.innerHTML = "";

    originals.forEach(
        original => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "original-card";

            const cover =
                original.cover_url
                    ? `
                        <img
                            src="${escapeAttribute(
                                original.cover_url
                            )}"
                            alt="${escapeAttribute(
                                original.title
                            )}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div
                            class="original-cover-placeholder"
                        >
                            ✦
                        </div>
                    `;

            const badge =
                original.premium_only
                    ? `
                        <span class="original-badge">
                            PREMIUM
                        </span>
                    `
                    : "";

            card.innerHTML = `

                <div class="original-cover">

                    ${cover}

                    ${badge}

                </div>


                <div class="original-card-content">

                    <h3>
                        ${escapeHTML(
                            original.title
                        )}
                    </h3>

                    <p class="original-description">
                        ${escapeHTML(
                            original.description ||
                            "An exclusive MyLikith Original."
                        )}
                    </p>


                    <div class="original-meta">

                        ${
                            original.language
                                ? `
                                    <span>
                                        ${escapeHTML(
                                            original.language
                                        )}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            original.category
                                ? `
                                    <span>
                                        ${escapeHTML(
                                            original.category
                                        )}
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    <a
                        href="original.html?id=${encodeURIComponent(
                            original.id
                        )}"
                        class="original-open"
                    >
                        Explore Story
                    </a>

                </div>

            `;

            container.appendChild(card);

        }
    );

}


/* =========================================================
   FILTER OPTIONS
========================================================= */

function populateFilters(
    originals
) {

    if (
        !languageFilter ||
        !categoryFilter
    ) {
        return;
    }

    const languages =
        new Set();

    const categories =
        new Set();

    originals.forEach(
        original => {

            if (original.language)
                languages.add(
                    original.language
                );

            if (original.category)
                categories.add(
                    original.category
                );

        }
    );

    const currentLanguage =
        languageFilter.value;

    const currentCategory =
        categoryFilter.value;

    languageFilter.innerHTML = `
        <option value="">
            All Languages
        </option>
    `;

    categoryFilter.innerHTML = `
        <option value="">
            All Categories
        </option>
    `;

    [...languages]
        .sort()
        .forEach(
            language => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    language;

                option.textContent =
                    language;

                languageFilter.appendChild(
                    option
                );

            }
        );

    [...categories]
        .sort()
        .forEach(
            category => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category;

                option.textContent =
                    category;

                categoryFilter.appendChild(
                    option
                );

            }
        );

    languageFilter.value =
        currentLanguage;

    categoryFilter.value =
        currentCategory;

}


/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(
    callback,
    delay
) {

    let timer;

    return function () {

        clearTimeout(timer);

        timer = setTimeout(
            callback,
            delay
        );

    };

}


/* =========================================================
   ESCAPING
========================================================= */

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


function escapeAttribute(value) {

    return escapeHTML(value);

}