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

document.title =
`${data.author.name} - MyLikith`;

const meta =
document.querySelector(
'meta[name="description"]'
);

if(meta){

meta.content =
`Read novels by ${data.author.name} on MyLikith.`;

}

        document.getElementById("authorImage").src =
            data.author.profile_image ||
            "assets/images/default-avatar.png";

        document.getElementById("authorName").textContent =
            data.author.name;

const badge =
document.querySelector(".author-badge");

const badges = [];

badges.push("✍️ Verified MyLikith Author");

if(Number(data.stats.rating) >= 4.8){
    badges.push("⭐ Top Rated");
}

if(Number(data.stats.followers) >= 100){
    badges.push("🔥 Trending");
}

if(Number(data.stats.views) >= 10000){
    badges.push("🏆 Bestseller");
}

badge.innerHTML = badges.join(" &nbsp; ");

        document.getElementById("authorBio").textContent =
            data.author.bio || "No bio available.";

const socialContainer =
document.getElementById("authorSocialLinks");

const socialLinks = [];

if(data.author.website){
socialLinks.push(
`<a href="${data.author.website}" target="_blank">🌐 Website</a>`
);
}

if(data.author.instagram){
socialLinks.push(
`<a href="${data.author.instagram}" target="_blank">📷 Instagram</a>`
);
}

if(data.author.facebook){
socialLinks.push(
`<a href="${data.author.facebook}" target="_blank">📘 Facebook</a>`
);
}

if(data.author.x){
socialLinks.push(
`<a href="${data.author.x}" target="_blank">𝕏 X</a>`
);
}

if(data.author.youtube){
socialLinks.push(
`<a href="${data.author.youtube}" target="_blank">▶️ YouTube</a>`
);
}

socialContainer.innerHTML =
socialLinks.join("");

        document.getElementById("authorNovelCount").textContent =
            data.stats.novels;

        document.getElementById("authorViews").textContent =
            Number(data.stats.views).toLocaleString();

        document.getElementById("authorRating").textContent =
            data.stats.rating || "0";

document.getElementById("authorFollowers").textContent =
Number(data.stats.followers || 0).toLocaleString();

document.getElementById("authorChapters").textContent =
Number(data.stats.chapters || 0).toLocaleString();

document.getElementById("authorLikes").textContent =
Number(data.stats.likes || 0).toLocaleString();

document.getElementById("authorAverageViews").textContent =
Number(data.stats.average_views || 0).toLocaleString();

document.getElementById("authorHeaderRating").textContent =
data.stats.rating || "0";

document.getElementById("authorHeaderFollowers").textContent =
Number(data.stats.followers || 0).toLocaleString();

document.getElementById("authorHeaderBooks").textContent =
data.stats.novels;

        renderBooks(data.novels);

        loadFollowStatus();

    } catch (err) {

        console.error(err);

    }

}

function renderBooks(books){

const container=document.getElementById("authorBooks");

if(!books.length){

container.innerHTML=`

<div class="empty-state">

📚

<h3>No Published Novels Yet</h3>

<p>

This author hasn't published any novels yet.

</p>

</div>

`;

return;

}

container.innerHTML=books.map(book=>`

<div
class="novel-card"
onclick="location.href='novel.html?id=${book.id}'">

<img
class="novel-cover"
src="${book.cover_url}"
alt="${book.title}">

<div class="novel-info">

<h3>${book.title}</h3>

<div class="novel-meta">

<span>${book.category}</span>

<span>${book.language}</span>

</div>

<div class="novel-stats">

<span>👀 ${Number(book.views).toLocaleString()}</span>

</div>

<a
href="novel.html?id=${book.id}"
class="start-btn">

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

        if(data.following){

btn.innerHTML="❤️ Following";

btn.classList.add("following");

}else{

btn.innerHTML="🤍 Follow Author";

btn.classList.remove("following");

}

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