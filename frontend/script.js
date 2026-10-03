/* =========================================
   AGSTYA - MAIN JAVASCRIPT
========================================= */


/*
    Display a message when the page
    has successfully loaded.
*/

document.addEventListener("DOMContentLoaded", function () {

    console.log("Agstya - Kisano Ki Unnati loaded successfully.");

});


/*
    Simple smooth navigation.

    This allows navigation links such as:

    #home
    #about
    #services

    to scroll smoothly to their sections.
*/

const navigationLinks = document.querySelectorAll(
    'a[href^="#"]'
);

navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        const targetSection =
            document.querySelector(targetId);

        if (targetSection) {

            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});