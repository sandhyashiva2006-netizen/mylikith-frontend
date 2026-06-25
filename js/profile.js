const API =
"https://mylikith-backend.onrender.com";

const user =
JSON.parse(
localStorage.getItem("user")
);

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

async function loadStats(){

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



async function loadContinueReading(){

const response =
await fetch(

`${API}/api/profile/continue/${user.id}`

);

const data =
await response.json();

const container =
document.getElementById(
"continueReading"
);

if(!data){

container.innerHTML =
"No books in progress.";

return;

}

container.innerHTML = `

<div class="continue-card">

<div>

<h3>${data.novel_title}</h3>

<p>${data.chapter_title}</p>

</div>

<button
onclick="window.location='reader.html?chapter=${data.chapter_id}'">

Continue Reading

</button>

</div>

`;

}



async function loadHistory(){

const response =
await fetch(

`${API}/api/profile/history/${user.id}`

);

const history =
await response.json();

const container =
document.getElementById(
"historyList"
);

container.innerHTML="";

if(history.length===0){

container.innerHTML=
"No reading history.";

return;

}

history.forEach(item=>{

container.innerHTML+=`

<div class="history-card">

<div>

<h3>${item.novel_title}</h3>

<p>${item.chapter_title}</p>

</div>

<button
onclick="window.location='reader.html?chapter=${item.chapter_id}'">

Read Again

</button>

</div>

`;

});

}



async function loadReviews(){

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

container.innerHTML=
"No reviews yet.";

return;

}

reviews.forEach(review=>{

container.innerHTML+=`

<div class="review-card">

<div>

<h3>

<a href="novel.html?id=${review.novel_id}">

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

</div>

`;

});

}



async function loadComments(){

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

container.innerHTML = "";

if(comments.length===0){

container.innerHTML =
"No comments yet.";

return;

}

comments.forEach(comment=>{

container.innerHTML += `

<div class="comment-card">

<div>

<h3>

<a href="reader.html?chapter=${comment.chapter_id}">

${comment.novel_title}

</a>

</h3>

<p>

<b>${comment.chapter_title}</b>

</p>

<p>

${comment.comment}

</p>

</div>

</div>

`;

});

}

loadStats();

loadContinueReading();

loadHistory();

loadReviews();

loadComments();