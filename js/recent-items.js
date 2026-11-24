
/* =====================================
   LOSTLINK - HOMEPAGE RECENT ITEMS
===================================== */

// 1. GET REPORTS FROM LOCAL STORAGE
const allRecentReports = JSON.parse(
    localStorage.getItem("reports") || "[]"
);

// 2. GET HOMEPAGE ITEMS CONTAINER
const recentItemsContainer = document.getElementById(
    "recentItemsContainer"
);

// 3. DISPLAY RECENT REPORTS
function displayRecentItems() {

    if (!recentItemsContainer) return;

    // Sort reports: Latest first
    const recentReports = [...allRecentReports]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);

    // Check if reports are available
    if (recentReports.length === 0) {

        recentItemsContainer.innerHTML = `
            <div class="recent-empty">
                <h3>No Recent Items</h3>
                <p>No lost or found items have been reported yet.</p>
                <a href="report.html" class="primary_btn">
                    Report an Item →
                </a>
            </div>
        `;

        return;
    }

    // Generate item cards
    recentItemsContainer.innerHTML = recentReports.map(function(report) {

        const badgeClass = report.itemType === "lost"
            ? "lost_badge"
            : "found_badge";

        const itemImage = report.image
            ? `<img src="${report.image}" alt="${report.itemName}">`
            : `<span>📦</span>`;

        return `
            <div class="item_card">

                <div class="item_image">
                    ${itemImage}
                </div>

                <div class="item_info">

                    <span class="${badgeClass}">
                        ${report.itemType.toUpperCase()}
                    </span>

                    <h3>${report.itemName}</h3>

                    <p>📍 ${report.location}</p>

                    <a href="item-details.html?id=${encodeURIComponent(report.id)}">
                        View Details →
                    </a>

                </div>

            </div>
        `;

    }).join("");
}

// 4. RUN FUNCTION
displayRecentItems();
