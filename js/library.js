const API =
"https://mylikith-backend.onrender.com";

const libraryUser =
JSON.parse(
localStorage.getItem("user")
);

if(!libraryUser){

window.location =
"login.html";

}

function createLibraryCard(title,subtitle,chapterId,buttonText){

return `

<div class="library-card">

<div>

<h3>

${title}

</h3>

<p>

${subtitle}

</p>

</div>

<a
href="reader.html?chapter=${chapterId}"
class="btn btn-primary">

${buttonText}

</a>

</div>

`;

}

async function loadContinueReading(){

try{

const response = await fetch(
`${API}/api/writers/reading-progress/${libraryUser.id}`
);

if (!response.ok) {
    throw new Error("Unable to load reading progress.");
}

const text = await response.text();

if (!text.trim()) {

    document.getElementById("continueReading").innerHTML = `
        <div class="empty-card">
            No books in progress.
        </div>
    `;

    return;
}

const chapter = JSON.parse(text);

const container =
document.getElementById(
"continueReading"
);

container.innerHTML="";

if(!chapter){

container.innerHTML=`

<div class="empty-card">

No books in progress.

</div>

`;

return;

}

container.innerHTML =

createLibraryCard(

`Chapter ${chapter.chapter_no}`,

chapter.title,

chapter.id,

"Continue Reading"

);

}
catch(err){

console.log(err);

}

}

async function loadHistory(){

try{

const response =
await fetch(

`${API}/api/writers/reading-history/${libraryUser.id}`

);

const history =
await response.json();

const container =
document.getElementById(
"history"
);

container.innerHTML="";

if(history.length===0){

container.innerHTML=`

<div class="empty-card">

No reading history.

</div>

`;

return;

}

history.forEach(item=>{

container.innerHTML +=

createLibraryCard(

`Chapter ${item.chapter_no}`,

item.title,

item.id,

"Read Again"

);

});

}
catch(err){

console.log(err);

}

}

async function loadBookmarks(){

try{

const response =
await fetch(

`${API}/api/writers/bookmarks/${libraryUser.id}`

);

const bookmarks =
await response.json();

const container =
document.getElementById(
"bookmarks"
);

container.innerHTML="";

if(bookmarks.length===0){

container.innerHTML=`

<div class="empty-card">

No bookmarks.

</div>

`;

return;

}

bookmarks.forEach(item=>{

container.innerHTML +=

createLibraryCard(

`Chapter ${item.chapter_no}`,

item.title,

item.id,

"Open"

);

});

}
catch(err){

console.log(err);

}

}

async function loadLibraryBooks(){

try{

const response=await fetch(

`${API}/api/library/${libraryUser.id}`

);

const books=await response.json();

const container=

document.getElementById("libraryBooks");

container.innerHTML="";

if(books.length===0){

container.innerHTML=`

<div class="empty-card">

No novels in your library.

</div>

`;

return;

}

books.forEach(book=>{

container.innerHTML+=`

<div class="library-card">

<div>

<h3>

${book.title}

</h3>

<p>

${book.author}

</p>

<p>

${book.category} • ${book.language}

</p>

<div class="progress">

<span style="width:${book.progress}%">

</span>

</div>

<p>

${book.progress}% Complete

</p>

</div>

<div style="display:flex;gap:10px;">

<a

href="reader.html?chapter=${book.last_chapter}"

class="btn btn-primary">

Continue

</a>

<button

class="btn btn-danger"

onclick="removeLibraryBook(${book.id})">

Remove

</button>

</div>

</div>

`;

});

}catch(err){

console.log(err);

}

}

async function removeLibraryBook(id){

if(!confirm("Remove this novel?"))

return;

await fetch(

`${API}/api/library/${id}`,

{

method:"DELETE"

}

);

loadLibraryBooks();

}

loadContinueReading();

loadHistory();

loadBookmarks();

loadLibraryBooks();

loadClassicProgress();

async function loadClassicProgress() {

    try {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("authToken");

        const container =
            document.getElementById(
                "classicProgress"
            );

        if (!container) {
            return;
        }

        if (!token) {

            container.innerHTML = `
                <div class="empty-card">
                    Please login to view your Classics.
                </div>
            `;

            return;
        }


        const response = await fetch(
            `${API}/api/classic-progress`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        container.innerHTML = "";


        if (
            !response.ok ||
            !data.success ||
            !data.progress ||
            data.progress.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-card">
                    No Classics in progress.
                </div>
            `;

            return;

        }


        data.progress.forEach(item => {

            const progress =
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(
                            item.progress_percent
                        ) || 0
                    )
                );


            const cover =
                item.cover_image
                    ? `
                        <img
                            src="${escapeHTML(
                                item.cover_image
                            )}"
                            alt="${escapeHTML(
                                item.classic_title
                            )}"
                            class="classic-library-cover"
                        >
                      `
                    : `
                        <div class="classic-library-cover-placeholder">
                            📖
                        </div>
                      `;


            container.innerHTML += `

                <div class="classic-library-card">


                    <div class="classic-library-left">

                        <div class="classic-library-cover-wrap">

                            ${cover}

                        </div>


                        <div class="classic-library-info">

                            <span class="classic-library-label">
                                MYLIKITH CLASSICS
                            </span>


                            <h3>
                                ${escapeHTML(
                                    item.classic_title
                                )}
                            </h3>


                            <p class="classic-library-author">
                                ${escapeHTML(
                                    item.author_name ||
                                    "Unknown Author"
                                )}
                            </p>


                            <p class="classic-library-meta">
                                ${escapeHTML(
                                    item.category ||
                                    "Classic"
                                )}
                                •
                                ${escapeHTML(
                                    item.language ||
                                    "Unknown Language"
                                )}
                            </p>


                            <div class="classic-library-progress">

                                <div
                                    class="classic-library-progress-bar"
                                >

                                    <span
                                        style="
                                            width:${progress}%
                                        "
                                    ></span>

                                </div>


                                <span
                                    class="classic-library-progress-text"
                                >
                                    ${progress}% Complete
                                </span>

                            </div>

                        </div>

                    </div>


<div class="classic-library-action">

    <a
        href="classic.html?id=${encodeURIComponent(
            item.classic_id
        )}"
        class="classic-library-continue"
    >
        📖 Continue Reading
    </a>

    <button
        type="button"
        class="classic-library-remove"
        onclick="removeClassicProgress(${item.classic_id})"
    >
        🗑 Remove
    </button>

</div>


                </div>

            `;

        });


    } catch (err) {

        console.error(
            "Classic progress loading error:",
            err
        );


        const container =
            document.getElementById(
                "classicProgress"
            );


        if (container) {

            container.innerHTML = `
                <div class="empty-card">
                    Unable to load Classics.
                </div>
            `;

        }

    }

}

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

async function removeClassicProgress(classicId) {

    if (
        !confirm(
            "Remove this Classic from your reading progress?"
        )
    ) {
        return;
    }

    try {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("authToken");

        if (!token) {
            return;
        }

        const response = await fetch(
            `${API}/api/classic-progress/${classicId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to remove Classic."
            );

            return;
        }

        loadClassicProgress();

    } catch (error) {

        console.error(
            "Remove Classic progress error:",
            error
        );

        alert(
            "Unable to remove Classic."
        );

    }

}