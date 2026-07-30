const API = "https://mylikith-backend.onrender.com";

const admin = JSON.parse(localStorage.getItem("user"));

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

        document.getElementById("activeContests").textContent =
            contests.filter(c => c.status === "active").length;

        document.getElementById("draftContests").textContent =
            contests.filter(c => c.status === "draft").length;

        document.getElementById("completedContests").textContent =
            contests.filter(c => c.status === "completed").length;

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

        tbody.innerHTML += `
            <tr>

                <td>${contest.title}</td>

                <td>${contest.language}</td>

                <td>₹${Number(contest.prize_pool || 0).toLocaleString()}</td>

                <td>${contest.entries || 0}</td>

                <td>${contest.status}</td>

                <td>${new Date(contest.registration_end).toLocaleDateString()}</td>

                <td>${new Date(contest.end_date).toLocaleDateString()}</td>

                <td>

                    <button onclick="editContest(${contest.id})">
                        Edit
                    </button>

                    <button onclick="deleteContest(${contest.id})">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });

}

function editContest(id) {

    alert("Edit Contest: " + id);

}

async function deleteContest(id) {

    if (!confirm("Delete this contest?")) return;

    try {

        await adminFetch(`${API}/api/admin/contests/${id}`, {
            method: "DELETE"
        });

        loadDashboard();

    } catch (err) {

        console.error(err);

    }

}

document.getElementById("createContestBtn").onclick = () => {

    alert("Contest form will be added in the next step.");

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

loadDashboard();