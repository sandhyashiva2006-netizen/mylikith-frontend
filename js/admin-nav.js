document.addEventListener("DOMContentLoaded", () => {

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const closeSidebar =
        document.getElementById("closeSidebar");


    if (
        !menuToggle ||
        !sidebar ||
        !overlay
    ) {
        console.warn(
            "Admin navigation elements not found."
        );

        return;
    }


    function openMenu() {

        sidebar.classList.add("show");

        overlay.classList.add("show");

        document.body.classList.add(
            "admin-menu-open"
        );
    }


    function closeMenu() {

        sidebar.classList.remove("show");

        overlay.classList.remove("show");

        document.body.classList.remove(
            "admin-menu-open"
        );
    }


    menuToggle.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            if (
                sidebar.classList.contains("show")
            ) {
                closeMenu();
            } else {
                openMenu();
            }

        }
    );


    if (closeSidebar) {

        closeSidebar.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                closeMenu();

            }
        );

    }


    overlay.addEventListener(
        "click",
        () => {
            closeMenu();
        }
    );


    /*
       Close menu when a navigation link
       is selected on mobile.
    */

    sidebar
        .querySelectorAll("nav a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 900
                    ) {
                        closeMenu();
                    }

                }
            );

        });


    /*
       Close menu when switching back
       to desktop width.
    */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {
                closeMenu();
            }

        }
    );


    /*
       Prevent background scrolling while
       the mobile sidebar is open.
    */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                sidebar.classList.contains("show")
            ) {
                closeMenu();
            }

        }
    );

});