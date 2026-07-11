document.body.insertAdjacentHTML(
"afterbegin",
`
<button
id="menuToggle"
class="menu-toggle">

☰

</button>

<div
id="sidebarOverlay"
class="sidebar-overlay">

</div>
`
);

const sidebar=document.querySelector(".sidebar");

if(sidebar){

sidebar.id="sidebar";

if(!document.getElementById("closeSidebar")){

sidebar.insertAdjacentHTML(
"afterbegin",
`
<div class="sidebar-header">

<button
id="closeSidebar"
class="close-sidebar">

✕

</button>

</div>
`
);

}

}

const menuToggle=document.getElementById("menuToggle");
const overlay=document.getElementById("sidebarOverlay");
const closeSidebar=document.getElementById("closeSidebar");

if(menuToggle&&sidebar&&overlay){

menuToggle.onclick=()=>{

sidebar.classList.add("show");
overlay.classList.add("show");

};

}

function closeMenu(){

if(sidebar){

sidebar.classList.remove("show");

}

if(overlay){

overlay.classList.remove("show");

}

}

if(overlay){

overlay.onclick=closeMenu;

}

if(closeSidebar){

closeSidebar.onclick=closeMenu;

}