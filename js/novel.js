const API="https://mylikith-backend.onrender.com";

const params = new URLSearchParams(window.location.search);

const novelId = params.get("id");


let currentNovel = null;
let currentPage = 0;
let allChapters = [];

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
    checkFollowStatus()
]);

const cover=document.getElementById("novelCover");

if(cover){

cover.src=novel.cover_url || "assets/images/default-cover.png";

}


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

      loadSimilarNovels();
loadAlsoRead();

    } catch (error) {

        console.error(error);

    }

}




async function loadChapters(){

    try{

        const response = await fetch(
            `${API}/api/novels/${novelId}/chapters`
        );

        const chapters = await response.json();

        document.getElementById("chapterCount").textContent =
            `${chapters.length} Chapter${chapters.length===1?"":"s"}`;

        if(chapters.length===0){

            document.getElementById("chaptersList").innerHTML =
                "<p>No chapters yet</p>";

            return;

        }

        const startBtn =
            document.getElementById("startReadingBtn");

        if(startBtn){

            startBtn.onclick = ()=>{

                window.location.href =
                    `reader.html?chapter=${chapters[0].id}`;

            };

        }

        allChapters = chapters;

        renderChapterPage(0);

    }catch(error){

        console.error(error);

        document.getElementById("chaptersList").innerHTML =
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

function renderChapterPage(page){

      const container =
        document.getElementById("chaptersList");

    const ranges =
        document.getElementById("chapterRanges");

    container.innerHTML = "";

    ranges.innerHTML = "";

    const totalPages =
        Math.ceil(allChapters.length / 20);

    for(let i=0;i<totalPages;i++){

        const btn=document.createElement("button");

        btn.className="range-btn";

        if(i===page){

            btn.classList.add("active");

        }

        const start=i*20+1;

        const end=Math.min(start+19,allChapters.length);

        btn.textContent=`${start}-${end}`;

        btn.onclick=()=>renderChapterPage(i);

        ranges.appendChild(btn);

    }

    const list =
        allChapters.slice(page*20,page*20+20);

    list.forEach(chapter=>{

        const premium = chapter.is_premium;

        container.innerHTML += `

<a
href="reader.html?chapter=${chapter.id}"
class="chapter-card">

<div class="chapter-left">

<div class="chapter-top">

<h3>

Chapter ${chapter.chapter_no}

</h3>

${
chapter.early_access
? `<span class="early-access">⭐ Early Access</span>`
: premium
? `<span class="premium-badge">🔒 Premium</span>`
: `<span class="free-badge">FREE</span>`
}

</div>

<p class="chapter-name">

${chapter.title}

</p>

<p class="chapter-meta">

${
premium
? `🪙 ${chapter.coins_required} Coins`
: `📖 Free to Read`
}

</p>

</div>

<div class="chapter-arrow">

➜

</div>

</a>

`;

    });

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

    const response=await fetch(

        `${API}/api/reviews/${novelId}`

    );

    const reviews=await response.json();

    const container=document.getElementById("reviewsList");

    if(reviews.length===0){

        container.innerHTML="<p>No reviews yet</p>";

        return;

    }

    container.innerHTML="";

    reviews.forEach(review=>{

        container.innerHTML+=`

        <div class="review-card">

            <div class="review-header">

                <div>

                    <strong>${review.name}</strong>

                    <p class="review-role">

                        📖 Reader

                    </p>

                </div>

                <div class="review-stars">

                    ${"⭐".repeat(review.rating)}

                </div>

            </div>

            <p>${review.review}</p>

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

document.getElementById("authorLink").href =
`author.html?id=${currentNovel.author_id}`;

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

document.getElementById("shareBtn").onclick = async () => {

    if(navigator.share){

        await navigator.share({

            title: currentNovel.title,

            text: currentNovel.description,

            url: window.location.href

        });

    }else{

        navigator.clipboard.writeText(window.location.href);

        alert("Novel link copied.");

    }

};

document.getElementById("reportBtn").onclick = reportNovel;

document.getElementById("libraryBtn").onclick = async()=>{

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

<div class="card-meta">

<span>

📚 ${novel.category}

</span>

<span>

🌐 ${novel.language||"English"}

</span>

</div>

<button class="mini-read">

Read →

</button>

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

const mobileReadBtn=document.getElementById("mobileReadBtn");

if(mobileReadBtn){

mobileReadBtn.onclick=()=>{

document.getElementById("startReadingBtn").click();

};

}

const toggleBtn=document.getElementById("toggleDescription");
const description=document.getElementById("novelDescription");

if(toggleBtn && description){

description.style.maxHeight="120px";
description.style.overflow="hidden";

let expanded=false;

toggleBtn.onclick=()=>{

expanded=!expanded;

if(expanded){

description.style.maxHeight="none";
toggleBtn.textContent="Show Less";

}else{

description.style.maxHeight="120px";
toggleBtn.textContent="Show More";

}

};

}

document.addEventListener("click",e=>{

    if(!e.target.classList.contains("tab-btn"))
        return;

    document.querySelectorAll(".tab-btn")
    .forEach(btn=>btn.classList.remove("active"));

    document.querySelectorAll(".tab-content")
    .forEach(tab=>tab.classList.remove("active"));

    e.target.classList.add("active");

    document
        .getElementById(
            e.target.dataset.tab
        )
        .classList.add("active");

});

loadNovel();
loadChapters();
loadReviews();