const API = window.API;

const params = new URLSearchParams(window.location.search);

const contestId = params.get("id");

async function loadContest() {

    try {

        const response = await adminFetch(
            `${API}/api/admin/contests/${contestId}`
        );

        const contest = await response.json();

        document.getElementById("contestTitle").textContent =
            contest.title;

        document.getElementById("contestLanguage").textContent =
            contest.language;

        document.getElementById("contestPrize").textContent =
            "₹" + Number(contest.prize_pool || 0).toLocaleString();

        document.getElementById("contestStatus").textContent =
            contest.status;

        loadEntries();

    } catch (err) {

        console.error(err);

    }

}

async function loadEntries() {

    try {

        const response = await adminFetch(
            `${API}/api/contests/${contestId}/leaderboard`
        );

        const entries = await response.json();

        document.getElementById("contestEntries").textContent =
            entries.length;

        const tbody =
            document.getElementById("entriesTable");

        tbody.innerHTML = "";

        if (!entries.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">
                        No entries found.
                    </td>
                </tr>
            `;

            return;

        }

        entries.forEach(entry => {

            tbody.innerHTML += `
                <tr>

                    <td>${entry.novel_title}</td>

                    <td>${entry.writer_name}</td>

                    <td>${entry.category_name}</td>

                    <td>${entry.votes}</td>

                    <td>
                        ${
                            new Date(
                                entry.created_at
                            ).toLocaleDateString()
                        }
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="removeEntry(${entry.id})">

                            Remove

                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

async function removeEntry(id) {

    if (!confirm("Remove this contest entry?")) {

        return;

    }

    try {

        const response = await adminFetch(

            ``${API}/api/admin/contests/contest-entries/${id}`,

            {
                method: "DELETE"
            }

        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            alert(result.message);

            return;

        }

        loadEntries();

    } catch (err) {

        console.error(err);

    }

}

loadContest();