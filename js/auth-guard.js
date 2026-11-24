// =====================================
// LOSTLINK - AUTHENTICATION GUARD
// =====================================

const loggedInStudent = sessionStorage.getItem("loggedInStudent");

if (!loggedInStudent) {

    sessionStorage.setItem("loginRequired", "true");

    window.location.replace("login.html");

}

