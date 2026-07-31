/* =====================================
   Contest System
===================================== */

const API = "https://mylikith-backend.onrender.com";

const contestUser = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

let activeContest = null;

/* =====================================
   DOM
===================================== */

const contestTitle = document.getElementById("contestTitle");
const contestDescription = document.getElementById("contestDescription");
const contestPrize = document.getElementById("contestPrize");

const contestStart = document.getElementById("contestStart");
const contestEnd = document.getElementById("contestEnd");
const registrationEnd = document.getElementById("registrationEnd");

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const categoryGrid = document.getElementById("categoryGrid");

const novelSelect = document.getElementById("novelSelect");
const categorySelect = document.getElementById("categorySelect");

const leaderboardBody = document.getElementById("leaderboardBody");
const winnersGrid = document.getElementById("winnersGrid");

/* =====================================
   API Helper
===================================== */

async function api(url, options = {}) {

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API}/api${url}`, {
        ...options,
        headers
    });

    return response.json();
}

/* =====================================
   Countdown
===================================== */

function startCountdown(endDate) {

    function update() {

        const now = new Date().getTime();
        const end = new Date(endDate).getTime();

        const diff = end - now;

        if (diff <= 0) {

            if (days) days.textContent = "00";
            if (hours) hours.textContent = "00";
            if (minutes) minutes.textContent = "00";
            if (seconds) seconds.textContent = "00";

            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        if (days) days.textContent = String(d).padStart(2, "0");
        if (hours) hours.textContent = String(h).padStart(2, "0");
        if (minutes) minutes.textContent = String(m).padStart(2, "0");
        if (seconds) seconds.textContent = String(s).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
}

/* =====================================
   Active Contest
===================================== */

async function loadActiveContest() {

    try {

        const response = await api("/contests/active");

console.log("Active Contest Response:", response);

if (!response.success || !response.contest) {

    if (contestTitle)
        contestTitle.textContent = "No Active Contest";

    return;
}

const contest = response.contest;

console.log("Contest:", contest);
console.log("Contest ID:", contest.id);

        if (!contest || contest.error) {

            if (contestTitle)
                contestTitle.textContent = "No Active Contest";

            return;
        }

        activeContest = contest;

        if (contestTitle)
            contestTitle.textContent = contest.title;

        if (contestDescription)
            contestDescription.textContent =
                contest.description || "";

        if (contestPrize)
            contestPrize.textContent =
                contest.prize_pool || contest.prize || "-";

if (contestStart)
    contestStart.textContent =
        contest.start_date
            ? new Date(contest.start_date).toLocaleDateString("en-IN")
            : "-";

if (contestEnd)
    contestEnd.textContent =
        contest.end_date
            ? new Date(contest.end_date).toLocaleDateString("en-IN")
            : "-";

if (registrationEnd)
    registrationEnd.textContent =
        contest.registration_end
            ? new Date(contest.registration_end).toLocaleDateString("en-IN")
            : "-";

        if (contest.end_date)
            startCountdown(contest.end_date);

    } catch (err) {

        console.error(err);

        if (contestTitle)
            contestTitle.textContent =
                "Unable to load contest.";
    }

}

/* =====================================
   Contest Categories
===================================== */

async function loadCategories() {

    if (!activeContest) return;

    try {

        const categories = await api(
            `/contests/${activeContest.id}/categories`
        );

        if (categoryGrid) {

            categoryGrid.innerHTML = "";

            if (!Array.isArray(categories) || categories.length === 0) {

                categoryGrid.innerHTML =
                    "<p>No categories available.</p>";

            } else {

                categories.forEach(category => {

                    categoryGrid.innerHTML += `
                        <div class="contest-category-card">
                            <h3>${category.category}</h3>
                            <p>${category.description || ""}</p>
                        </div>
                    `;

                });

            }

        }

        if (categorySelect) {

            categorySelect.innerHTML =
                '<option value="">Select Category</option>';

            if (Array.isArray(categories)) {

                categories.forEach(category => {

                    categorySelect.innerHTML += `
                        <option value="${category.id}">
                            ${category.category}
                        </option>
                    `;

                });

            }

        }

    } catch (err) {

        console.error(err);

    }

}

/* =====================================
   Eligible Novels
===================================== */

async function loadEligibleNovels() {

    if (!contestUser || !token || !novelSelect) return;

    try {

        const novels = await api("/contests/eligible-novels");

        novelSelect.innerHTML =
            '<option value="">Select Novel</option>';

        if (!Array.isArray(novels)) return;

        novels.forEach(novel => {

            novelSelect.innerHTML += `
                <option value="${novel.id}">
                    ${novel.title}
                </option>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

/* =====================================
   Contest Registration
===================================== */

async function registerContest() {

    if (!contestUser) {

        alert("Please login first.");

        return;
    }

    if (!activeContest) {

        alert("No active contest.");

        return;
    }

    const novelId = novelSelect?.value;
    const categoryId = categorySelect?.value;

    if (!novelId || !categoryId) {

        alert("Please select a novel and category.");

        return;
    }

    try {

        const result = await api(
            `/contests/${activeContest.id}/register`,
            {
                method: "POST",
                body: JSON.stringify({
                    novel_id: novelId,
                    category_id: categoryId
                })
            }
        );

        if (!result.success) {

    alert(result.message || "Registration failed.");

    return;

}

alert(result.message || "Novel registered successfully!");

        loadLeaderboard();

    } catch (err) {

        console.error(err);

        alert("Registration failed.");

    }

}

/* =====================================
   Registration Form
===================================== */

const contestRegisterBtn =
    document.getElementById("registerContestBtn");

if (contestRegisterBtn) {

    contestRegisterBtn.onclick = registerContest;

}

/* =====================================
   Leaderboard
===================================== */

async function loadLeaderboard() {

    if (!activeContest || !leaderboardBody) return;

    try {

        const entries = await api(
            `/contests/${activeContest.id}/leaderboard`
        );

        leaderboardBody.innerHTML = "";

        if (!Array.isArray(entries) || entries.length === 0) {

            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="5">No entries yet.</td>
                </tr>
            `;

            return;
        }

        entries.forEach((entry, index) => {

            leaderboardBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.novel_title || "-"}</td>
                    <td>${entry.author_name || "-"}</td>
                    <td>${entry.category_name || "-"}</td>
                    <td>${entry.votes || 0}</td>
                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

/* =====================================
   Winners
===================================== */

async function loadWinners() {

    if (!winnersGrid) return;

    try {

        const winners = await api("/contests/winners");

        winnersGrid.innerHTML = "";

        if (!Array.isArray(winners) || winners.length === 0) {

            winnersGrid.innerHTML =
                "<p>No winners announced yet.</p>";

            return;

        }

        winners.forEach(winner => {

            winnersGrid.innerHTML += `
                <div class="winner-card">

                    <h3>🏆 ${winner.novel_title}</h3>

                    <p>
                        ${winner.author_name || ""}
                    </p>

                    <small>
                        ${winner.contest_title || ""}
                    </small>

                </div>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

/* =====================================
   Initialize
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadActiveContest();

    if (!activeContest) return;

    await loadCategories();

    if (contestUser) {

        await loadEligibleNovels();

    }

    await loadLeaderboard();

    await loadWinners();

});