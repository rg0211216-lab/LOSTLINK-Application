
/* =========================================
   LOSTLINK - MY CLAIMS PAGE
========================================= */

// 1. GET LOGGED-IN STUDENT
const currentStudent = JSON.parse(
    sessionStorage.getItem("loggedInStudent")
);

// 2. GET CLAIM REQUESTS FROM LOCAL STORAGE
function getMyClaims() {

    const allClaims = JSON.parse(
        localStorage.getItem("claimRequests")
    ) || [];

    if (!currentStudent) {
        return [];
    }

    // Show only claims submitted by current student
    return allClaims.filter(function(claim) {
        return claim.claimantEmail === currentStudent.email;
    });
}


// 3. UPDATE CLAIM STATISTICS
function updateMyClaimStats(claims) {

    const total = claims.length;

    const pending = claims.filter(function(claim) {
        return claim.status === "Pending";
    }).length;

    const approved = claims.filter(function(claim) {
        return claim.status === "Approved";
    }).length;

    const rejected = claims.filter(function(claim) {
        return claim.status === "Rejected";
    }).length;

    document.getElementById("myTotalClaims").textContent = total;
    document.getElementById("myPendingClaims").textContent = pending;
    document.getElementById("myApprovedClaims").textContent = approved;
    document.getElementById("myRejectedClaims").textContent = rejected;
}


// 4. FORMAT DATE
function formatClaimDate(date) {

    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// 5. DISPLAY CLAIM CARDS
function displayMyClaims() {

    const claims = getMyClaims();

    const claimsGrid = document.getElementById("myClaimsGrid");

    updateMyClaimStats(claims);

    // Show empty state when there are no claims
    if (claims.length === 0) {

        claimsGrid.innerHTML = `
            <div class="my-claims-empty">
                <span>📭</span>
                <h3>No Claim Requests Yet</h3>
                <p>Your submitted claim requests will appear here.</p>

                <a href="explore.html">
                    Explore Found Items →
                </a>
            </div>
        `;

        return;
    }

    // Display latest claims first
    const sortedClaims = [...claims].sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    claimsGrid.innerHTML = sortedClaims.map(function(claim) {

        const status = claim.status || "Pending";

        let statusClass = "pending";

        if (status === "Approved") {
            statusClass = "approved";
        } else if (status === "Rejected") {
            statusClass = "rejected";
        }

        return `
            <div class="my-claim-card">

                <div class="my-claim-card-top">
                    <span class="my-claim-status ${statusClass}">
                        ${status}
                    </span>

                    <span class="my-claim-date">
                        ${formatClaimDate(claim.createdAt)}
                    </span>
                </div>

                <div class="my-claim-card-content">

                    <p class="my-claim-label">ITEM CLAIMED</p>

                    <h3>${escapeClaimText(claim.itemName)}</h3>

                    <div class="my-claim-info">
                        <p>
                            <strong>Reported by:</strong>
                            ${escapeClaimText(claim.reporterName)}
                        </p>

                        <p>
                            <strong>Your Contact:</strong>
                            ${escapeClaimText(claim.claimantPhone)}
                        </p>
                    </div>

                    <div class="my-claim-explanation">
                        <h4>Your Explanation</h4>
                        <p>${escapeClaimText(claim.explanation)}</p>
                    </div>

                    <div class="my-claim-footer">
                        <span>Claim ID: ${escapeClaimText(claim.id)}</span>
                        <span>${status}</span>
                    </div>

                </div>

            </div>
        `;

    }).join("");
}


// 6. ESCAPE USER INPUT BEFORE DISPLAYING
function escapeClaimText(value) {

    return String(value ?? "").replace(/[&<>"']/g, function(character) {

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


// 7. LOAD CLAIMS WHEN PAGE OPENS
displayMyClaims();
