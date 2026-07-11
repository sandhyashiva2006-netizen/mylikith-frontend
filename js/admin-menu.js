const menuToggle=document.getElementById("menuToggle");
const sidebar=document.getElementById("sidebar");
const overlay=document.getElementById("sidebarOverlay");
const closeSidebar=document.getElementById("closeSidebar");

if(menuToggle&&sidebar&&overlay){

menuToggle.onclick=()=>{

sidebar.classList.add("show");
overlay.classList.add("show");

};

}

function closeMenu(){

if(sidebar) sidebar.classList.remove("show");

if(overlay) overlay.classList.remove("show");

}

if(overlay){

overlay.onclick=closeMenu;

}

if(closeSidebar){

closeSidebar.onclick=closeMenu;

}