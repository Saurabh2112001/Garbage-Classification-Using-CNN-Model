document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileLabel = document.getElementById("file-label");
    const uploadBtn = document.getElementById("upload-btn");
    const resultSection = document.getElementById("result-section");
    const classificationResult = document.getElementById("classification-result");
    const MAX_FILE_SIZE_MB = 50;

    // Drag-and-drop events
    dropArea.addEventListener("click", () => fileInput.click());
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.style.background = "#e6f7ff";
    });
    dropArea.addEventListener("dragleave", () => {
        dropArea.style.background = "#f8f9fa";
    });
    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.style.background = "#f8f9fa";
        handleFile(event.dataTransfer.files[0]);
    });

    // File input change
    fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

    function handleFile(file) {
        if (!validateFile(file)) return;

        // Update the label with the file name
        fileLabel.textContent = file.name;

        // Enable the upload button
        uploadBtn.disabled = false;
    }

    function validateFile(file) {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            alert(`File size exceeds limit: ${file.name}`);
            return false;
        }
        return true;
    }

    // Form submission
    const form = document.getElementById("upload-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        fetch("/classify", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    classificationResult.textContent = `Error: ${data.error}`;
                    classificationResult.style.color = "red";
                } else {
                    classificationResult.textContent = `The predicted class is: ${data.class}`;
                    classificationResult.style.color = "#007bff";
                }
                resultSection.style.display = "block";
            })
            .catch((error) => {
                classificationResult.textContent = `Error: ${error.message}`;
                classificationResult.style.color = "red";
                resultSection.style.display = "block";
            });
    });
});
