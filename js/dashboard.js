
// ==================================
// LOSTLINK - DASHBOARD SYSTEM
// ==================================


// ==================================
// 1. DASHBOARD ACCESS PROTECTION
// ==================================

const dashboardStudent = JSON.parse(
    sessionStorage.getItem("loggedInStudent") || "null"
);

if (!dashboardStudent) {

    sessionStorage.setItem("loginRequired", "true");

    window.location.replace("login.html");

}


// ==================================
// 2. LOGIN SUCCESS NOTIFICATION
// ==================================

if (sessionStorage.getItem("loginSuccess") === "true") {

    sessionStorage.removeItem("loginSuccess");

    showAppNotification(
        "Welcome to LostLink!",
        "You have logged in successfully.",
        "🎉"
    );

}


// ==================================
// 3. GET STUDENT REPORTS
// ==================================

const dashboardAllReports = JSON.parse(
    localStorage.getItem("reports") || "[]"
);

const dashboardStudentReports = dashboardAllReports.filter(
    report => report.email === dashboardStudent?.email
);


// ==================================
// 4. DASHBOARD - RECENT REPORTS
// ==================================

const recentReportsTable = document.getElementById(
    "dashboardRecentReports"
);

function displayDashboardRecentReports() {

    if (!recentReportsTable) return;

    const latestReports = [...dashboardStudentReports]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);

    if (latestReports.length === 0) {

        recentReportsTable.innerHTML = `
            <tr>
                <td colspan="5">No reports submitted yet.</td>
            </tr>
        `;

        return;

    }

    recentReportsTable.innerHTML = latestReports.map(report => {

        const reportTypeClass =
            report.itemType === "lost" ? "type-lost" : "type-found";

        const statusClass =
            report.status === "Resolved"
                ? "status-resolved"
                : "status-pending";

        return `
            <tr>
                <td>${report.itemName}</td>
                <td>${report.category}</td>
                <td>
                    <span class="${reportTypeClass}">
                        ${report.itemType}
                    </span>
                </td>
                <td>${report.itemDate}</td>
                <td>
                    <span class="${statusClass}">
                        ${report.status}
                    </span>
                </td>
            </tr>
        `;

    }).join("");

}

displayDashboardRecentReports();


// =====================================
// 5. DYNAMIC DASHBOARD INFORMATION
// =====================================

if (dashboardStudent) {

    document.getElementById("welcomeStudentName").textContent =
        dashboardStudent.fullName || "Student";

    document.getElementById("profileStudentName").textContent =
        dashboardStudent.fullName || "Student";

    document.getElementById("profileStudentEmail").textContent =
        dashboardStudent.email || "";

    document.getElementById("profileAvatar").textContent =
        (dashboardStudent.fullName || "S")
            .trim()
            .charAt(0)
            .toUpperCase();

}


// =====================================
// 6. DYNAMIC DASHBOARD STATISTICS
// =====================================

const totalDashboardReports = dashboardStudentReports.length;

const totalLostItems = dashboardStudentReports.filter(
    report => report.itemType === "lost"
).length;

const totalFoundItems = dashboardStudentReports.filter(
    report => report.itemType === "found"
).length;

const totalResolvedItems = dashboardStudentReports.filter(
    report => report.status === "Resolved"
).length;


document.getElementById("totalReports").textContent =
    totalDashboardReports;

document.getElementById("lostReports").textContent =
    totalLostItems;

document.getElementById("foundReports").textContent =
    totalFoundItems;

document.getElementById("resolvedReports").textContent =
    totalResolvedItems;


// =====================================
// 7. CLAIM REQUEST SYSTEM
// =====================================


// GET CLAIM REQUESTS FROM LOCAL STORAGE

function getDashboardClaimRequests() {

    return JSON.parse(
        localStorage.getItem("claimRequests") || "[]"
    );

}


// HTML TEXT SAFETY

function escapeClaimHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// =====================================
// 8. DISPLAY CLAIM REQUEST STATISTICS
// =====================================

function updateClaimStatistics(claimRequests) {

    const pendingCount = claimRequests.filter(
        request => request.status === "Pending"
    ).length;

    const approvedCount = claimRequests.filter(
        request => request.status === "Approved"
    ).length;

    const rejectedCount = claimRequests.filter(
        request => request.status === "Rejected"
    ).length;


    document.getElementById("pendingClaimsCount").textContent =
        pendingCount;

    document.getElementById("approvedClaimsCount").textContent =
        approvedCount;

    document.getElementById("rejectedClaimsCount").textContent =
        rejectedCount;

}


