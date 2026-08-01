const API = "https://mylikith-backend.onrender.com";

const admin = JSON.parse(localStorage.getItem("user"));

const contestModal = document.getElementById("contestModal");

const createContestBtn = document.getElementById("createContestBtn");

const closeContestModal = document.getElementById("closeContestModal");

const cancelContestBtn = document.getElementById("cancelContestBtn");

const addCategoryBtn = document.getElementById("addCategoryBtn");

const categoryContainer = document.getElementById("categoryContainer");

const contestForm = document.getElementById("contestForm");

let editingContestId = null;

const modalTitle = document.querySelector("#contestModal .modal-header h2");

const saveContestBtn = document.getElementById("saveContestBtn");

if (!admin) {
    window.location.href = "admin-login.html";
}

if (admin.role !== "admin") {
    window.location.href = "index.html";
}

async function loadDashboard() {

    try {

        const response = await adminFetch(`${API}/api/admin/contests`);

        const contests = await response.json();

console.log("Contests:", contests);

        document.getElementById("activeContests").textContent =
            contests.filter(c => (c.status || "").toLowerCase() === "active").length;

        document.getElementById("draftContests").textContent =
            contests.filter(c => (c.status || "").toLowerCase() === "draft").length;

        document.getElementById("completedContests").textContent =
            contests.filter(c => (c.status || "").toLowerCase() === "completed").length;

        document.getElementById("totalEntries").textContent =
            contests.reduce((sum, c) => sum + (c.entries || 0), 0);

        renderContestTable(contests);

    } catch (err) {

        console.error(err);

    }

}

function renderContestTable(contests) {

    const tbody = document.getElementById("contestTable");

    tbody.innerHTML = "";

    if (!contests.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    No contests found.
                </td>
            </tr>
        `;

        return;

    }

    contests.forEach(contest => {

    console.log("Rendering:", contest);

    tbody.innerHTML += `
            <tr>

                <td>${contest.title}</td>

                <td>${contest.language}</td>

                <td>₹${Number(contest.prize_pool || 0).toLocaleString()}</td>

                <td>${contest.entries || 0}</td>

                <td>${contest.status}</td>

                <td>${new Date(contest.registration_end).toLocaleDateString()}</td>

                <td>${new Date(contest.end_date).toLocaleDateString()}</td>

                <td class="contest-actions">

<button
    class="entries-btn"
    onclick="openContest(${contest.id})">
    👁 Entries
</button>

<button
    class="edit-btn"
    onclick="editContest(${contest.id})">
    ✏️ Edit
</button>

<button
    class="delete-btn"
    onclick="deleteContest(${contest.id})">
    🗑 Delete
</button>

</td>

            </tr>
        `;

    });

}

async function editContest(id) {

    try {

        const response = await adminFetch(
            `${API}/api/admin/contests/${id}`
        );

        const contest = await response.json();

        editingContestId = contest.id;

        modalTitle.textContent = "Edit Contest";

        saveContestBtn.textContent = "Update Contest";

        document.getElementById("contestTitle").value =
            contest.title || "";

        document.getElementById("contestDescription").value =
            contest.description || "";

        document.getElementById("contestLanguage").value =
            contest.language || "";

        document.getElementById("contestPrize").value =
            contest.prize_pool || 0;

        document.getElementById("registrationEnd").value =
            contest.registration_end
                ? contest.registration_end.substring(0,16)
                : "";

        document.getElementById("contestStart").value =
            contest.start_date
                ? contest.start_date.substring(0,16)
                : "";

        document.getElementById("contestEnd").value =
            contest.end_date
                ? contest.end_date.substring(0,16)
                : "";

        document.getElementById("contestStatus").value =
            contest.status || "Draft";

        document.getElementById("contestBanner").value =
            contest.banner_url || "";

        document.getElementById("contestRules").value =
            contest.rules || "";

        categoryContainer.innerHTML = "";

        (contest.categories || []).forEach(category => {

            categoryContainer.innerHTML += `
                <input
                    type="text"
                    class="contest-category"
                    value="${category.category}">
            `;

        });

        if (!contest.categories || contest.categories.length === 0) {

            categoryContainer.innerHTML = `
                <input
                    type="text"
                    class="contest-category"
                    placeholder="Fantasy">
            `;

        }

        contestModal.classList.remove("hidden");

    } catch (err) {

        console.error(err);

        alert("Unable to load contest.");

    }

}



async function deleteContest(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this contest?\n\n" +
        "This will permanently remove:\n" +
        "• Contest\n" +
        "• Categories\n" +
        "• Entries\n" +
        "• Votes\n" +
        "• Winners"
    );

    if (!confirmed) return;

    try {

        const response = await adminFetch(
            `${API}/api/admin/contests/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            alert(result.message || "Failed to delete contest.");

            return;

        }

        alert("Contest deleted successfully.");

        loadDashboard();

    } catch (err) {

        console.error(err);

        alert("Something went wrong.");

    }

}

	
createContestBtn.onclick = () => {

    editingContestId = null;

    contestForm.reset();

    categoryContainer.innerHTML = `
        <input
            type="text"
            class="contest-category"
            placeholder="Fantasy">
    `;

    modalTitle.textContent = "Create Contest";

    saveContestBtn.textContent = "Create Contest";

    contestModal.classList.remove("hidden");

};

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = (e) => {

        e.preventDefault();

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.href = "admin-login.html";

    };

}

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const closeSidebar = document.getElementById("closeSidebar");

