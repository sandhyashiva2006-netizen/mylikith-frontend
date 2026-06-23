const readerUser =
JSON.parse(
localStorage.getItem("user")
);

if(readerUser){

document.getElementById(
"readerName"
).textContent =
readerUser.name;

}