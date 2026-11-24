
/* =========================================
   LOSTLINK - CONTACT FORM
========================================= */

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // 1. GET FORM VALUES
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    // 2. BASIC VALIDATION
    if (!name || !email || !subject || !message) {

        showAppNotification(
            "Missing Information",
            "Please fill in all the fields.",
            "⚠️"
        );

        return;
    }

    if (message.length < 10) {

        showAppNotification(
            "Message Too Short",
            "Please write at least 10 characters in your message.",
            "⚠️"
        );

        return;
    }

    // 3. CREATE MESSAGE OBJECT
    const contactData = {
        id: Date.now(),
        name: name,
        email: email,
        subject: subject,
        message: message,
        submittedAt: new Date().toISOString()
    };

    // 4. GET EXISTING MESSAGES
    let contactMessages = JSON.parse(
        localStorage.getItem("contactMessages")
    ) || [];

    // 5. ADD NEW MESSAGE
    contactMessages.push(contactData);

    // 6. SAVE TO LOCAL STORAGE
    localStorage.setItem(
        "contactMessages",
        JSON.stringify(contactMessages)
    );

    // 7. RESET FORM
    contactForm.reset();

    // 8. SUCCESS MESSAGE
    showAppNotification(
        "Message Submitted!",
        "Thank you for contacting LostLink. Your message has been saved successfully.",
        "✅"
    );

});
