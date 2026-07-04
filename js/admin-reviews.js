const API="https://mylikith-backend.onrender.com";

const admin=
JSON.parse(localStorage.getItem("user"));

if(!admin){

window.location.href="admin-login.html";

}

if(admin.role!=="admin"){

window.location.href="index.html";

}

let reviews=[];

async function loadReviews(){

const response=
await adminFetch(`${API}/api/admin/reviews`);

reviews=
await response.json();

renderReviews(reviews);

}

function renderReviews(list){

const table=
document.getElementById("reviewsTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=
"<div class='loading'>No reviews found</div>";

return;

}

list.forEach(review=>{

table.innerHTML+=`

<div class="review-row">

<div>

<strong>${review.novel}</strong>

<br>

${review.review}

</div>

<div>

⭐ ${review.rating}

</div>

<div>

${review.user}

</div>

<div class="user-actions">

<button
class="admin-btn delete-btn"
onclick="deleteReview(${review.id})">

Delete

</button>

</div>

</div>

`;

});

}

document.getElementById("searchReview")
.addEventListener("input",function(){

const q=this.value.toLowerCase();

renderReviews(

reviews.filter(r=>

r.review.toLowerCase().includes(q)

||

r.novel.toLowerCase().includes(q)

||

r.user.toLowerCase().includes(q)

)

);

});

async function deleteReview(id){

if(!confirm("Delete review?"))
return;

await adminFetch(

`${API}/api/admin/reviews/${id}`,

{

method:"DELETE"

}

);

loadReviews();

}

const logoutBtn=
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");

window.location.href=
"admin-login.html";

};

}

loadReviews();