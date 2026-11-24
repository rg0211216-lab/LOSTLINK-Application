
// =====================================
// LOSTLINK - EXPLORE ITEMS
// =====================================

// 1. GET REPORTS FROM LOCAL STORAGE
const exploreReports = JSON.parse(
    localStorage.getItem("reports") || "[]"
);

// 2. GET HTML ELEMENTS
const exploreGrid = document.getElementById("exploreGrid");
const itemCount = document.getElementById("itemCount");

const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter_btn");
const categoryButtons = document.querySelectorAll(".category_btn");

// 3. FILTER STATES
let selectedType = "all";
let selectedCategory = "all";
let searchText = "";

// 4. DISPLAY REPORTS
function displayExploreItems(reports) {

    itemCount.textContent =
        `${reports.length} ${reports.length === 1 ? "Item" : "Items"}`;

    if (reports.length === 0) {

        exploreGrid.innerHTML = `
            <div class="explore_empty">
                <h3>No Items Found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;

        return;
    }

    const sortedReports = [...reports].sort(
        (a, b) => b.id - a.id
    );

    exploreGrid.innerHTML = sortedReports.map(function(report) {

        const badgeClass =
            report.itemType === "lost"
                ? "explore_lost"
                : "explore_found";

        const itemImage = report.image
            ? `<img src="${report.image}" alt="Item image">`
            : `<span class="default_item_icon">📦</span>`;

        const reportDate = report.createdAt
            ? new Date(report.createdAt).toLocaleDateString("en-IN")
            : report.itemDate;

        return `
            <div class="explore_card">

                <div class="explore_image">
                    ${itemImage}

                    <span class="${badgeClass}">
                        ${report.itemType.toUpperCase()}
                    </span>
                </div>

                <div class="explore_info">

                    <span class="item_category">
                        ${report.category}
                    </span>

                    <h3>${report.itemName}</h3>

                    <p>📍 ${report.location}</p>

                    <p class="item_date">
                        Reported: ${reportDate}
                    </p>

                    <a href="item-details.html?id=${encodeURIComponent(report.id)}">
                        View Details →
                    </a>

                </div>

            </div>
        `;

    }).join("");
}

// 5. APPLY ALL FILTERS

// 5. APPLY ALL FILTERS
function applyExploreFilters() {

    let filteredReports = exploreReports.filter(function(report) {

        // HIDE RESOLVED ITEMS
        const isActive = report.status !== "Resolved";

        const matchesType =
            selectedType === "all" ||
            report.itemType.toLowerCase() === selectedType;

        const matchesCategory =
            selectedCategory === "all" ||
            report.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
            report.itemName.toLowerCase().includes(searchText);

        return isActive && matchesType && matchesCategory && matchesSearch;

    });

    displayExploreItems(filteredReports);
}


// 6. LOST / FOUND FILTER BUTTONS
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedType = button.dataset.filter;

        applyExploreFilters();

    });

});

// 7. CATEGORY FILTER BUTTONS
categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        categoryButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        applyExploreFilters();

    });

});

// 8. SEARCH FUNCTIONALITY
searchInput.addEventListener("input", function() {

    searchText = searchInput.value.trim().toLowerCase();

    applyExploreFilters();

});

// 9. INITIAL DISPLAY
applyExploreFilters();
