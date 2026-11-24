
/* =========================================
   LOSTLINK DYNAMIC AUTH NAVBAR SYSTEM
========================================= */


// =========================================
// 1. UPDATE LOGIN / LOGOUT BUTTON
// =========================================

function updateAuthNavbar() {

    // Check login session
    const loggedInStudent =
        sessionStorage.getItem("loggedInStudent");

    // Find navbar button
    const authNav = document.getElementById("authNav");

    // Stop if navbar button is not available
    if (!authNav) {
        return;
    }

    // If student is logged in
    if (loggedInStudent) {

        authNav.innerHTML = `
            <a href="#"
               class="logout-btn logout-link"
               data-auth-action="logout">
                Logout
            </a>
        `;

    }

    // If student is not logged in
    else {
        authNav.innerHTML = `
        <a href="login.html" class="logout-btn">
            Login
        </a>
    `;
    }

}


// =========================================
// 2. RUN NAVBAR UPDATE
// =========================================

updateAuthNavbar();


// =========================================
// 3. GLOBAL LOGOUT FUNCTIONALITY
// =========================================

document.addEventListener("click", function (event) {

    // Find Logout button
    const logoutButton = event.target.closest(
        '[data-auth-action="logout"]'
    );

    // If Logout was not clicked, stop
    if (!logoutButton) {
        return;
    }

    event.preventDefault();


    // =====================================
    // REMOVE LOGIN SESSION
    // =====================================

    sessionStorage.removeItem("loggedInStudent");


    // =====================================
    // GET CURRENT PAGE NAME
    // =====================================

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    // Pages that require login
    const protectedPages = [
        "dashboard.html",
        "report.html",
        "my-reports.html"
    ];


    // =====================================
    // LOGOUT FROM PROTECTED PAGES
    // =====================================

    if (protectedPages.includes(currentPage)) {

        // Save logout notification flag
        sessionStorage.setItem("logoutSuccess", "true");

        // Redirect to login page
        window.location.replace("login.html");

        return;

    }


    // =====================================
    // LOGOUT FROM PUBLIC PAGES
    // =====================================

    // Update navbar immediately
    updateAuthNavbar();

    // Show logout notification
    if (typeof showAppNotification === "function") {

        showAppNotification(
            "Logged Out Successfully",
            "You have been safely logged out of your LostLink account.",
            "👋"
        );

        // Automatically redirect after 1.5 seconds
        setTimeout(function () {
            window.location.replace("login.html");
        }, 1500);

    } else {
        window.location.replace("login.html");
    }


});
