const API =
"https://mylikith-backend.onrender.com";

const user =
JSON.parse(
localStorage.getItem("user")
);

loadPremiumStatus();

if(!user){

window.location =
"login.html";

}

document.getElementById(
"profileName"
).textContent =
user.name;




document.getElementById(
"profileEmail"
).textContent =
user.email;

/* --------------------------
   Writer Badge
--------------------------- */

if(user.role==="writer"){

document.getElementById(
"writerBadge"
).innerHTML=`

<div class="badge badge-success">

✍️ Writer

</div>

`;

document.getElementById(
"writerSection"
).style.display="block";

loadWriterStats();

}

/* --------------------------
   Reader Stats
--------------------------- */

async function loadStats(){

try{

const response =
await fetch(

`${API}/api/profile/stats/${user.id}`

);

const stats =
await response.json();

document.getElementById(
"bookmarkCount"
).textContent =
stats.bookmarks;

document.getElementById(
"followCount"
).textContent =
stats.follows;

document.getElementById(
"reviewCount"
).textContent =
stats.reviews;

document.getElementById(
"commentCount"
).textContent =
stats.comments;

}
catch(err){

console.log(err);

}

}

/* --------------------------
   Writer Stats
--------------------------- */

async function loadWriterStats(){

try{

const response =
await fetch(

`${API}/api/writer/analytics/${user.id}`

);

const data =
await response.json();

document.getElementById(
"writerNovels"
).textContent =
data.novels;

document.getElementById(
"writerReads"
).textContent =
Number(data.reads).toLocaleString();

document.getElementById(
"writerFollowers"
).textContent =
data.followers;

document.getElementById(
"writerRating"
).textContent =
data.rating;

}
catch(err){

console.log(err);

}

}

/* --------------------------
   Reviews
--------------------------- */

async function loadReviews(){

try{

const response =
await fetch(

`${API}/api/profile/reviews/${user.id}`

);

const reviews =
await response.json();

const container =
document.getElementById(
"reviewsList"
);

container.innerHTML="";

if(reviews.length===0){

container.innerHTML=`

<div class="card">

No reviews yet.

</div>

`;

return;

}

reviews.forEach(review=>{

container.innerHTML+=`

<div class="review-card">

<h3>

<a
href="novel.html?id=${review.novel_id}">

${review.novel_title}

</a>

</h3>

<p>

⭐ ${review.rating}/5

</p>

<p>

${review.review}

</p>

</div>

`;

});

}
catch(err){

console.log(err);

}

}

/* --------------------------
   Comments
--------------------------- */

async function loadComments(){

try{

const response =
await fetch(

`${API}/api/profile/comments/${user.id}`

);

const comments =
await response.json();

const container =
document.getElementById(
"commentsList"
);

container.innerHTML="";

if(comments.length===0){

container.innerHTML=`

<div class="card">

No comments yet.

</div>

`;

return;

}

comments.forEach(comment=>{

container.innerHTML+=`

<div class="comment-card">

<h3>

<a
href="reader.html?chapter=${comment.chapter_id}">

${comment.novel_title}

</a>

</h3>

<p>

<b>

${comment.chapter_title}

</b>

</p>

<p>

${comment.comment}

</p>

</div>

`;

});

}
catch(err){

console.log(err);

}

}

async function loadPremiumBadge(){

try{

const premium=await fetch(

`${API}/api/premium/status/${user.id}`

);

const p=await premium.json();

if(p.premium){

document.getElementById("profileName").innerHTML+=
` <span class="premium-badge">👑 PREMIUM</span>`;

}

}catch(err){

console.log(err);

}

}

async function loadPremiumStatus(){

try{

const response=await fetch(

`${API}/api/premium/status/${user.id}`

);

const data=await response.json();

if(!data.premium)return;

document.getElementById(

"premiumBadge"

).innerHTML=`

<div class="badge badge-warning">

⭐ Premium Member

</div>

`;

}catch(err){

console.log(err);

}

}

loadStats();

loadReviews();

loadComments();

loadPremiumBadge();