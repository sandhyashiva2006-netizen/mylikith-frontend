const API="https://mylikith-backend.onrender.com";

const params=

new URLSearchParams(

window.location.search

);

const authorId=params.get("id");

loadAuthor();

async function loadAuthor(){

const response=await fetch(

`${API}/api/authors/${authorId}`

);

const data=await response.json();

document.getElementById(

"authorName"

).textContent=

data.author.name;

document.getElementById(

"authorBio"

).textContent=

data.author.bio||"";

document.getElementById(

"authorImage"

).src=

data.author.profile_image||

"assets/images/default-user.png";

document.getElementById(

"authorNovelCount"

).textContent=

data.stats.novels;

document.getElementById(

"authorViews"

).textContent=

Number(

data.stats.views

).toLocaleString();

document.getElementById(

"authorRating"

).textContent=

data.stats.rating||0;

const container=

document.getElementById(

"authorBooks"

);

container.innerHTML="";

data.novels.forEach(book=>{

container.innerHTML+=`

<a

href="novel.html?id=${book.id}"

class="novel-card">

<img

src="${book.cover_url}"

class="cover">

<h3>

${book.title}

</h3>

<p>

${book.category}

</p>

</a>

`;

});

}