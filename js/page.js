const API = "https://mylikith-backend.onrender.com";

const params = new URLSearchParams(location.search);

const slug = params.get("slug") || "about";

loadPage();

async function loadPage(){

    try{

        const response = await fetch(
            `${API}/api/pages/${slug}`
        );

        const data = await response.json();

        if(!response.ok || !data.title){

            document.title = "Page Not Found | MyLikith";

            document.getElementById("pageTitle").textContent =
            "Page Not Found";

            document.getElementById("pageContent").innerHTML =
            "The page you are looking for does not exist.";

            return;

        }

        document.title = `${data.title} | MyLikith`;

        document.getElementById("pageTitle").textContent =
        data.title;

        document.getElementById("pageContent").innerHTML =
        data.content.replace(/\n/g,"<br>");

    }catch(err){

        console.log(err);

        document.getElementById("pageTitle").textContent =
        "Unable to load page";

        document.getElementById("pageContent").textContent =
        "Please try again later.";

    }

}