// =====================================
// 9. DISPLAY RECEIVED CLAIM REQUESTS
// =====================================

const claimRequestsContainer = document.getElementById(
    "claimRequestsContainer"
);


function displayReceivedClaimRequests() {

    if (!claimRequestsContainer || !dashboardStudent) return;


    // GET ALL CLAIM REQUESTS
    const allClaimRequests = getDashboardClaimRequests();


    // FILTER REQUESTS SENT TO CURRENT STUDENT
    const receivedClaimRequests = allClaimRequests.filter(
        request =>
            request.reporterEmail === dashboardStudent.email
    );


    // UPDATE STATISTICS
    updateClaimStatistics(receivedClaimRequests);


    // EMPTY STATE
    if (receivedClaimRequests.length === 0) {

        claimRequestsContainer.innerHTML = `
            <div class="claims-empty">
                <span>📭</span>
                <h3>No Claim Requests Yet</h3>
                <p>
                    Requests for your found items will appear here.
                </p>
            </div>
        `;

        return;

    }


    // SORT NEWEST REQUEST FIRST
    receivedClaimRequests.sort(
        (a, b) => b.id - a.id
    );


    // DISPLAY CLAIM CARDS
    claimRequestsContainer.innerHTML = receivedClaimRequests.map(request => {

        const statusClass =
            request.status === "Approved"
                ? "claim-approved"
                : request.status === "Rejected"
                    ? "claim-rejected"
                    : "claim-pending";


        const statusText = escapeClaimHTML(request.status);


        return `

            <div class="claim-request-card">

                <div class="claim-request-header">

                    <h3>${escapeClaimHTML(request.itemName)}</h3>

                    <span class="claim-request-status ${statusClass}">
                        ${statusText}
                    </span>

                </div>


                <div class="claimant-info">

                    <p>
                        <strong>Claimant:</strong>
                        ${escapeClaimHTML(request.claimantName)}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${escapeClaimHTML(request.claimantEmail)}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${escapeClaimHTML(request.claimantPhone)}
                    </p>

                    <p>
                        <strong>Request Date:</strong>
                        ${escapeClaimHTML(
                            request.createdAt
                                ? new Date(request.createdAt).toLocaleDateString()
                                : "Not available"
                        )}
                    </p>

                </div>


                <div class="claim-explanation">

                    <h4>Ownership Explanation</h4>

                    <p>
                        ${escapeClaimHTML(request.explanation)}
                    </p>

                </div>


                ${
                    request.status === "Pending"

                    ? `

                        <div class="claim-actions">

                            <button
                                type="button"
                                class="approve-claim-btn"
                                data-claim-action="approve"
                                data-claim-id="${request.id}">
                                ✓ Approve
                            </button>

                            <button
                                type="button"
                                class="reject-claim-btn"
                                data-claim-action="reject"
                                data-claim-id="${request.id}">
                                ✕ Reject
                            </button>

                        </div>

                    `

                    : `

                        <div class="claim-reviewed-message">
                            This request has been ${statusText.toLowerCase()}.
                        </div>

                    `

                }

            </div>

        `;

    }).join("");

}


// RUN CLAIM REQUEST DISPLAY
displayReceivedClaimRequests();


// =====================================
// 10. APPROVE / REJECT CLAIM REQUESTS
// =====================================


// =====================================
// 10. APPROVE / REJECT CLAIM REQUESTS
// =====================================

