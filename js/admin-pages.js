const API = "https://mylikith-backend.onrender.com/api/admin";

const pageSelect = document.getElementById("pageSelect");
const pageTitle = document.getElementById("pageTitle");
const pageContent = document.getElementById("pageContent");

loadPage();

pageSelect.onchange = loadPage;

async function loadPage(){

    const res = await fetch(

        `${API}/pages/${pageSelect.value}`

    );

    const page = await res.json();

    pageTitle.value = page.title || "";
    pageContent.value = page.content || "";

}

document.getElementById("savePageBtn").onclick = async()=>{

    const res = await fetch(

        `${API}/pages/${pageSelect.value}`,

        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title:pageTitle.value,

                content:pageContent.value

            })

        }

    );

    const data = await res.json();

    if(data.success){

        alert("Page updated successfully.");

    }else{

        alert("Unable to save page.");

    }

};