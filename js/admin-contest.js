const API = "https://mylikith-backend.onrender.com";

const admin = JSON.parse(localStorage.getItem("user"));

if (!admin) {

    window.location.href = "admin-login.html";

}

if (admin.role !== "admin") {

    window.location.href = "index.html";

}

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
    `${API}/api/admin/contests/${contestId}/entries`
);

        const entries = await response.json();

console.log("Entries:", entries);

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

const winner1 = document.getElementById("winner1");
const winner2 = document.getElementById("winner2");
const winner3 = document.getElementById("winner3");

winner1.innerHTML = `<option value="">Select Entry</option>`;
winner2.innerHTML = `<option value="">Select Entry</option>`;
winner3.innerHTML = `<option value="">Select Entry</option>`;

entries.forEach(entry => {

    const option = `
        <option value="${entry.id}">
            ${entry.novel_title} (${entry.category_name})
        </option>
    `;

    winner1.insertAdjacentHTML("beforeend", option);
    winner2.insertAdjacentHTML("beforeend", option);
    winner3.insertAdjacentHTML("beforeend", option);

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

            `${API}/api/admin/contests/contest-entries/${id}`,

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

document.getElementById("announceWinners").onclick = async () => {

    const winners = [

        document.getElementById("winner1").value,

        document.getElementById("winner2").value,

        document.getElementById("winner3").value

    ];

    if (winners.includes("")) {

        alert("Please select all winners.");

        return;

    }

    const response = await adminFetch(

        `${API}/api/admin/contests/${contestId}/winners`,

        {

            method: "POST",

            headers: {

                "Content-Type":"application/json"

            },

            body: JSON.stringify({

                winners

            })

        }

    );

    const result = await response.json();

    alert(result.message);

};

loadContest();