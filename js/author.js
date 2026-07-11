const API = "https://mylikith-backend.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));

const params = new URLSearchParams(window.location.search);

const authorId = params.get("id");

if (!authorId) {
    window.location = "explore.html";
}

loadAuthor();

async function loadAuthor() {

    try {

        const res = await fetch(`${API}/authors/${authorId}`);

        const data = await res.json();

        if (!data.author) {

            document.querySelector(".author-container").innerHTML = `
                <h2 style="text-align:center">
                    Author not found.
                </h2>
            `;

            return;
        }

        document.getElementById("authorImage").src =
            data.author.profile_image ||
            "assets/images/default-avatar.png";

        document.getElementById("authorName").textContent =
            data.author.name;

        document.getElementById("authorBio").textContent =
            data.author.bio || "No bio available.";

        document.getElementById("authorNovelCount").textContent =
            data.stats.novels;

        document.getElementById("authorViews").textContent =
            Number(data.stats.views).toLocaleString();

        document.getElementById("authorRating").textContent =
            data.stats.rating || "0";

        renderBooks(data.novels);

        loadFollowStatus();

    } catch (err) {

        console.error(err);

    }

}

function renderBooks(books) {

    const container = document.getElementById("authorBooks");

    if (!books.length) {

        container.innerHTML = `
            <p>No published novels yet.</p>
        `;

        return;
    }

    container.innerHTML = books.map(book => `

<div class="common-novel-card">

<img
class="common-novel-cover"
src="${book.cover_url}"
alt="${book.title}">

<div class="common-novel-body">

<h2>${book.title}</h2>

<div class="common-novel-meta">

<span>${book.category}</span>

<span>${book.language}</span>

</div>

<a
href="novel.html?id=${book.id}"
class="btn btn-primary w-100">

Read Now

</a>

</div>

</div>

`).join("");

}

async function loadFollowStatus() {

    if (!user) return;

    try {

        const res = await fetch(

`${API}/follow-status?user_id=${user.id}&author_id=${authorId}`

        );

        const data = await res.json();

        const btn =
            document.getElementById("followAuthorBtn");

        btn.textContent =
            data.following
                ? "Following"
                : "Follow";

    } catch (err) {

        console.log(err);

    }

}

document
.getElementById("followAuthorBtn")
.onclick = async () => {

    if (!user) {

        window.location = "login.html";

        return;

    }

    await fetch(`${API}/follow`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            user_id: user.id,

            author_id: authorId

        })

    });

    loadFollowStatus();

};