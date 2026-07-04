const admin=
JSON.parse(localStorage.getItem("user"));

if(!admin){

window.location.href="admin-login.html";

}

if(admin.role!=="admin"){

window.location.href="index.html";

}

const API="https://mylikith-backend.onrender.com";

let comments=[];

async function loadComments(){

const response=

await adminFetch(`${API}/api/admin/comments`);

comments=

await response.json();

renderComments(comments);

}

function renderComments(list){

const table=

document.getElementById("commentsTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=
"<div class='loading'>No comments found</div>";

return;

}

list.forEach(comment=>{

table.innerHTML+=`

<div class="comment-row">

<div>

${comment.comment}

</div>

<div>

${comment.user}

</div>

<div>

${comment.chapter}

</div>

<div class="user-actions">

<button
class="admin-btn delete-btn"
onclick="deleteComment(${comment.id})">

Delete

</button>

</div>

</div>

`;

});

}

document.getElementById("searchComment")
.addEventListener("input",function(){

const q=this.value.toLowerCase();

renderComments(

comments.filter(c=>

c.comment.toLowerCase().includes(q)

||

c.user.toLowerCase().includes(q)

||

c.chapter.toLowerCase().includes(q)

)

);

});

async function deleteComment(id){

if(!confirm("Delete comment?"))
return;

await adminFetch(

`${API}/api/admin/comments/${id}`,

{

method:"DELETE"

}

);

loadComments();

}

loadComments();

const logoutBtn=
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=(e)=>{

e.preventDefault();

localStorage.removeItem("user");

window.location.href="admin-login.html";

};

}