
// ========================================
// LOSTLINK CUSTOM NOTIFICATION SYSTEM
// ========================================

function showLoginRequired() {

    // Remove an existing notification if present
    const oldModal = document.querySelector(".notification-overlay");

    if (oldModal) {
        oldModal.remove();
    }

    // Create notification overlay
    const overlay = document.createElement("div");

    overlay.className = "notification-overlay";

    // Add modal HTML
    overlay.innerHTML = `
        <div class="notification-modal">

            <button class="notification-close" aria-label="Close">
                &times;
            </button>

            <div class="notification-icon">
                🔒
            </div>

            <h2>Login Required</h2>

            <p>
                You need to login to access this feature.
                Please login to continue using LostLink.
            </p>

            <div class="notification-actions">

                <a href="login.html" class="notification-primary">
                    Login Now →
                </a>

                <button class="notification-secondary">
                    Create an Account
                </button>

            </div>

        </div>
    `;

    // Add notification to page
    document.body.appendChild(overlay);

    // Show notification after adding it
    requestAnimationFrame(function() {
        overlay.classList.add("show");
    });

    // Close button
    const closeButton = overlay.querySelector(".notification-close");

    closeButton.addEventListener("click", function() {
        overlay.remove();
    });

    // Create account button
    const registerButton = overlay.querySelector(".notification-secondary");

    registerButton.addEventListener("click", function() {
        window.location.href = "register.html";
    });

    // Close when clicking outside the modal
    overlay.addEventListener("click", function(event) {

        if (event.target === overlay) {
            overlay.remove();
        }

    });

}
 
// login , logout , register, other notifications ke liye 


function showAppNotification(title, message, icon = "🔔", onOkay = null) {

    // Remove existing notification
    const oldModal = document.querySelector(".notification-overlay");

    if (oldModal) {
        oldModal.remove();
    }

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "notification-overlay";

    // Create modal
    overlay.innerHTML = `
        <div class="notification-modal">

            <button class="notification-close" aria-label="Close">
                &times;
            </button>

            <div class="notification-icon">
                ${icon}
            </div>

            <h2>${title}</h2>

            <p>${message}</p>

            <div class="notification-actions">
                <button class="notification-primary notification-ok">
                    Okay
                </button>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(function() {
        overlay.classList.add("show");
    });

    // Close notification
    overlay.querySelector(".notification-close")
        .addEventListener("click", function() {
            overlay.remove();
        });

    // Okay button
    overlay.querySelector(".notification-ok")
        .addEventListener("click", function() {
            overlay.remove();

            if (typeof onOkay === "function") {
                onOkay();
            }
        });

    // Close on outside click
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            overlay.remove();
        }
    });
}


// ========================================
// LOSTLINK CUSTOM CONFIRMATION NOTIFICATION
// ========================================

function showConfirmationNotification(
    title,
    message,
    onConfirm,
    confirmText = "Confirm"
) {

    // Remove existing notification
    const oldModal = document.querySelector(".notification-overlay");

    if (oldModal) {
        oldModal.remove();
    }

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "notification-overlay";

    // Create modal structure
    overlay.innerHTML = `
        <div class="notification-modal">

            <button class="notification-close" aria-label="Close">
                &times;
            </button>

            <div class="notification-icon">
                ⚠️
            </div>

            <h2></h2>

            <p></p>

            <div class="notification-actions">

                <button class="notification-secondary cancel-confirmation">
                    Cancel
                </button>

                <button class="notification-primary confirm-action">
                    Confirm
                </button>

            </div>

        </div>
    `;

    // Set safe text content
    overlay.querySelector("h2").textContent = title;
    overlay.querySelector("p").textContent = message;

    overlay.querySelector(".confirm-action").textContent = confirmText;

    // Add modal to page
    document.body.appendChild(overlay);

    requestAnimationFrame(function() {
        overlay.classList.add("show");
    });

    // Close modal function
    function closeModal() {
        overlay.remove();
    }

    // Cancel button
    overlay.querySelector(".cancel-confirmation")
        .addEventListener("click", closeModal);

    // Close button
    overlay.querySelector(".notification-close")
        .addEventListener("click", closeModal);

    // Confirm button
    overlay.querySelector(".confirm-action")
        .addEventListener("click", function() {

            closeModal();

            if (typeof onConfirm === "function") {
                onConfirm();
            }

        });

    // Close on outside click
    overlay.addEventListener("click", function(event) {

        if (event.target === overlay) {
            closeModal();
        }

    });

}


