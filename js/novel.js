const params = new URLSearchParams(window.location.search);

const novelId = params.get("id");

const API="https://mylikith-backend.onrender.com";

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

console.log("NOVEL DATA:", novel);

currentNovel = novel;
await Promise.all([
    loadAuthor(),
    loadFollowers(),
    loadRating(),
    loadRelated(),
    checkFollowStatus()
]);

document.querySelector(".novel-cover").innerHTML=`
<img
src="${novel.cover_url||'assets/images/default-cover.png'}"
style="width:100%;height:100%;object-fit:cover;border-radius:20px;">
`;


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



        document.getElementById(
"novelReads"
).textContent =
formatNumber(
novel.views || 0
);

      

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

document.getElementById("chapterCount").textContent=

`${chapters.length} Chapter${chapters.length===1?"":"s"}`;

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

const premium =
chapter.is_premium;

container.innerHTML += `

<a
href="reader.html?chapter=${chapter.id}"
class="chapter-card">

<div class="chapter-left">

<div class="chapter-title">

Chapter ${chapter.chapter_no}

${chapter.early_access
? `<span class="premium-badge">
⭐ Early Access
</span>`
:
premium
? `<span class="premium-badge">
🔒 Premium
</span>`
: ""}

</div>

<div>

${chapter.title}

</div>

<div class="chapter-meta">

${premium
? `Unlock for ${chapter.coins_required} Coins`
: `Ready to read`}

</div>

</div>

<div class="chapter-right">

${premium
? `🪙 Unlock →`
: `📖 Read →`}

</div>

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

const followBtn=document.getElementById("followBtn");

if(followBtn){

followBtn.addEventListener(

"click",

followAuthor

);

}

const reportButton = document.getElementById("reportBtn");

if(reportButton){

    reportButton.onclick = () => {

        alert("Report feature will be available soon.");

    };

}

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

async function reportNovel(){

const user=
JSON.parse(localStorage.getItem("user"));

if(!user){

alert("Please login");

return;

}

const reason=
prompt("Reason for reporting this novel");

if(!reason)return;

await fetch(

`${API}/api/report`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:user.id,

type:"Novel",

reported_item: currentNovel.title,

reason

})

}

);

alert("Report submitted.");

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

container.innerHTML+=`

<div class="review-card">

<div class="review-header">

<strong>

${review.name}

</strong>

<span>

${"⭐".repeat(review.rating)}

</span>

</div>

<p>

${review.review}

</p>

</div>

`;

});

}

async function loadFollowers(){

if(!currentNovel)return;

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

async function loadAuthor(){

if(!currentNovel)return;

const authorCard=document.getElementById("authorName");

if(!authorCard){

return;

}

const response=await fetch(

`${API}/api/users/${currentNovel.author_id}`

);

const author=await response.json();

document.getElementById("authorName").textContent=

author.name;

document.getElementById("authorBio").textContent=

author.bio||"Writer";

document.getElementById("authorAvatar").src=

author.profile_image||

"assets/images/default-avatar.png";

document.getElementById("authorFollowers").textContent=

author.followers||0;

document.getElementById("authorNovels").textContent=

author.total_novels||0;

document.getElementById("authorRating").textContent=

author.rating||0;

}

document.getElementById("shareBtn").onclick=async()=>{

if(navigator.share){

await navigator.share({

title:currentNovel.title,

text:currentNovel.description,

url:window.location.href

});

}else{

navigator.clipboard.writeText(window.location.href);

alert("Novel link copied.");

}

};

document.getElementById("reportBtn").onclick=()=>{

alert("Report feature will be available soon.");

};

document.getElementById("libraryBtn").onclick=async()=>{

const user=JSON.parse(localStorage.getItem("user"));

if(!user){

alert("Please login first.");

return;

}

const res=await fetch(

`${API}/api/library`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:user.id,

novel_id:novelId

})

}

);

const data=await res.json();

if(data.success){

alert("Added to Library.");

}

};

async function loadRelated(){

if(!currentNovel)return;

const response=await fetch(

`${API}/api/novels`

);

const novels=await response.json();

const container=

document.getElementById("relatedNovels");

container.innerHTML="";

novels

.filter(n=>n.id!==currentNovel.id)

.filter(n=>n.category===currentNovel.category)

.slice(0,4)

.forEach(novel=>{

container.innerHTML+=`

<div
class="related-card"
onclick="location.href='novel.html?id=${novel.id}'">

<img
src="${novel.cover_url||'assets/images/default-cover.png'}">

<div class="related-card-body">

<h3>

${novel.title}

</h3>

<p>

${novel.category}

</p>

</div>

</div>

`;

});

}

async function loadSimilarNovels(){

const response=await fetch(

`${API}/api/novels/${novelId}/similar`

);

const novels=await response.json();

const container=

document.getElementById(

"similarNovels"

);

if(!container)return;

container.innerHTML="";

if(novels.length===0){

container.innerHTML=

"<p>No recommendations.</p>";

return;

}

novels.forEach(novel=>{

container.innerHTML+=`

<a

href="novel.html?id=${novel.id}"

class="novel-card">

<img

src="${novel.cover_url}"

class="cover">

<h3>

${novel.title}

</h3>

<p>

${novel.category}

</p>

</a>

`;

});

}

async function loadAlsoRead(){

const response=await fetch(

`${API}/api/novels/${novelId}/also-read`

);

const novels=await response.json();

const container=document.getElementById(

"alsoRead"

);

if(!container)return;

container.innerHTML="";

if(novels.length===0){

container.innerHTML=

"<p>No recommendations.</p>";

return;

}

novels.forEach(novel=>{

container.innerHTML+=`

<a

href="novel.html?id=${novel.id}"

class="novel-card">

<img

src="${novel.cover_url}"

class="cover">

<h3>

${novel.title}

</h3>

<p>

${novel.category}

</p>

</a>

`;

});

}

loadNovel();
loadChapters();
loadReviews();
loadSimilarNovels();
loadAlsoRead();