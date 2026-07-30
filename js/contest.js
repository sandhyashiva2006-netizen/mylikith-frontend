const API =
"https://mylikith-backend.onrender.com";

let activeContest = null;
let countdownInterval = null;

const contestTitle = document.getElementById("contestTitle");
const contestDescription = document.getElementById("contestDescription");
const contestBanner = document.getElementById("contestBanner");

const prizePool = document.getElementById("prizePool");

const countdown = document.getElementById("countdown");

const categoryContainer = document.getElementById("contestCategories");

const leaderboardContainer = document.getElementById("leaderboard");

const winnersContainer = document.getElementById("hallOfFame");

const registrationForm = document.getElementById("contestRegistrationForm");

const novelSelect = document.getElementById("contestNovel");

const categorySelect = document.getElementById("contestCategory");

function getToken() {

    return localStorage.getItem("token");

}

async function api(url, options = {}) {

    const response = await fetch(`${API}/api${url}`, {

        headers: {

            "Content-Type": "application/json",

            Authorization: "Bearer " + getToken()

        },

        ...options

    });

    return response.json();

}

async function loadActiveContest() {

    try {

        const data = await api("/contests/active");

        if (!data.success) {

            contestTitle.textContent = "No Active Contest";
            contestDescription.textContent = "There are no contests running right now.";

            if (registrationForm) {
                registrationForm.style.display = "none";
            }

            return;

        }

        activeContest = data.contest;

        if (contestTitle) {
            contestTitle.textContent = activeContest.title;
        }

        if (contestDescription) {
            contestDescription.textContent = activeContest.description || "";
        }

        if (prizePool) {
            prizePool.textContent = Number(activeContest.prize_pool || 0).toLocaleString();
        }

        if (contestBanner && activeContest.banner_url) {
            contestBanner.src = activeContest.banner_url;
            contestBanner.style.display = "block";
        }

        startCountdown(activeContest.end_date);

        await loadCategories();

        await loadEligibleNovels();

        await loadLeaderboard();

        await loadWinners();

    } catch (err) {

        console.error(err);

        contestTitle.textContent = "Unable to load contest.";

    }

}

function startCountdown(endDate) {

    if (countdownInterval) {

        clearInterval(countdownInterval);

    }

    function update() {

        const distance = new Date(endDate) - new Date();

        if (distance <= 0) {

            countdown.textContent = "Contest Ended";

            clearInterval(countdownInterval);

            return;

        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.textContent =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

    }

    update();

    countdownInterval = setInterval(update, 1000);

}

document.addEventListener("DOMContentLoaded", async () => {

    await loadActiveContest();

});

