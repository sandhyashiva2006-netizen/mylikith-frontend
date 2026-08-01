const API = "https://mylikith-backend.onrender.com";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href = "login.html";

}

const contestId = new URLSearchParams(
    window.location.search
).get("id");

let contest = null;

async function api(url, options = {}) {

    const response = await fetch(

        API + "/api" + url,

        {
            ...options,
            headers: {
    "Content-Type": "application/json",
    ...(options.headers || {})
}
        }

    );

    return response.json();

}	

async function loadContest() {

    try {

        const response = await api(
            `/contests/${contestId}`
        );

        if (!response.success) {

            alert(response.message);

            return;

        }

        contest = response.contest;

        document.getElementById("contestTitle").textContent =
            contest.title;

        document.getElementById("contestDescription").textContent =
            contest.description || "";

        document.getElementById("contestStatus").textContent =
            contest.status;

        document.getElementById("contestLanguage").textContent =
            contest.language;


const prizePool = parseFloat(contest.prize_pool || 0);

document.getElementById("contestPrize").textContent =
    prizePool.toLocaleString("en-IN");

document.getElementById("firstPrize").textContent =
    `₹${Math.round(prizePool * 0.60).toLocaleString("en-IN")}`;

document.getElementById("secondPrize").textContent =
    `₹${Math.round(prizePool * 0.30).toLocaleString("en-IN")}`;

document.getElementById("thirdPrize").textContent =
    `₹${Math.round(prizePool * 0.10).toLocaleString("en-IN")}`;





        document.getElementById("registrationEnd").textContent =
            contest.registration_end
                ? new Date(contest.registration_end)
                    .toLocaleDateString("en-IN")
                : "-";

const rulesElement = document.getElementById("contestRules");

if (contest.rules && contest.rules.trim()) {

    rulesElement.innerHTML =
        contest.rules.replace(/\n/g, "<br>");

} else {

    rulesElement.innerHTML = `
        <p>No rules have been added for this contest yet.</p>
    `;

}

if (contest.registration_end) {

    startCountdown(contest.registration_end);

}

        loadCategories();

        loadEligibleNovels();

       await loadLeaderboard();

await loadWinners();

    } catch (err) {

        console.error(err);

    }

}

async function loadCategories() {

    try {

        const categories = await api(
            `/contests/${contestId}/categories`
        );

        const grid =
            document.getElementById("categoryGrid");

        const select =
            document.getElementById("categorySelect");

        grid.innerHTML = "";

        select.innerHTML =
            `<option value="">Select Category</option>`;

        categories.forEach(category => {

            grid.innerHTML += `
                <div class="category-card">
                    ${category.category}
                </div>
            `;

            select.innerHTML += `
                <option value="${category.id}">
                    ${category.category}
                </option>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

async function loadEligibleNovels() {

    try {

 const novels = await api(
    `/contests/eligible-novels?contest_id=${contestId}&user_id=${user.id}`
);

        const select =
            document.getElementById("novelSelect");

        select.innerHTML =
            `<option value="">Select Novel</option>`;

        if (!Array.isArray(novels)) {

    console.log(novels);

    return;

}

novels.forEach(novel => {

            select.innerHTML += `
                <option value="${novel.id}">
                    ${novel.title}
                </option>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

async function loadLeaderboard() {

    try {

        const leaderboard = await api(
            `/contests/${contestId}/leaderboard`
        );

        const tbody =
            document.getElementById("leaderboardBody");

        tbody.innerHTML = "";

        if (!leaderboard.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No entries yet.
                    </td>
                </tr>
            `;

            return;

        }

        leaderboard.forEach((entry, index) => {

            tbody.innerHTML += `
                <tr>

                    <td>${index + 1}</td>

                    <td>${entry.novel_title}</td>

                    <td>${entry.writer_name}</td>

                    <td>${entry.category_name}</td>

                    <td>${entry.votes}</td>

                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

document
.getElementById("registerContestBtn")
.addEventListener(
    "click",
    registerNovel
);

async function registerNovel() {

    const novelId =
        document.getElementById("novelSelect").value;

    const categoryId =
        document.getElementById("categorySelect").value;

    if (!novelId || !categoryId) {

        alert(
            "Please select novel and category."
        );

        return;

    }

    const result = await api(

        `/contests/${contestId}/register`,

        {

            method: "POST",

            body: JSON.stringify({

    user_id: user.id,

    novel_id: novelId,

    category_id: categoryId

})

        }

    );

    const status =
        document.getElementById(
            "registrationStatus"
        );

    status.textContent =
        result.message;

    if (result.success) {

        loadLeaderboard();

    }

}

const copyContestLink = document.getElementById("copyContestLink");

if (copyContestLink) {

    copyContestLink.onclick = async () => {

        await navigator.clipboard.writeText(window.location.href);

        alert("Contest link copied.");

    };

}

const shareWhatsapp = document.getElementById("shareWhatsapp");

if (shareWhatsapp) {

    shareWhatsapp.onclick = () => {

        window.open(
            `https://wa.me/?text=${encodeURIComponent(window.location.href)}`
        );

    };

}

const shareTelegram = document.getElementById("shareTelegram");

if (shareTelegram) {

    shareTelegram.onclick = () => {

        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`
        );

    };

}

const shareX = document.getElementById("shareX");

if (shareX) {

    shareX.onclick = () => {

        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`
        );

    };

}

function startCountdown(endDate) {

    function update() {

        const diff = new Date(endDate) - new Date();

        if (diff <= 0) return;

        document.getElementById("days").textContent =
            String(Math.floor(diff / 86400000)).padStart(2, "0");

        document.getElementById("hours").textContent =
            String(Math.floor(diff / 3600000) % 24).padStart(2, "0");

        document.getElementById("minutes").textContent =
            String(Math.floor(diff / 60000) % 60).padStart(2, "0");

        document.getElementById("seconds").textContent =
            String(Math.floor(diff / 1000) % 60).padStart(2, "0");

    }

    update();

    setInterval(update, 1000);

}

const tableWrapper = document.querySelector(".leaderboard-table-wrapper");

if (tableWrapper) {

    let startX = 0;
    let scrollLeft = 0;
    let dragging = false;

    tableWrapper.addEventListener("touchstart", e => {

        dragging = true;
        startX = e.touches[0].pageX;
        scrollLeft = tableWrapper.scrollLeft;

    });

    tableWrapper.addEventListener("touchmove", e => {

        if (!dragging) return;

        const x = e.touches[0].pageX;

        tableWrapper.scrollLeft =
            scrollLeft - (x - startX);

    });

    tableWrapper.addEventListener("touchend", () => {

        dragging = false;

    });

}

async function loadWinners() {

    try {

        const winners = await api(
            `/contests/${contestId}/winners`
        );

        const grid =
            document.getElementById("winnersGrid");

        if (!Array.isArray(winners) || !winners.length) {

            grid.innerHTML = `
                <p class="loading">
                    Winners will be announced after the contest ends.
                </p>
            `;

            return;

        }

        grid.innerHTML = "";

        winners.forEach(winner => {

            const emoji =
                winner.position === 1 ? "🥇" :
                winner.position === 2 ? "🥈" :
                "🥉";

            grid.innerHTML += `
                <div class="winner-card">

                    <div class="badge">
                        ${emoji} ${winner.badge}
                    </div>

                    <h3>${winner.novel_title}</h3>

                    <p>${winner.writer_name}</p>

                    <div class="prize">
                        ₹${Number(winner.prize_amount).toLocaleString("en-IN")}
                    </div>

                </div>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

loadContest();