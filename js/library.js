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

if (!token) {
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

        const data = await response.json();

        const container =
            document.getElementById(
                "classicProgress"
            );

        if (!container) {
            return;
        }

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

            container.innerHTML += `

                <div class="library-card">

                    <div>

                        <h3>
                            ${item.classic_title}
                        </h3>

                        <p>
                            ${item.author_name || "Unknown Author"}
                        </p>

                        <p>
                            ${item.category || "Classic"}
                            •
                            ${item.language || "Unknown Language"}
                        </p>

                        <div class="progress">

                            <span
                                style="
                                    width:${item.progress_percent}%
                                "
                            ></span>

                        </div>

                        <p>
                            ${item.progress_percent}% Complete
                        </p>

                    </div>


                    <div>

                        <a
                            href="classic.html?id=${item.classic_id}"
                            class="btn btn-primary"
                        >
                            Continue
                        </a>

                    </div>

                </div>

            `;

        });

    }
    catch (err) {

        console.log(
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