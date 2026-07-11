const API =
"https://mylikith-backend.onrender.com";

const user =
JSON.parse(
localStorage.getItem("user")
);



document.getElementById("myReferralCode").value =
user.referral_code || "";

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

const profileImage =
document.getElementById("profileImage");

profileImage.onerror=function(){

this.src="assets/images/default-avatar.png";

};

loadProfileImage();

async function loadProfileImage(){

try{

const response = await fetch(

`${API}/api/users/${user.id}`

);

const latestUser = await response.json();


user.profile_image = latestUser.profile_image;

localStorage.setItem(

"user",

JSON.stringify(user)

);



profileImage.src =
latestUser.profile_image ||
"assets/images/default-avatar.png";



}catch(err){

profileImage.src =
user.profile_image
? user.profile_image+"?t="+Date.now()
: "assets/images/default-avatar.png";

}

}

document.getElementById(
"profileAvatar"
).onclick=()=>{

document
.getElementById(
"profilePhotoInput"
).click();

};

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

async function loadReferralStats(){

try{

const response=await fetch(

`${API}/api/referrals/${user.id}`

);

const data=await response.json();

document.getElementById("totalReferrals").textContent=

data.total_referrals;

document.getElementById("coinsEarned").textContent=

data.coins_earned;

}catch(err){

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
).style.display="none";

}catch(err){

console.log(err);

}

}

loadPremiumReading();

async function loadPremiumReading(){

const response=

await fetch(

`${API}/api/premium/reading-stats/${user.id}`

);

const data=

await response.json();

if(!data.premium){

document.getElementById(

"premiumReadingStats"

).style.display="none";

return;

}

document.getElementById(

"premiumReadingStats"

).innerHTML=`

<div class="analytics-grid">

<div class="analytics-card">

<h2>

${data.totalHours}

</h2>

<p>

Hours Read

</p>

</div>

<div class="analytics-card">

<h2>

${data.totalChapters}

</h2>

<p>

Premium Chapters

</p>

</div>

<div class="analytics-card">

<h2>

${data.totalDays}

</h2>

<p>

Reading Days

</p>

</div>

</div>

<div class="analytics-card">

<h2>

${data.totalWords}

</h2>

<p>

Words Read

</p>

</div>

<div class="analytics-card">

<h2>

${data.completed}

</h2>

<p>

Chapters Finished

</p>

</div>

`;

}

async function loadPremiumAchievements(){

const response=await fetch(

`${API}/api/premium/achievements/${user.id}`

);

const achievements=await response.json();

const container=

document.getElementById(

"premiumAchievements"

);

if(!container)return;

container.innerHTML="";

if(achievements.length===0){

container.innerHTML=

"<p>No achievements yet.</p>";

return;

}

achievements.forEach(item=>{

container.innerHTML+=`

<div class="achievement-card">

<h3>

${item.icon} ${item.title}

</h3>

<p>

${item.description}

</p>

</div>

`;

});

}

/* --------------------------
   Writer Application
--------------------------- */

async function checkWriterApplication(){

try{

const response=await fetch(

`${API}/api/writers/application/${user.id}`

);

const data=await response.json();

if(user.role==="writer"){

return;

}

const card=

document.getElementById(

"becomeWriterCard"

);

if(!data.exists){

card.style.display="block";

document.getElementById(

"applyWriterBtn"

).onclick=showWriterApplication;

return;

}

card.style.display="block";

document.getElementById(

"applyWriterBtn"

).disabled=true;

document.getElementById(

"applyWriterBtn"

).innerText=

`Application ${data.application.status}`;

}catch(err){

console.log(err);

}

}

function showWriterApplication(){

const penName=

prompt("Pen Name");

if(!penName)return;

const bio=

prompt("Short Bio");

if(bio===null)return;

const experience=

prompt(

"Writing Experience (Optional)"

);

fetch(

`${API}/api/writers/apply`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:user.id,

pen_name:penName,

bio,

experience

})

}

)

.then(r=>r.json())

.then(data=>{

if(data.success){

alert(

data.message ||

"Application submitted successfully."

);

location.reload();

}else{

alert(

data.message ||

"Unable to submit application."

);

}

});

}



document.getElementById("myReferralCode").textContent=user.referral_code;

document
.getElementById("copyReferralBtn")
.onclick=()=>{

navigator.clipboard.writeText(user.referral_code);

alert("Referral code copied.");

};

document
.getElementById("shareReferralBtn")
.onclick=()=>{

const link=

window.location.origin+

"/signup?ref="+

user.referral_code;

if(navigator.share){

navigator.share({

title:"Join MyLikith",

text:"Read amazing novels with me!",

url:link

});

}else{

navigator.clipboard.writeText(link);

alert("Referral link copied.");

}

};



loadStats();

loadReviews();

loadComments();

loadPremiumBadge();

loadPremiumAchievements();

checkWriterApplication();

loadReferralStats();

async function changePassword(){

try{

const response=await fetch(

`${API}/api/profile/change-password`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:user.id,

current_password:

document.getElementById("currentPassword").value,

new_password:

document.getElementById("newPassword").value,

confirm_password:

document.getElementById("confirmPassword").value

})

}

);

const data=await response.json();

alert(data.message);

if(data.success){

document.getElementById("currentPassword").value="";

document.getElementById("newPassword").value="";

document.getElementById("confirmPassword").value="";

}

}catch(err){

console.log(err);

alert("Unable to change password.");

}

}

document
.getElementById("profilePhotoInput")
.addEventListener(
"change",
uploadProfilePhoto
);

async function uploadProfilePhoto(e){

let file=e.target.files[0];

if(!file)return;

file=await compressProfileImage(file);

// Save old image
const oldImage=profileImage.src;

// Show preview
const preview=URL.createObjectURL(file);

profileImage.src=preview;

profileImage.style.opacity=".6";

profileImage.style.pointerEvents="none";



const formData=
new FormData();

formData.append(
"photo",
file
);

formData.append(
"user_id",
user.id
);

try{

const response=
await fetch(

`${API}/api/profile/upload`,

{

method:"POST",

body:formData

}

);

const data=
await response.json();

if(!data.success){

alert(data.message);

return;

}

profileImage.src=data.url;

user.profile_image=data.url;

URL.revokeObjectURL(preview);

profileImage.style.opacity = "1";
profileImage.style.pointerEvents = "auto";

localStorage.setItem(

"user",

JSON.stringify(user)

);

window.dispatchEvent(
new Event("profileUpdated")
);

alert(
"Profile photo updated."
);

}catch(err){

console.log(err);

// Restore old image
profileImage.src = oldImage;

profileImage.style.opacity = "1";
profileImage.style.pointerEvents = "auto";

alert("Upload failed.");

}

}

async function compressProfileImage(file){

return new Promise((resolve)=>{

const img=new Image();

const reader=new FileReader();

reader.onload=e=>{

img.src=e.target.result;

};

img.onload=()=>{

const canvas=document.createElement("canvas");

const MAX=600;

let width=img.width;

let height=img.height;

if(width>height){

if(width>MAX){

height*=MAX/width;

width=MAX;

}

}else{

if(height>MAX){

width*=MAX/height;

height=MAX;

}

}

canvas.width=width;

canvas.height=height;

const ctx=canvas.getContext("2d");

ctx.drawImage(img,0,0,width,height);

canvas.toBlob(

(blob)=>{

resolve(

new File(

[blob],

file.name,

{

type:"image/jpeg"

}

)

);

},

"image/jpeg",

0.8

);

};

reader.readAsDataURL(file);

});

}

