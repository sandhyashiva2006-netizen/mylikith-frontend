document.querySelectorAll(".language-card").forEach(card=>{

if(card.classList.contains("disabled")) return;

card.addEventListener("click",()=>{

const language=card.dataset.language;

window.location.href=

`explore.html?language=${encodeURIComponent(language)}`;

});

});