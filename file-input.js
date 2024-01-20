window.onload = function() {
    var fileInput = document.getElementById("file-input");
    var label = document.querySelector("label[for='file-input']");

    function preventDefaultAndStopPropagation(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    fileInput.addEventListener("change", function() {
        var fileName = fileInput.value.split("\\").pop();
        label.textContent = fileName;
        label.style.border = '2px dashed #00EE00';
    });

    label.addEventListener('dragover', function (e) {
        preventDefaultAndStopPropagation(e);
        this.style.border = '2px dashed #B8A1F5';
    });

    label.addEventListener('dragleave', function (e) {
        preventDefaultAndStopPropagation(e);
        this.style.border = '2px dashed #ccc';
    });

    label.addEventListener('drop', function (e) {
        preventDefaultAndStopPropagation(e);
        if (e.dataTransfer.files.length) {
            this.style.border = '2px dashed #00EE00';
            fileInput.files = e.dataTransfer.files;
            var fileName = fileInput.value.split("\\").pop();
            label.textContent = fileName;
        } else {
            this.style.border = '1px solid #ccc';
        }
    });
};




