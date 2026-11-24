

// ===============================
// REGISTRATION FUNCTIONALITY
// ===============================

// 1. Get the registration form
const registerForm = document.getElementById("registerForm");

// 2. Check whether registration form exists
if (registerForm) {

    // 3. Listen for form submission
    registerForm.addEventListener("submit", function (event) {

        // Prevent page reload
        event.preventDefault();

        // 4. Collect form values
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("studentEmail").value.trim().toLowerCase();
        const college = document.getElementById("college").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // 5. Check password matching
        if (password !== confirmPassword) {
            showAppNotification(
                "Password Mismatch",
                "Password and Confirm Password do not match.",
                "⚠️"
            ); return;
        }

        // 6. Get existing registered students
        const students = JSON.parse(localStorage.getItem("students")) || [];

        // 7. Check whether email already exists
        const existingStudent = students.find(function (student) {
            return student.email === email;
        });

        if (existingStudent) {
            showAppNotification(
                "Account Already Exists",
                "This email is already registered. Please login.",
                "⚠️"
            );
            return;
        }

        // 8. Create student object
        const newStudent = {
            fullName: fullName,
            email: email,
            college: college,
            studentId: studentId,
            password: password
        };

        // 9. Save student data
        students.push(newStudent);

        localStorage.setItem("students", JSON.stringify(students));

        // 10. Registration success
        registerForm.reset();

        showAppNotification(
            "Account Created!",
            "Your LostLink account has been created successfully. You can now login.",
            "🎉"
        );

    });

}

// ===============================
// LOGIN FORM SELECTION
// ===============================

// ========================================
// LOGIN FUNCTIONALITY
// ========================================


// ==================================
// LOGIN PAGE NOTIFICATIONS
// ==================================

// Logout notification
if (sessionStorage.getItem("logoutSuccess") === "true") {

    sessionStorage.removeItem("logoutSuccess");

    showAppNotification(
        "Logged Out Successfully",
        "You have been safely logged out of your LostLink account.",
        "👋"
    );

}

// Login required notification
if (sessionStorage.getItem("loginRequired") === "true") {

    sessionStorage.removeItem("loginRequired");

    showLoginRequired();

}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        // Stop default form submission
        event.preventDefault();

        // Get email and password from input fields
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        // Get registered students from localStorage
        const students = JSON.parse(localStorage.getItem("students")) || [];

        // Find student with  matching email
        const loggedInStudent = students.find(function (student) {
            return student.email === email;
        });

        // Check whether email exists
        if (!loggedInStudent) {
            showAppNotification(
                "Account Not Found",
                "No account exists with this email. Please register first.",
                "⚠️"
            );

            return;
        }

        // Check whether password is correct
        if (loggedInStudent.password !== password) {
            showAppNotification(
                "Incorrect Password",
                "The password you entered is incorrect. Please try again.",
                "⚠️"
            );

            return;
        }

        // Save logged-in student information
        sessionStorage.setItem("loggedInStudent", JSON.stringify({
            fullName: loggedInStudent.fullName,
            email: loggedInStudent.email,
            college: loggedInStudent.college,
            studentId: loggedInStudent.studentId
        }));

        // Show success message
        sessionStorage.setItem("loginSuccess", "true");

        window.location.href = "dashboard.html";

        // Redirect to Dashboard


    });
}


