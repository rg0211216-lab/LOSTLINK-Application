
// =====================================
// LOSTLINK - MY REPORTS FUNCTIONALITY
// =====================================

// 1. GET LOGGED-IN STUDENT
const currentStudent = JSON.parse(
    sessionStorage.getItem("loggedInStudent")
);

// 2. GET REPORTS FROM LOCAL STORAGE
let allReports = JSON.parse(
    localStorage.getItem("reports")
) || [];

// 3. FILTER CURRENT STUDENT'S REPORTS
let studentReports = allReports.filter(function (report) {
    return report.email === currentStudent.email;
});

// 4. GET HTML ELEMENTS
const myReportsGrid = document.getElementById("myReportsGrid");

const totalReports = document.getElementById("totalReports");
const lostReports = document.getElementById("lostReports");
const foundReports = document.getElementById("foundReports");
const resolvedReports = document.getElementById("resolvedReports");

// 5. UPDATE STATISTICS
function updateReportStatistics() {

    totalReports.textContent = studentReports.length;

    lostReports.textContent = studentReports.filter(
        report => report.itemType === "lost"
    ).length;

    foundReports.textContent = studentReports.filter(
        report => report.itemType === "found"
    ).length;

    resolvedReports.textContent = studentReports.filter(
        report => report.status === "Resolved"
    ).length;
}

// 6. DISPLAY REPORTS
function displayMyReports() {

    if (studentReports.length === 0) {

        myReportsGrid.innerHTML = `
            <div class="reports-loading">
                <h3>No Reports Found</h3>
                <p>You have not submitted any reports yet.</p>
                <a href="report.html" class="primary-btn">
                    Report an Item
                </a>
            </div>
        `;

        return;
    }

    // Show latest reports first
    studentReports.sort(function (a, b) {
        return b.id - a.id;
    });

    myReportsGrid.innerHTML = studentReports.map(function (report) {

        return `
            <div class="my-report-card">

                <div class="my-report-image">
                    ${report.image
                ? `<img src="${report.image}" alt="Item image">`
                : `<div class="no-report-image">📦</div>`
            }
                </div>

                <div class="my-report-content">

                    <span class="report-type ${report.itemType}">
                        ${report.itemType}
                    </span>

                    <h3>${report.itemName}</h3>

                    <p>${report.category}</p>

                    <p>📍 ${report.location}</p>

                    <p>📅 ${report.itemDate}</p>

                    <span class="report-status">
                        ${report.status}
                    </span>

                    
<div class="report-card-actions">

    <button
        type="button"
        class="view-report-btn"
        data-view-report="${report.id}">
        👁 View Details
    </button>

    <button
        type="button"
        class="edit-report-btn"
        data-edit-report="${report.id}">
        ✏️ Edit
    </button>

    <button
        type="button"
        class="delete-report-btn"
        data-delete-report="${report.id}">
        🗑 Delete
    </button>

</div>


                </div>

            </div>
        `;

    }).join("");
}

// 7. DELETE REPORT FUNCTION

// =====================================
// CUSTOM DELETE CONFIRMATION
// =====================================

const deleteModal = document.getElementById("deleteModal");

const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const closeDeleteModal = document.getElementById("closeDeleteModal");

let selectedReportId = null;

// Open confirmation modal
function deleteReport(reportId) {

    selectedReportId = reportId;

    deleteModal.classList.add("active");
}

// Close confirmation modal
function closeDeleteConfirmation() {

    deleteModal.classList.remove("active");

    selectedReportId = null;
}

// Cancel button
cancelDelete.addEventListener("click", closeDeleteConfirmation);

// Close icon
closeDeleteModal.addEventListener("click", closeDeleteConfirmation);