claimRequestsContainer.addEventListener("click", function (event) {

    const actionButton = event.target.closest("[data-claim-action]");

    if (!actionButton) return;

    const action = actionButton.dataset.claimAction;
    const claimId = Number(actionButton.dataset.claimId);

    // GET LATEST CLAIM REQUESTS
    const claimRequests = getDashboardClaimRequests();

    // FIND SELECTED REQUEST
    const selectedClaim = claimRequests.find(
        request => request.id === claimId
    );

    if (!selectedClaim) {

        showAppNotification(
            "Request Not Found",
            "This claim request could not be found.",
            "⚠️"
        );

        displayReceivedClaimRequests();
        return;
    }

    // VERIFY REPORTER OWNERSHIP
    if (selectedClaim.reporterEmail !== dashboardStudent.email) {

        showAppNotification(
            "Access Denied",
            "You cannot manage this claim request.",
            "⚠️"
        );

        return;
    }

    // ONLY PENDING REQUESTS CAN BE REVIEWED
    if (selectedClaim.status !== "Pending") {

        showAppNotification(
            "Already Reviewed",
            "This claim request has already been reviewed.",
            "⚠️"
        );

        displayReceivedClaimRequests();
        return;
    }

    // SET NEW STATUS
    const newStatus =
        action === "approve" ? "Approved" : "Rejected";


    // CUSTOM CONFIRMATION
    showConfirmationNotification(

        action === "approve"
            ? "Approve Claim Request?"
            : "Reject Claim Request?",

        action === "approve"
            ? "Approving this request will mark the found item as Resolved and reject other pending claims for this item. Continue?"
            : "Are you sure you want to reject this claim request?",

        function () {

            // GET LATEST DATA AGAIN
            const latestClaims = getDashboardClaimRequests();

            const latestClaim = latestClaims.find(
                request => request.id === claimId
            );

            if (!latestClaim || latestClaim.status !== "Pending") {

                showAppNotification(
                    "Request Already Updated",
                    "This claim request has already been reviewed.",
                    "⚠️"
                );

                displayReceivedClaimRequests();
                return;
            }

            // VERIFY OWNERSHIP AGAIN
            if (latestClaim.reporterEmail !== dashboardStudent.email) {
                return;
            }

            // GET LATEST REPORTS
            const latestReports = JSON.parse(
                localStorage.getItem("reports") || "[]"
            );

            // FIND RELATED ITEM
            const relatedItem = latestReports.find(
                report => report.id === latestClaim.itemId
            );

            // CHECK ITEM BEFORE APPROVAL
            if (action === "approve") {

                if (!relatedItem || relatedItem.itemType !== "found") {

                    showAppNotification(
                        "Item Not Found",
                        "The related found item could not be found.",
                        "⚠️"
                    );

                    return;
                }

                if (relatedItem.status === "Resolved") {

                    showAppNotification(
                        "Item Already Resolved",
                        "This item has already been marked as resolved.",
                        "⚠️"
                    );

                    return;
                }

                // MARK ITEM AS RESOLVED
                relatedItem.status = "Resolved";

                relatedItem.resolvedAt = new Date().toISOString();

            }

            // UPDATE SELECTED CLAIM
            latestClaim.status = newStatus;

            latestClaim.reviewedAt = new Date().toISOString();


            // REJECT OTHER PENDING CLAIMS FOR SAME ITEM
            if (action === "approve") {

                latestClaims.forEach(request => {

                    if (
                        request.itemId === latestClaim.itemId &&
                        request.id !== latestClaim.id &&
                        request.status === "Pending"
                    ) {

                        request.status = "Rejected";

                        request.reviewedAt = new Date().toISOString();

                        request.rejectionReason =
                            "Another claim request for this item was approved.";

                    }

                });

            }


            // SAVE BOTH DATASETS
            const previousReports = localStorage.getItem("reports");
            const previousClaims = localStorage.getItem("claimRequests");

            try {

                if (action === "approve") {

                    localStorage.setItem(
                        "reports",
                        JSON.stringify(latestReports)
                    );

                }

                localStorage.setItem(
                    "claimRequests",
                    JSON.stringify(latestClaims)
                );


                // REFRESH DASHBOARD
                displayReceivedClaimRequests();


                // SUCCESS NOTIFICATION
                showAppNotification(
                    action === "approve"
                        ? "Item Successfully Resolved!"
                        : "Claim Rejected!",

                    action === "approve"
                        ? "The item is now marked as Resolved. Other pending claims for this item have also been rejected."
                        : "The claim request has been rejected successfully.",

                    action === "approve" ? "✅" : "❌"
                );

            } catch (error) {

                // RESTORE PREVIOUS DATA IF SAVING FAILS
                try {

                    if (previousReports === null) {
                        localStorage.removeItem("reports");
                    } else {
                        localStorage.setItem("reports", previousReports);
                    }

                    if (previousClaims === null) {
                        localStorage.removeItem("claimRequests");
                    } else {
                        localStorage.setItem("claimRequests", previousClaims);
                    }

                } catch (restoreError) {
                    console.error("Storage restoration failed:", restoreError);
                }

                showAppNotification(
                    "Update Failed",
                    "Unable to save the changes. Please try again.",
                    "⚠️"
                );

            }

        },

        action === "approve" ? "Approve" : "Reject"

    );

});