if (menuToggle) {

    menuToggle.onclick = () => {

        sidebar.classList.toggle("show");
        overlay.classList.toggle("show");

    };

}

function closeMenu() {

    sidebar.classList.remove("show");
    overlay.classList.remove("show");

}

if (overlay) overlay.onclick = closeMenu;
if (closeSidebar) closeSidebar.onclick = closeMenu;

closeContestModal.addEventListener("click", closeContest);

cancelContestBtn.addEventListener("click", closeContest);

function closeContest() {

    editingContestId = null;

    contestForm.reset();

    categoryContainer.innerHTML = `
        <input
            type="text"
            class="contest-category"
            placeholder="Fantasy">
    `;

    modalTitle.textContent = "Create Contest";

    saveContestBtn.textContent = "Create Contest";

    contestModal.classList.add("hidden");

}

window.addEventListener("click", (e) => {

    if (e.target === contestModal) {

        closeContest();

    }

});

addCategoryBtn.addEventListener("click", () => {

    const input = document.createElement("input");

    input.type = "text";

    input.className = "contest-category";

    input.placeholder = "Category";

    categoryContainer.appendChild(input);

});

contestForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const categories = [...document.querySelectorAll(".contest-category")]
            .map(input => input.value.trim())
            .filter(value => value);

        const payload = {

            title: document.getElementById("contestTitle").value.trim(),

            description: document.getElementById("contestDescription").value.trim(),

            language: document.getElementById("contestLanguage").value,

            prize_pool: Number(document.getElementById("contestPrize").value) || 0,

            registration_end: document.getElementById("registrationEnd").value,

            start_date: document.getElementById("contestStart").value,

            end_date: document.getElementById("contestEnd").value,

            status: document.getElementById("contestStatus").value,

            banner_url: document.getElementById("contestBanner").value.trim(),

            rules: document.getElementById("contestRules").value.trim(),

            categories

        };

console.log("editingContestId =", editingContestId);

        const url = editingContestId
    ? `${API}/api/admin/contests/${editingContestId}`
    : `${API}/api/admin/contests`;

const method = editingContestId
    ? "PUT"
    : "POST";

const response = await adminFetch(url, {

    method,

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(payload)

});

        const result = await response.json();

        if (!response.ok || !result.success) {

            alert(result.message || "Failed to create contest.");

            return;

        }

        alert(
    editingContestId
        ? "Contest updated successfully."
        : "Contest created successfully."
);

        contestForm.reset();

editingContestId = null;

modalTitle.textContent = "Create Contest";

saveContestBtn.textContent = "Create Contest";

        categoryContainer.innerHTML = `
            <input
                type="text"
                class="contest-category"
                placeholder="Fantasy">
        `;

        closeContest();

        loadDashboard();

    } catch (err) {

        console.error(err);

        alert("Something went wrong while creating the contest.");

    }

});

function openContest(id){

    window.location.href =
        `admin-contest.html?id=${id}`;

}

loadDashboard();