// Confirm deletion
confirmDelete.addEventListener("click", function () {

    if (selectedReportId === null) return;

    // Delete selected report
    allReports = allReports.filter(function (report) {
        return !(
            report.id === selectedReportId &&
            report.email === currentStudent.email
        );
    });

    try {

        localStorage.setItem(
            "reports",
            JSON.stringify(allReports)
        );

        studentReports = allReports.filter(function (report) {
            return report.email === currentStudent.email;
        });

        closeDeleteConfirmation();

        updateReportStatistics();
        displayMyReports();

        showAppNotification(
            "Report Deleted",
            "Your report has been deleted successfully.",
            "🗑️"
        );

    } catch (error) {

        showAppNotification(
            "Delete Failed",
            "Unable to delete your report. Please try again.",
            "⚠️"
        );

    }

});


// 8. HANDLE DELETE BUTTON CLICKS
myReportsGrid.addEventListener("click", function (event) {

    const deleteButton = event.target.closest(
        "[data-delete-report]"
    );

    if (!deleteButton) {
        return;
    }

    const reportId = Number(
        deleteButton.dataset.deleteReport
    );

    deleteReport(reportId);
});


/* =====================================
   VIEW REPORT DETAILS
===================================== */

const viewModal = document.getElementById("viewModal");
const viewReportContent = document.getElementById("viewReportContent");
const closeViewModal = document.getElementById("closeViewModal");

// OPEN VIEW MODAL
function viewReport(reportId) {

    const report = studentReports.find(function(item) {
        return item.id === reportId;
    });

    if (!report) return;

    viewReportContent.innerHTML = `
        <div class="view-report-details">

            <div class="view-report-image">
                ${report.image
                    ? `<img src="${report.image}" alt="Item image"
                         style="width:100%; max-height:250px; object-fit:contain; border-radius:12px;">`
                    : `<div style="font-size:70px; text-align:center;">📦</div>`
                }
            </div>

            <h3>${report.itemName}</h3>

            <p><strong>Report Type:</strong> ${report.itemType.toUpperCase()}</p>

            <p><strong>Category:</strong> ${report.category}</p>

            <p><strong>Description:</strong> ${report.description}</p>

            <p><strong>Location:</strong> ${report.location}</p>

            <p><strong>Lost / Found Date:</strong> ${report.itemDate}</p>

            <p><strong>Report ID:</strong> LL-${report.id}</p>

            <p><strong>Status:</strong> ${report.status}</p>

            <hr>

            <h3>Contact Information</h3>

            <p><strong>Student Name:</strong> ${report.studentName}</p>

            <p><strong>Email:</strong> ${report.email}</p>

            <p><strong>Phone:</strong> ${report.phone || "Not provided"}</p>

        </div>
    `;

    viewModal.classList.add("active");
}

// CLOSE VIEW MODAL
function closeViewDetails() {
    viewModal.classList.remove("active");
}

closeViewModal.addEventListener("click", closeViewDetails);

// CLOSE WHEN CLICKING OUTSIDE MODAL
viewModal.addEventListener("click", function(event) {
    if (event.target === viewModal) {
        closeViewDetails();
    }
});

// HANDLE VIEW BUTTON CLICK
myReportsGrid.addEventListener("click", function(event) {

    const viewButton = event.target.closest("[data-view-report]");

    if (!viewButton) return;

    const reportId = Number(viewButton.dataset.viewReport);

    viewReport(reportId);
});


/* =====================================
   EDIT REPORT - OPEN MODAL
===================================== */

const editModal = document.getElementById("editModal");

const editReportForm = document.getElementById("editReportForm");

const closeEditModal = document.getElementById("closeEditModal");

const cancelEdit = document.getElementById("cancelEdit");


// OPEN EDIT MODAL AND FILL EXISTING DATA
function editReport(reportId) {

    const report = studentReports.find(function(item) {
        return item.id === reportId;
    });

    if (!report) return;

    // Fill existing report information
    document.getElementById("editReportId").value = report.id;

    document.getElementById("editItemType").value = report.itemType;

    document.getElementById("editItemName").value = report.itemName;

    document.getElementById("editCategory").value = report.category;

    document.getElementById("editDescription").value = report.description;

    document.getElementById("editLocation").value = report.location;

    document.getElementById("editItemDate").value = report.itemDate;

    document.getElementById("editPhone").value = report.phone || "";

    // Open modal
    editModal.classList.add("active");
}


