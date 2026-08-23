document.addEventListener(
    "DOMContentLoaded",
    () => {

        bindAudioAdminTabs();

    }
);


function bindAudioAdminTabs(){

    const tabs =
        document.querySelectorAll(
            ".audio-admin-tab"
        );

    const sections =
        document.querySelectorAll(
            ".audio-admin-section"
        );


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.section;


                    tabs.forEach(
                        item => {

                            item.classList.toggle(
                                "active",
                                item === tab
                            );

                        }
                    );


                    sections.forEach(
                        section => {

                            section.classList.toggle(
                                "active",
                                section.id === target
                            );

                        }
                    );

                }
            );

        }
    );

}