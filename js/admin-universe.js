const API = "https://mylikith-backend.onrender.com";

const grid = document.getElementById("universeAdminGrid");
const messageBox = document.getElementById("universeMessage");
const refreshBtn = document.getElementById("refreshUniverse");


/* =========================================================
   LOAD MODULES
========================================================= */

async function loadUniverseModules() {

    if (!grid) return;

    grid.innerHTML = `
        <div class="universe-admin-loading">

            <div class="universe-admin-spinner"></div>

            <p>
                Loading Universe modules...
            </p>

        </div>
    `;

    try {

        const response = await adminFetch(
            `${API}/api/admin/universe/modules`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load Universe modules."
            );

        }

        const modules = Array.isArray(data)
            ? data
            : data.modules;

        if (!Array.isArray(modules)) {

            throw new Error(
                "Invalid Universe API response."
            );

        }

        renderModules(modules);

    } catch (error) {

        console.error(
            "Universe admin error:",
            error
        );

        grid.innerHTML = `
            <div class="universe-admin-error">

                <h3>
                    Unable to load Universe modules
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <button
                    class="universe-refresh-btn"
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

function renderModules(modules) {

    grid.innerHTML = "";

    modules.forEach(module => {

        const card = document.createElement("article");

        card.className = "universe-admin-card";

        card.innerHTML = `

            <div class="universe-admin-card-header">

                <div class="universe-admin-icon">
                    ${escapeHTML(module.icon || "✦")}
                </div>

                <div class="universe-admin-title">

                    <h3>
                        ${escapeHTML(module.title)}
                    </h3>

                    <span>
                        ${escapeHTML(module.name)}
                    </span>

                </div>

            </div>


            <div class="universe-admin-field">

                <label>
                    Title
                </label>

                <input
                    type="text"
                    class="module-title"
                    value="${escapeAttribute(module.title || "")}"
                >

            </div>


            <div class="universe-admin-field">

                <label>
                    Description
                </label>

                <textarea
                    class="module-description"
                    rows="3"
                >${escapeHTML(module.description || "")}</textarea>

            </div>


            <div class="universe-admin-row">

                <div class="universe-admin-field">

                    <label>
                        Icon
                    </label>

                    <input
                        type="text"
                        class="module-icon"
                        value="${escapeAttribute(module.icon || "")}"
                    >

                </div>


                <div class="universe-admin-field">

                    <label>
                        Display Order
                    </label>

                    <input
                        type="number"
                        class="module-order"
                        min="1"
                        value="${Number(module.display_order) || 1}"
                    >

                </div>

            </div>


            <div class="universe-admin-field">

                <label>
                    Route
                </label>

                <input
                    type="text"
                    class="module-route"
                    value="${escapeAttribute(module.route || "")}"
                >

            </div>


            <div class="universe-admin-controls">

                <label class="universe-switch">

                    <input
                        type="checkbox"
                        class="module-enabled"
                        ${module.enabled ? "checked" : ""}
                    >

                    <span class="universe-slider"></span>

                </label>

                <span class="switch-label">
                    Enabled
                </span>


                <label class="universe-switch">

                    <input
                        type="checkbox"
                        class="module-coming-soon"
                        ${module.coming_soon ? "checked" : ""}
                    >

                    <span class="universe-slider"></span>

                </label>

                <span class="switch-label">
                    Coming Soon
                </span>

            </div>


            <div class="universe-admin-footer">

                <span class="module-status">
                    ${module.enabled && !module.coming_soon
                        ? "Available"
                        : "Coming Soon"}
                </span>

                <button
                    type="button"
                    class="universe-save-btn"
                >
                    Save Changes
                </button>

            </div>

        `;


        const saveBtn =
            card.querySelector(".universe-save-btn");


        saveBtn.addEventListener(
            "click",
            () => updateModule(module.id, card)
        );


        const enabledCheckbox =
            card.querySelector(".module-enabled");

        const comingSoonCheckbox =
            card.querySelector(".module-coming-soon");

        const status =
            card.querySelector(".module-status");


        function updateStatusPreview() {

            const available =
                enabledCheckbox.checked &&
                !comingSoonCheckbox.checked;

            status.textContent =
                available
                    ? "Available"
                    : "Coming Soon";
        }


        enabledCheckbox.addEventListener(
            "change",
            updateStatusPreview
        );


        comingSoonCheckbox.addEventListener(
            "change",
            updateStatusPreview
        );


        grid.appendChild(card);

    });

}


/* =========================================================
   UPDATE MODULE
========================================================= */

async function updateModule(id, card) {

    const saveBtn =
        card.querySelector(".universe-save-btn");

    const title =
        card.querySelector(".module-title").value.trim();

    const description =
        card.querySelector(".module-description").value.trim();

    const icon =
        card.querySelector(".module-icon").value.trim();

    const route =
        card.querySelector(".module-route").value.trim();

    const displayOrder =
        Number(
            card.querySelector(".module-order").value
        );

    const enabled =
        card.querySelector(".module-enabled").checked;

    const comingSoon =
        card.querySelector(".module-coming-soon").checked;


    if (!title) {

        showMessage(
            "Title is required.",
            "error"
        );

        return;
    }


    if (!icon) {

        showMessage(
            "Icon is required.",
            "error"
        );

        return;
    }


    if (!displayOrder || displayOrder < 1) {

        showMessage(
            "Display order must be at least 1.",
            "error"
        );

        return;
    }


    saveBtn.disabled = true;

    saveBtn.textContent =
        "Saving...";


    try {

        const response = await adminFetch(
            `${API}/api/admin/universe/modules/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    title,
                    description,
                    icon,
                    route,
                    enabled,
                    coming_soon: comingSoon,
                    display_order: displayOrder

                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update module."
            );

        }


        showMessage(
            `${title} updated successfully.`,
            "success"
        );


        await loadUniverseModules();


    } catch (error) {

        console.error(
            "Universe update error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to update module.",
            "error"
        );

    } finally {

        saveBtn.disabled = false;

        saveBtn.textContent =
            "Save Changes";

    }

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message, type) {

    if (!messageBox) return;

    messageBox.textContent =
        message;

    messageBox.className =
        `universe-message ${type}`;

    setTimeout(() => {

        messageBox.className =
            "universe-message";

        messageBox.textContent =
            "";

    }, 4000);

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


/* =========================================================
   REFRESH
========================================================= */

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        loadUniverseModules
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

loadUniverseModules();