// CLOSE EDIT MODAL
function closeEditConfirmation() {
    editModal.classList.remove("active");
}

closeEditModal.addEventListener("click", closeEditConfirmation);

cancelEdit.addEventListener("click", closeEditConfirmation);


// HANDLE EDIT BUTTON CLICK
myReportsGrid.addEventListener("click", function(event) {

    const editButton = event.target.closest("[data-edit-report]");

    if (!editButton) return;

    const reportId = Number(editButton.dataset.editReport);

    editReport(reportId);
});


/* =====================================
   SAVE EDITED REPORT
===================================== */

editReportForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // GET EDITED VALUES
    const reportId = Number(
        document.getElementById("editReportId").value
    );

    const itemType = document.getElementById("editItemType").value;
    const itemName = document.getElementById("editItemName").value.trim();
    const category = document.getElementById("editCategory").value;
    const description = document.getElementById("editDescription").value.trim();
    const location = document.getElementById("editLocation").value.trim();
    const itemDate = document.getElementById("editItemDate").value;
    const phone = document.getElementById("editPhone").value.trim();

    const imageInput = document.getElementById("editItemImage");
    const imageFile = imageInput.files[0];

    // FIND ORIGINAL REPORT
    const reportIndex = allReports.findIndex(function(report) {
        return report.id === reportId &&
               report.email === currentStudent.email;
    });

    if (reportIndex === -1) {
        showAppNotification(
            "Report Not Found",
            "Unable to find this report.",
            "⚠️"
        );
        return;
    }

    // IMAGE SIZE VALIDATION
    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
        showAppNotification(
            "Image Too Large",
            "Please select an image smaller than 2 MB.",
            "⚠️"
        );
        return;
    }

    // IMAGE TYPE VALIDATION
    if (imageFile && !["image/jpeg", "image/png"].includes(imageFile.type)) {
        showAppNotification(
            "Invalid Image",
            "Please select a JPG or PNG image.",
            "⚠️"
        );
        return;
    }

    // CHECK FUTURE DATE
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    if (itemDate > localToday) {
        showAppNotification(
            "Invalid Date",
            "Future dates are not allowed.",
            "⚠️"
        );
        return;
    }

    // UPDATE REPORT
    function updateReport(imageData) {

        const oldReport = allReports[reportIndex];

        const updatedReport = {
            ...oldReport,
            itemType: itemType,
            itemName: itemName,
            category: category,
            description: description,
            location: location,
            itemDate: itemDate,
            phone: phone,
            image: imageData,
            updatedAt: new Date().toISOString()
        };

        allReports[reportIndex] = updatedReport;

        try {

            localStorage.setItem(
                "reports",
                JSON.stringify(allReports)
            );

            // REFRESH STUDENT REPORTS
            studentReports = allReports.filter(function(report) {
                return report.email === currentStudent.email;
            });

            // REFRESH PAGE DATA
            updateReportStatistics();
            displayMyReports();

            // CLOSE EDIT MODAL
            closeEditConfirmation();

            // RESET FORM
            editReportForm.reset();

            showAppNotification(
                "Report Updated Successfully",
                "Your report information has been updated.",
                "✅"
            );

        } catch (error) {

            // RESTORE PREVIOUS DATA IF SAVE FAILS
            allReports[reportIndex] = oldReport;

            showAppNotification(
                "Update Failed",
                "Unable to save changes. Storage may be full.",
                "⚠️"
            );

        }
    }

    // KEEP OLD IMAGE IF NO NEW IMAGE SELECTED
    if (imageFile) {

        const reader = new FileReader();

        reader.onload = function() {
            updateReport(reader.result);
        };

        reader.onerror = function() {
            showAppNotification(
                "Image Error",
                "Unable to read the selected image.",
                "⚠️"
            );
        };

        reader.readAsDataURL(imageFile);

    } else {

        updateReport(allReports[reportIndex].image || null);

    }

});


// 9. RUN FUNCTIONS
updateReportStatistics();
displayMyReports();
