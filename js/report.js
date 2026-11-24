
/* =====================================
   LOSTLINK REPORT FORM
===================================== */

// Get report form
const reportForm = document.getElementById("reportForm");

// Get logged-in student data
const currentStudentData = sessionStorage.getItem("loggedInStudent");

if (currentStudentData) {

    try {

        const currentStudent = JSON.parse(currentStudentData);

        // Auto-fill student name
        document.getElementById("studentName").value =
            currentStudent.fullName || "";

        // Auto-fill student email
        document.getElementById("email").value =
            currentStudent.email || "";

    } catch (error) {

        console.error("Unable to read student data:", error);

    }

} else {

    console.log("No logged-in student found.");

}


// =====================================
// IMAGE PREVIEW FUNCTIONALITY
// =====================================

const itemImageInput = document.getElementById("itemImage");

const previewImage = document.getElementById("previewImage");

const imagePreviewContainer = document.getElementById("imagePreviewContainer");

const imageName = document.getElementById("imageName");

const removeImageButton = document.getElementById("removeImage");


// When user selects an image
itemImageInput.addEventListener("change", function() {

    const selectedFile = itemImageInput.files[0];

    if (!selectedFile) {
        return;
    }

    // Check image type
    if (!selectedFile.type.startsWith("image/")) {

        showAppNotification(
            "Invalid File",
            "Please select a valid image.",
            "⚠️"
        );

        itemImageInput.value = "";
        return;
    }

    // Check image size (maximum 2 MB)
    if (selectedFile.size > 2 * 1024 * 1024) {

        showAppNotification(
            "Image Too Large",
            "Please select an image smaller than 2 MB.",
            "⚠️"
        );

        itemImageInput.value = "";
        return;
    }

    // Create temporary image URL
    const imageURL = URL.createObjectURL(selectedFile);

    // Display preview
    previewImage.src = imageURL;

    imageName.textContent = selectedFile.name;

    imagePreviewContainer.style.display = "block";

});


// Remove selected image
removeImageButton.addEventListener("click", function() {

    itemImageInput.value = "";

    previewImage.src = "";

    imageName.textContent = "";

    imagePreviewContainer.style.display = "none";

});
// =====================================
// REPORT FORM VALIDATION
// =====================================


// =====================================
// SAVE REPORT DATA IN LOCAL STORAGE
// =====================================

reportForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const itemNameValue = document.getElementById("itemName").value.trim();
    const descriptionValue = document.getElementById("description").value.trim();
    const phoneValue = document.getElementById("phone").value.trim();
    const dateValue = document.getElementById("itemDate").value;

    // Item name validation
    if (itemNameValue.length < 3) {
        showAppNotification(
            "Invalid Item Name",
            "Item name must contain at least 3 characters.",
            "⚠️"
        );
        return;
    }

    // Description validation
    if (descriptionValue.length < 10) {
        showAppNotification(
            "Description Too Short",
            "Please write at least 10 characters.",
            "⚠️"
        );
        return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phoneValue)) {
        showAppNotification(
            "Invalid Phone Number",
            "Please enter a valid 10-digit phone number.",
            "⚠️"
        );
        return;
    }

    // Date validation
    if (dateValue > new Date().toISOString().split("T")[0]) {
        showAppNotification(
            "Invalid Date",
            "Future dates are not allowed.",
            "⚠️"
        );
        return;
    }

    // Get selected item type
    const selectedType = document.querySelector(
        'input[name="itemType"]:checked'
    );

    if (!selectedType) {
        showAppNotification(
            "Select Item Type",
            "Please select Lost or Found.",
            "⚠️"
        );
        return;
    }

    // Get selected image
    const selectedFile = itemImageInput.files[0];

    // Create report object
    const reportData = {
        id: Date.now(),
        itemType: selectedType.value,
        itemName: itemNameValue,
        category: document.getElementById("category").value,
        description: descriptionValue,
        location: document.getElementById("location").value.trim(),
        itemDate: dateValue,
        studentName: document.getElementById("studentName").value,
        email: document.getElementById("email").value,
        phone: phoneValue,
        image: null,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    // Function to save report
    function saveReport(imageData) {

        reportData.image = imageData;

        let existingReports = [];

        try {
            existingReports = JSON.parse(
                localStorage.getItem("reports")
            ) || [];
        } catch (error) {
            showAppNotification(
                "Storage Error",
                "Unable to read existing reports.",
                "⚠️"
            );
            return;
        }

        existingReports.push(reportData);

        try {
            localStorage.setItem(
                "reports",
                JSON.stringify(existingReports)
            );

            showAppNotification(
                "Report Submitted!",
                "Your item report has been saved successfully.",
                "🎉"
            );

            reportForm.reset();

            // Clear image preview
            previewImage.src = "";
            imageName.textContent = "";
            imagePreviewContainer.style.display = "none";

            // Restore student details after reset
            const studentData = JSON.parse(
                sessionStorage.getItem("loggedInStudent")
            );

            if (studentData) {
                document.getElementById("studentName").value =
                    studentData.fullName || "";

                document.getElementById("email").value =
                    studentData.email || "";
            }

        } catch (error) {
            showAppNotification(
                "Storage Full",
                "Unable to save this report. Try using a smaller image.",
                "⚠️"
            );
        }
    }

    // Convert image into Base64
    if (selectedFile) {

        const reader = new FileReader();

        reader.onload = function() {
            saveReport(reader.result);
        };

        reader.onerror = function() {
            showAppNotification(
                "Image Error",
                "Unable to read the selected image.",
                "⚠️"
            );
        };

        reader.readAsDataURL(selectedFile);

    } else {
        saveReport(null);
    }

});
