// Mobile menu

function toggleMenu() {

    const nav = document.querySelector(".navbar nav");

    if (nav.style.display === "flex") {
        nav.style.display = "none";
    } else {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.position = "absolute";
        nav.style.top = "75px";
        nav.style.left = "0";
        nav.style.width = "100%";
        nav.style.background = "white";
        nav.style.padding = "20px";
    }
}


// Login buttons

function openLogin() {

    alert(
        "Login Portal\n\n" +
        "Admin Login\n" +
        "Student Login"
    );
}


function openAdminLogin() {

    alert("Admin Login will be connected soon.");
}


function openStudentLogin() {

    alert("Student Login will be connected soon.");
}


// Contact form

function sendMessage(event) {

    event.preventDefault();

    alert("Thank you! Your message has been received.");

    event.target.reset();
}
