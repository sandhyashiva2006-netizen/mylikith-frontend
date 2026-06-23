const params = new URLSearchParams(window.location.search);

const novelId = params.get("id");

let currentNovel = null;

function formatNumber(num){

    if(num >= 1000000){
        return (num/1000000).toFixed(1) + "M";
    }

    if(num >= 1000){
        return (num/1000).toFixed(0) + "K";
    }

    return num;
}

async function loadNovel() {

    try {

        const response = await fetch(
            `https://mylikith-backend.onrender.com/api/novels/${novelId}`
        );

        const novel = await response.json();

currentNovel = novel;

loadFollowers();
loadRating();
checkFollowStatus();

if (!novel || !novel.id) {
    document.getElementById("novelTitle").textContent =
        "Novel Not Found";
    return;
}

        document.getElementById("novelTitle").textContent =
            novel.title;

document.title =
`${novel.title} - Mylikith`;

        document.getElementById("novelDescription").textContent =
            novel.description;

        document.getElementById("novelLanguage").textContent =
            novel.language;

        document.getElementById("novelCategory").textContent =
            novel.category;

        document.getElementById("novelStatus").textContent =
            novel.status;

        document.getElementById("novelReads").textContent =
            formatNumber(novel.views);

      

    } catch (error) {

        console.error(error);

    }

}



async function loadChapters(){

try {

const response =
await fetch(
`https://mylikith-backend.onrender.com/api/novels/${novelId}/chapters`
);

const chapters =
await response.json();

const container =
document.getElementById(
"chaptersList"
);

container.innerHTML = "";

if(chapters.length > 0){

document
.getElementById("startReadingBtn")
.onclick = () => {

window.location.href =
`reader.html?chapter=${chapters[0].id}`;

};

}

if(chapters.length === 0){

container.innerHTML =
"<p>No chapters yet</p>";

return;

}

chapters.forEach(chapter => {

container.innerHTML += `

<a
href="reader.html?chapter=${chapter.id}"
class="chapter-card">

Chapter ${chapter.chapter_no} :
${chapter.title}

</a>

`;

});

}
catch(error){

console.error(error);

document.getElementById(
"chaptersList"
).innerHTML =
"<p>Failed to load chapters</p>";

}

}

document
.getElementById(
"followBtn"
)
.addEventListener(
"click",
followAuthor
);

async function followAuthor(){

const user =
JSON.parse(
localStorage.getItem("user")
);

if(!user){

alert(
"Please login first"
);

return;

}

const response =
await fetch(

"https://mylikith-backend.onrender.com/api/follow",

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:user.id,

author_id:
currentNovel.author_id

})

}

);

const data =
await response.json();

if(data.success){

const btn =
document.getElementById(
"followBtn"
);

btn.textContent =
"Following";

btn.disabled = true;

btn.style.opacity =
"0.7";

}

}

async function checkFollowStatus(){

const user =
JSON.parse(
localStorage.getItem("user")
);

if(!user || !currentNovel){
return;
}

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/follow-status?user_id=${user.id}&author_id=${currentNovel.author_id}`

);

const data =
await response.json();

if(data.following){

const btn =
document.getElementById(
"followBtn"
);

btn.textContent =
"✓ Following";

btn.disabled = true;

btn.style.opacity =
"0.7";

}

}

async function submitReview(){

const user =
JSON.parse(
localStorage.getItem("user")
);

if(!user){

alert(
"Please login"
);

return;

}

const response =
await fetch(

"https://mylikith-backend.onrender.com/api/reviews",

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:user.id,

novel_id:novelId,

rating:
document.getElementById(
"ratingSelect"
).value,

review:
document.getElementById(
"reviewText"
).value

})

}

);

const data =
await response.json();

if(data.success){

alert(
"Review Saved"
);

loadReviews();

}

}

document
.getElementById(
"submitReviewBtn"
)
.addEventListener(
"click",
submitReview
);

async function loadReviews(){

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/reviews/${novelId}`

);

const reviews =
await response.json();

const container =
document.getElementById(
"reviewsList"
);

if(reviews.length===0){

container.innerHTML =
"<p>No reviews yet</p>";

return;

}

container.innerHTML = "";

reviews.forEach(review=>{

container.innerHTML += `

<div class="review-card">

<h4>

${review.name}

⭐ ${review.rating}

</h4>

<p>

${review.review}

</p>

</div>

`;

});

}

async function loadFollowers(){

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/follow-count/${currentNovel.author_id}`

);

const data =
await response.json();

document.getElementById(
"novelFollowers"
).textContent =
data.count;

}

async function loadRating(){

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/rating/${novelId}`

);

const data =
await response.json();

document.getElementById(
"novelRating"
).textContent =
data.rating || "0";

}

loadNovel();
loadChapters();
loadReviews();
