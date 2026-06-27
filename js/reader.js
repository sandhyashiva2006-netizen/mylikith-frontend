let fontSize = 24;

const chapterContent =
document.getElementById("chapterContent");

document.body.classList.add("dark-mode");

const increaseFont=document.getElementById("increaseFont");

if(increaseFont){

increaseFont.addEventListener("click", () => {

fontSize += 2;

chapterContent.style.fontSize =
fontSize + "px";

});

}

const decreaseFont=document.getElementById("decreaseFont");

if(decreaseFont){

decreaseFont.addEventListener("click", () => {

fontSize -= 2;

chapterContent.style.fontSize =
fontSize + "px";

});

}

const darkBtn=document.getElementById("darkBtn");

if(darkBtn){

darkBtn.addEventListener("click", () => {

document.body.classList.remove("light-mode");
document.body.classList.add("dark-mode");

});

}

const lightBtn=document.getElementById("lightBtn");

if(lightBtn){

lightBtn.addEventListener("click",()=>{

document.body.classList.remove("dark-mode");
document.body.classList.add("light-mode");

});

}


window.addEventListener("scroll", () => {

let winScroll =
document.body.scrollTop ||
document.documentElement.scrollTop;

let height =
document.documentElement.scrollHeight -
document.documentElement.clientHeight;

let scrolled =
(winScroll / height) * 100;

document.getElementById(
"progressBar"
).style.width =
scrolled + "%";

});

const bookmarkBtn=document.getElementById("bookmarkBtn");

if(bookmarkBtn){

bookmarkBtn.addEventListener("click", () => {

const user =
JSON.parse(
localStorage.getItem("user")
);

const chapterId =
new URLSearchParams(
window.location.search
).get("chapter");

fetch(

"https://mylikith-backend.onrender.com/api/writers/bookmark",

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:user.id,

chapter_id:chapterId

})

}

)

.then(res=>res.json())

.then(data=>{

if(data.success){

alert(
"Bookmark Saved"
);

}

});
});

}

const translateBtn=document.getElementById("translateBtn");

if(translateBtn){

translateBtn.addEventListener("click", () => {

alert(
"Translation feature coming soon"
);

});
}

const params =
new URLSearchParams(
window.location.search
);

const chapterId =
params.get("chapter");

let currentNovelId=null;

console.log("Reader URL:", window.location.href);
console.log("Chapter ID:", chapterId);

async function loadChapter(){

try{

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/chapters/${chapterId}`

);

const chapter =
await response.json();

currentNovelId=

chapter.novel_id;

await loadChapterNavigation();

await fetch(

`https://mylikith-backend.onrender.com/api/novels/${chapter.novel_id}/view`,

{
method:"POST"
}

);

const readerUser =
JSON.parse(
localStorage.getItem("user")
);

if(readerUser){

fetch(

"https://mylikith-backend.onrender.com/api/writers/reading-progress",

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:
readerUser.id,

chapter_id:
chapter.id

})

}

);

}

fetch(
"https://mylikith-backend.onrender.com/api/writers/reading-history",
{
    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        user_id:readerUser.id,

        novel_id:chapter.novel_id,

        chapter_id:chapter.id

    })

}
);

document.title =
chapter.title + " - Mylikith";

document.getElementById(
"chapterTitle"
).textContent =
`Chapter ${chapter.chapter_no} - ${chapter.title}`;

document.getElementById(
"chapterContent"
).innerHTML =
chapter.content.replace(
/\n/g,
"<br><br>"
);

}
catch(err){

console.error(err);

}

}

loadChapter();

const commentBtn=document.getElementById("commentBtn");

if(commentBtn){

commentBtn.addEventListener(
"click",
submitComment
);

}

async function submitComment(){

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

const comment =
document.getElementById(
"commentText"
).value;

const response =
await fetch(

"https://mylikith-backend.onrender.com/api/comments",

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:user.id,

chapter_id:chapterId,

comment

})

}

);

const data =
await response.json();

if(data.success){

document.getElementById(
"commentText"
).value = "";

loadComments();

let chapterList=[];

let currentIndex=-1;

async function loadChapterNavigation(){

const response=await fetch(

`${API}/api/novels/${currentNovelId}/chapters`

);

chapterList=await response.json();

currentIndex=

chapterList.findIndex(

c=>c.id==chapterId

);

document.getElementById("prevChapterBtn").disabled=

currentIndex<=0;

document.getElementById("nextChapterBtn").disabled=

currentIndex>=chapterList.length-1;

}

}

}

async function loadComments(){

const response =
await fetch(

`https://mylikith-backend.onrender.com/api/comments/${chapterId}`

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
"<p>No comments yet</p>";

return;

}

comments.forEach(comment=>{

container.innerHTML += `

<div class="comment-card">

<strong>

${comment.name}

</strong>

<p>

${comment.comment}

</p>

</div>

`;

});

}

loadComments();

document.getElementById("prevChapterBtn").onclick=()=>{

if(currentIndex<=0)return;

location.href=

`reader.html?chapter=${chapterList[currentIndex-1].id}`;

};

document.getElementById("nextChapterBtn").onclick=()=>{

if(currentIndex>=chapterList.length-1)return;

location.href=

`reader.html?chapter=${chapterList[currentIndex+1].id}`;

};