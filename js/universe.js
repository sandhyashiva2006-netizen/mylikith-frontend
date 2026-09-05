/* =========================================================
   MYLIKITH UNIVERSE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadUniverseModules();
});


/* =========================================================
   LOAD UNIVERSE MODULES
   ========================================================= */

async function loadUniverseModules() {

    const container = document.getElementById("universe-modules");

    if (!container) {
        console.error("Universe modules container not found.");
        return;
    }

    try {

        const response = await fetch(
            "https://mylikith-backend.onrender.com/api/universe/modules"
        );

        if (!response.ok) {
            throw new Error(
                `Universe API returned ${response.status}`
            );
        }

        const modules = await response.json();

        if (!Array.isArray(modules)) {
            throw new Error(
                "Invalid Universe API response."
            );
        }

        renderUniverseModules(container, modules);
        renderUniverseJourney(modules);

    } catch (error) {

        console.error(
            "Failed to load Universe modules:",
            error
        );

        container.innerHTML = `
            <div class="universe-loading">
                <p>
                    Unable to load the MyLikith Universe.
                </p>

                <button
                    type="button"
                    class="universe-action"
                    onclick="loadUniverseModules()"
                >
                    Try Again
                </button>
            </div>
        `;
    }
}


/* =========================================================
   RENDER MODULES
   ========================================================= */

function renderUniverseModules(container, modules) {

    container.innerHTML = "";

    if (modules.length === 0) {

        container.innerHTML = `
            <div class="universe-loading">
                <p>
                    No Universe modules available.
                </p>
            </div>
        `;

        return;
    }

    modules.forEach(module => {

        const card = document.createElement("article");

        card.className = "universe-card";

        const isAvailable =
            module.enabled === true &&
            module.coming_soon === false;

        const statusClass = isAvailable
            ? "available"
            : "coming-soon";

        const statusText = isAvailable
            ? "Available"
            : "Coming Soon";

        let actionHTML = "";

        if (isAvailable && module.route) {

            actionHTML = `
                <a
                    href="${escapeAttribute(module.route)}"
                    class="universe-action"
                >
                    Explore
                </a>
            `;

        } else {

            actionHTML = `
                <span
                    class="universe-action disabled"
                >
                    Coming Soon
                </span>
            `;
        }

        card.innerHTML = `
            <div class="universe-card-top">

                <div class="universe-icon">
                    ${escapeHTML(module.icon || "✦")}
                </div>

                <h3>
                    ${escapeHTML(module.title)}
                </h3>

                <p>
                    ${escapeHTML(module.description || "")}
                </p>

            </div>

            <div class="universe-card-bottom">

                <span
                    class="universe-status ${statusClass}"
                >
                    ${statusText}
                </span>

                ${actionHTML}

            </div>
        `;

        container.appendChild(card);
    });
}



/* =========================================================
   SYNC JOURNEY STATUS
   The journey timeline is driven by the same Universe API
   as the module cards above.
   ========================================================= */

function renderUniverseJourney(modules) {

    const journeyItems = document.querySelectorAll("[data-journey-module]");

    if (!journeyItems.length) {
        return;
    }

    journeyItems.forEach(item => {

        const key = item.dataset.journeyModule;
        const module = findJourneyModule(modules, key);

        if (!module) {
            // If the API does not contain this module, keep the
            // existing timeline label rather than inventing a status.
            return;
        }

        const isAvailable =
            module.enabled === true &&
            module.coming_soon === false;

        const status = item.querySelector(".journey-content span");
        const dot = item.querySelector(".journey-dot");

        item.classList.toggle("active", isAvailable);

        if (dot) {
            dot.textContent = isAvailable
                ? "✓"
                : getJourneyNumber(key);
        }

        if (status) {
            status.textContent = isAvailable
                ? "Available"
                : "Coming Soon";
        }
    });
}


function findJourneyModule(modules, key) {

    const aliases = {
        novels: ["novels", "mylikith novels"],
        classics: ["classics", "mylikith classics"],
        translations: ["translations", "mylikith translations"],
        audio: ["audio", "mylikith audio"],
        podcasts: ["podcasts", "mylikith podcasts"],
        kids: ["kids", "mylikith kids"],
        originals: ["originals", "mylikith originals"]
    };

    const wanted = aliases[key] || [key];

    return modules.find(module => {

        const values = [
            module.title,
            module.name,
            module.slug,
            module.key,
            module.module_key,
            module.id
        ]
            .filter(value => value !== undefined && value !== null)
            .map(value => String(value).trim().toLowerCase().replace(/[-_]+/g, " "));

        return values.some(value =>
            wanted.some(alias =>
                value === alias ||
                value.endsWith(" " + alias)
            )
        );
    });
}


function getJourneyNumber(key) {

    const numbers = {
        novels: "1",
        classics: "2",
        translations: "3",
        audio: "4",
        podcasts: "5",
        kids: "6",
        originals: "7"
    };

    return numbers[key] || "";
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   ATTRIBUTE ESCAPE
   ========================================================= */

function escapeAttribute(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#039;");
}