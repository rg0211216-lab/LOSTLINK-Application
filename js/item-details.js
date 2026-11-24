
// =========================================
// LOSTLINK - ITEM DETAILS SYSTEM
// =========================================


// 1. GET ITEM ID FROM URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = Number(urlParams.get("id"));


// 2. GET ALL REPORTS FROM LOCAL STORAGE
const allReports = JSON.parse(localStorage.getItem("reports") || "[]");


// 3. FIND THE SELECTED ITEM
const selectedReport = allReports.find(report => report.id === itemId);


if (!selectedReport) {

    document.querySelector(".details_container").innerHTML = `
        <div class="explore_empty">
            <h3>Item Not Found</h3>
            <p>This item may have been deleted or does not exist.</p>
            <a href="explore.html">Back to Explore</a>
        </div>
    `;

}


// =========================================
// 4. DISPLAY ITEM INFORMATION
// =========================================

if (selectedReport) {

    // ITEM IMAGE
    const detailsMainImage = document.getElementById("detailsMainImage");

    if (selectedReport.image) {

        detailsMainImage.innerHTML = `
            <span class="details_status ${selectedReport.itemType}_status" id="detailsStatus">
                ${selectedReport.itemType.toUpperCase()} ITEM
            </span>

            <img src="${selectedReport.image}"
                 alt="${selectedReport.itemName}"
                 style="width:100%; height:100%; object-fit:cover; border-radius:15px;">
        `;

    } else {

        document.getElementById("detailsEmoji").textContent = "📦";

    }


    // ITEM INFORMATION
    document.getElementById("detailsCategory").textContent =
        selectedReport.category.toUpperCase();

    document.getElementById("detailsItemName").textContent =
        selectedReport.itemName;

    document.getElementById("detailsDescription").textContent =
        selectedReport.description;

    document.getElementById("detailsLocation").textContent =
        selectedReport.location;

    document.getElementById("detailsDate").textContent =
        selectedReport.itemDate;

    document.getElementById("detailsCategoryInfo").textContent =
        selectedReport.category;

    document.getElementById("detailsReportId").textContent =
        "LL-" + selectedReport.id;


    // =========================================
    // 5. STUDENT CONTACT INFORMATION
    // =========================================

    document.getElementById("detailsStudentName").textContent =
        selectedReport.studentName;

    document.getElementById("detailsAvatar").textContent =
        (selectedReport.studentName || "S").trim().charAt(0).toUpperCase();

    document.getElementById("detailsEmail").textContent =
        "✉️ " + selectedReport.email;

    document.getElementById("detailsPhone").textContent =
        "📞 " + (selectedReport.phone || "Not provided");


    // CONTACT BUTTON
    const contactButton = document.getElementById("contactButton");

    if (selectedReport.email) {

        contactButton.href =
            "mailto:" + encodeURIComponent(selectedReport.email);

    } else {

        contactButton.style.display = "none";

    }


    // =========================================
    // 6. CLAIM ITEM SYSTEM
    // =========================================

    const claimSection = document.getElementById("claimSection");
    const claimItemButton = document.getElementById("claimItemButton");

    const claimModal = document.getElementById("claimModal");
    const claimForm = document.getElementById("claimForm");

    const closeClaimModal = document.getElementById("closeClaimModal");
    const cancelClaim = document.getElementById("cancelClaim");


    // SHOW CLAIM SECTION ONLY FOR FOUND ITEMS
    if (selectedReport.itemType === "found") {

        claimSection.style.display = "block";

    }


    // GET LOGGED-IN STUDENT
    function getLoggedInStudent() {

        return JSON.parse(
            sessionStorage.getItem("loggedInStudent") || "null"
        );

    }


    // GET CLAIM REQUESTS
    function getClaimRequests() {

        return JSON.parse(
            localStorage.getItem("claimRequests") || "[]"
        );

    }


    // CHECK EXISTING PENDING CLAIM
    function hasPendingClaim(email) {

        const claimRequests = getClaimRequests();

        return claimRequests.some(request =>
            request.itemId === selectedReport.id &&
            request.claimantEmail === email &&
            request.status === "Pending"
        );

    }


    // OPEN CLAIM MODAL
    claimItemButton.addEventListener("click", function () {

        const currentStudent = getLoggedInStudent();


        // CHECK LOGIN
        if (!currentStudent) {

            showLoginRequired();
            return;

        }


        // PREVENT CLAIMING OWN ITEM
        if (
            currentStudent.email.toLowerCase() ===
            selectedReport.email.toLowerCase()
        ) {

            showAppNotification(
                "Cannot Claim Your Own Item",
                "You cannot submit a claim request for an item reported by you.",
                "⚠️"
            );

            return;

        }


        // PREVENT DUPLICATE PENDING CLAIM
        if (hasPendingClaim(currentStudent.email)) {

            showAppNotification(
                "Claim Already Submitted",
                "You already have a pending claim request for this item.",
                "⏳"
            );

            return;

        }


        // AUTO-FILL STUDENT INFORMATION
        document.getElementById("claimStudentName").value =
            currentStudent.fullName || "";

        document.getElementById("claimStudentEmail").value =
            currentStudent.email || "";


        // OPEN MODAL
        claimModal.classList.add("active");

    });


    // CLOSE CLAIM MODAL FUNCTION
    function closeClaimRequestModal() {

        claimModal.classList.remove("active");

    }


    closeClaimModal.addEventListener("click", closeClaimRequestModal);

    cancelClaim.addEventListener("click", closeClaimRequestModal);


    // CLOSE MODAL WHEN CLICKING OUTSIDE
    claimModal.addEventListener("click", function (event) {

        if (event.target === claimModal) {

            closeClaimRequestModal();

        }

    });


    // =========================================
    // 7. SUBMIT CLAIM REQUEST
    // =========================================

    claimForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const currentStudent = getLoggedInStudent();

        if (!currentStudent) {

            closeClaimRequestModal();
            showLoginRequired();
            return;

        }


        // GET FORM VALUES
        const phone = document.getElementById("claimStudentPhone").value.trim();

        const explanation = document.getElementById("claimExplanation").value.trim();


        // PHONE VALIDATION
        if (!/^[0-9]{10}$/.test(phone)) {

            showAppNotification(
                "Invalid Phone Number",
                "Please enter a valid 10-digit phone number.",
                "⚠️"
            );

            return;

        }


        // EXPLANATION VALIDATION
        if (explanation.length < 20) {

            showAppNotification(
                "More Details Required",
                "Please explain why this item belongs to you in at least 20 characters.",
                "⚠️"
            );

            return;

        }


        // PREVENT CLAIMING OWN ITEM
        if (
            currentStudent.email.toLowerCase() ===
            selectedReport.email.toLowerCase()
        ) {

            showAppNotification(
                "Invalid Claim",
                "You cannot claim your own reported item.",
                "⚠️"
            );

            closeClaimRequestModal();
            return;

        }


        // CHECK DUPLICATE PENDING CLAIM AGAIN
        if (hasPendingClaim(currentStudent.email)) {

            showAppNotification(
                "Claim Already Submitted",
                "You already have a pending claim request for this item.",
                "⏳"
            );

            closeClaimRequestModal();
            return;

        }


        // CREATE CLAIM REQUEST
        const claimData = {

            id: Date.now(),

            itemId: selectedReport.id,
            itemName: selectedReport.itemName,

            reporterName: selectedReport.studentName,
            reporterEmail: selectedReport.email,

            claimantName: currentStudent.fullName,
            claimantEmail: currentStudent.email,
            claimantPhone: phone,

            explanation: explanation,

            status: "Pending",

            createdAt: new Date().toISOString()

        };


        // SAVE CLAIM REQUEST
        try {

            const claimRequests = getClaimRequests();

            claimRequests.push(claimData);

            localStorage.setItem(
                "claimRequests",
                JSON.stringify(claimRequests)
            );


            // RESET AND CLOSE FORM
            claimForm.reset();
            closeClaimRequestModal();


            // SUCCESS NOTIFICATION
            showAppNotification(
                "Claim Submitted Successfully!",
                "Your claim request has been sent to the item reporter. You can check its status later.",
                "🎉"
            );

        } catch (error) {

            showAppNotification(
                "Unable to Submit Claim",
                "Your claim could not be saved. Browser storage may be full. Please try again.",
                "⚠️"
            );

        }

    });

}
