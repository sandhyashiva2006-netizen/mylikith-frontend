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

        document.getElementById("contestPrize").textContent =
            Number(contest.prize_pool || 0).toLocaleString();

        document.getElementById("contestStart").textContent =
            contest.start_date
                ? new Date(contest.start_date)
                    .toLocaleDateString("en-IN")
                : "-";

        document.getElementById("contestEnd").textContent =
            contest.end_date
                ? new Date(contest.end_date)
                    .toLocaleDateString("en-IN")
                : "-";

        document.getElementById("registrationEnd").textContent =
            contest.registration_end
                ? new Date(contest.registration_end)
                    .toLocaleDateString("en-IN")
                : "-";

        loadCategories();

        loadEligibleNovels();

        loadLeaderboard();

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

loadContest();