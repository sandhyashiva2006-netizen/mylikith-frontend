const API = "https://mylikith-backend.onrender.com";

const featuredContainer =
    document.getElementById("featuredClassics");

const featuredSection =
    document.getElementById("featuredSection");

const classicsContainer =
    document.getElementById("classicsGrid");

const languageFilter =
    document.getElementById("languageFilter");

const categoryFilter =
    document.getElementById("categoryFilter");


let allClassics = [];


/* =========================================================
   LOAD FEATURED CLASSICS
========================================================= */

async function loadFeaturedClassics() {

    if (!featuredContainer) return;

    try {

        const response = await fetch(
            `${API}/api/classics/featured`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load featured Classics."
            );

        }

        const classics =
            Array.isArray(data)
                ? data
                : data.classics;


const featured =
    Array.isArray(classics)
        ? classics
        : [];

if (!featured.length) {

    if (featuredSection) {
        featuredSection.style.display = "none";
    }

    return;
}

if (featuredSection) {
    featuredSection.style.display = "";
}

renderClassics(
    featuredContainer,
    featured,
    true
);


    } catch (error) {

        console.error(
            "Featured Classics error:",
            error
        );

        featuredContainer.innerHTML = `
            <div class="classics-error">

                <h3>
                    Unable to load Classics
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

    }

}


/* =========================================================
   LOAD ALL CLASSICS
========================================================= */

async function loadClassics() {

    if (!classicsContainer) return;

    classicsContainer.innerHTML = `
        <div class="classics-loading">

            <div class="classics-spinner"></div>

            <p>
                Loading Classics...
            </p>

        </div>
    `;


    try {

        const response = await fetch(
            `${API}/api/classics`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load Classics."
            );

        }

        const classics =
            Array.isArray(data)
                ? data
                : data.classics;


        allClassics =
            Array.isArray(classics)
                ? classics
                : [];


        populateFilters();

        applyFilters();


    } catch (error) {

        console.error(
            "Classics error:",
            error
        );

        classicsContainer.innerHTML = `
            <div class="classics-error">

                <h3>
                    Unable to load Classics
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

    }

}


/* =========================================================
   RENDER CLASSICS
========================================================= */

function renderClassics(
    container,
    classics,
    featured = false
) {

    container.innerHTML = "";


    if (!classics.length) {

        container.innerHTML = `
            <div class="classics-empty">

                <div class="classics-empty-icon">
                    📖
                </div>

                <h3>
                    No Classics Available
                </h3>

                <p>
                    More timeless stories will be added soon.
                </p>

            </div>
        `;

        return;
    }


    classics.forEach(classic => {

        const card =
            document.createElement("article");

        card.className =
            featured
                ? "classic-card featured-card"
                : "classic-card";


        const cover =
            classic.cover_image
                ? `
                    <img
                        src="${escapeAttribute(
                            classic.cover_image
                        )}"
                        alt="${escapeAttribute(
                            classic.title
                        )}"
                        class="classic-cover"
                        loading="lazy"
                    >
                  `
                : `
                    <div class="classic-cover-placeholder">
                        📖
                    </div>
                  `;


        card.innerHTML = `

            <div class="classic-cover-wrapper">

                ${cover}

                ${
                    classic.is_featured
                        ? `
                            <span class="classic-featured-badge">
                                Featured
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="classic-card-content">

                <div class="classic-card-meta">

                    <span>
                        ${escapeHTML(
                            classic.language ||
                            "Unknown"
                        )}
                    </span>

                    ${
                        classic.publication_year
                            ? `
                                <span>
                                    ${classic.publication_year}
                                </span>
                              `
                            : ""
                    }

                </div>


                <h3>
                    ${escapeHTML(
                        classic.title
                    )}
                </h3>


                <p class="classic-author">
                    ${escapeHTML(
                        classic.author_name ||
                        "Unknown Author"
                    )}
                </p>


                ${
                    classic.description
                        ? `
                            <p class="classic-description">
                                ${escapeHTML(
                                    truncate(
                                        classic.description,
                                        120
                                    )
                                )}
                            </p>
                          `
                        : ""
                }


                <div class="classic-card-bottom">

                    ${
                        classic.category
                            ? `
                                <span class="classic-category">
                                    ${escapeHTML(
                                        classic.category
                                    )}
                                </span>
                              `
                            : `
                                <span></span>
                              `
                    }


                    <a
                        href="classic.html?id=${classic.id}"
                        class="classic-read-btn"
                    >
                        Read
                    </a>

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================================
   FILTERS
========================================================= */

function populateFilters() {

    if (languageFilter) {

        const languages =
            [
                ...new Set(
                    allClassics
                        .map(
                            classic =>
                                classic.language
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        languageFilter.innerHTML = `
            <option value="">
                All Languages
            </option>
        `;


        languages.forEach(language => {

            const option =
                document.createElement("option");

            option.value =
                language;

            option.textContent =
                language;

            languageFilter.appendChild(
                option
            );

        });

    }


    if (categoryFilter) {

        const categories =
            [
                ...new Set(
                    allClassics
                        .map(
                            classic =>
                                classic.category
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        categoryFilter.innerHTML = `
            <option value="">
                All Categories
            </option>
        `;


        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value =
                category;

            option.textContent =
                category;

            categoryFilter.appendChild(
                option
            );

        });

    }

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    if (!classicsContainer) return;


    const selectedLanguage =
        languageFilter
            ? languageFilter.value
            : "";

    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "";


    const filtered =
        allClassics.filter(classic => {

            const languageMatch =
                !selectedLanguage ||
                classic.language ===
                    selectedLanguage;


            const categoryMatch =
                !selectedCategory ||
                classic.category ===
                    selectedCategory;


            return (
                languageMatch &&
                categoryMatch
            );

        });


    renderClassics(
        classicsContainer,
        filtered
    );

}


/* =========================================================
   FILTER EVENTS
========================================================= */

if (languageFilter) {

    languageFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

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


/* =========================================================
   INITIALIZE
========================================================= */

loadFeaturedClassics();
loadClassics();