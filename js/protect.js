const protectedUser =
JSON.parse(
localStorage.getItem("user")
);

if(!protectedUser){

window.location =
"login.html";

}