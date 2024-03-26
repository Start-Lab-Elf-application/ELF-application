const { exec} = require('child_process');
const fs= require('fs');

window.onload = function() {

    var fileInput = document.getElementById("file-input");
    var label = document.querySelector("label[for='file-input']");

    var uploadButtonForCompression = document.getElementById("upload-button-compress");

    function preventDefaultAndStopPropagation(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

    function handleFileSelect(event) {
        console.log("test");
        var files = event.target.files;
        var fileList = document.getElementById('fileList');

        // 为每个选中的文件添加一个列表项
        for (var i = 0; i < files.length; i++) {
            var li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'fileCheckbox';
            li.appendChild(checkbox);

            var fileName = document.createElement('span');
            fileName.innerHTML = files[i].name;
            li.appendChild(fileName);

            var fileSize = document.createElement('span');
            fileSize.innerHTML = files[i].size + ' bytes';
            li.appendChild(fileSize);

            var compressedFileSize = document.createElement('span');
            compressedFileSize.innerHTML = '1';
            li.appendChild(compressedFileSize);

            var compressRatio = document.createElement('span');
            compressRatio.innerHTML = '1';
            li.appendChild(compressRatio);

            var compressionTime = document.createElement('span');
            compressionTime.innerHTML = '1';
            li.appendChild(compressionTime);

            var fileStatus = document.createElement('span');
            fileStatus.innerHTML = '未压缩';
            li.appendChild(fileStatus);

            var deleteButton = document.createElement('button');
            deleteButton.innerHTML = '删除';
            deleteButton.onclick = function () {
                fileList.removeChild(this.parentNode);
            };
            li.appendChild(deleteButton);

            li.fileReference = files[i];
            console.log(li.fileReference);

            fileList.appendChild(li);
        }
    }

    function clearList() {
        var fileList = document.getElementById('fileList');

        while (fileList.firstChild) {
            fileList.removeChild(fileList.firstChild);
        }
    }

    function submitCheckedItems() {

        var checkedItems = document.querySelectorAll('.fileCheckbox:checked');
        var totalFiles = checkedItems.length;
        var processedFiles = 0;

        var modal = createProgressModal(totalFiles);
        modal.style.display = "block";

        checkedItems.forEach(function (checkbox) {
            if (checkbox.checked) {
                var file = checkbox.parentNode.fileReference;
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                var uploadInput = document.createElement('input');
                uploadInput.type = 'file';
                uploadInput.name = 'file';
                uploadInput.files = dataTransfer.files;


                var inputPath = file.path;
                var outputPath = inputPath.replace(".csv", ".elf");

                runJarFile(checkbox.parentNode, 0, inputPath, outputPath, function() {
                    processedFiles++;

                    updateProgress(modal, processedFiles, totalFiles);

                    if (processedFiles === totalFiles) {
                        modal.style.opacity = 0;
                        setTimeout(function() {
                            modal.style.display = "none";
                        }, 500);
                    }
                });
            }
        });

    }

    uploadButtonForCompression.addEventListener("click", function () {
        submitCheckedItems();
    });


    function runJarFile(parentNode, flag, inputFilePath, outputFilePath, callback) {
        const javaExecutable = 'java';
        const jarPath = 'jar/start-compress.jar';
        const startTime = Date.now(); // 记录压缩开始时间

        const jarCommand = `${javaExecutable} -jar ${jarPath} ${flag} "${inputFilePath}" "${outputFilePath}"`;

        console.log(jarCommand);

        const child = exec(jarCommand, (error, stdout, stderr) => {

            if (error) {
                console.error(`Error running JAR file: ${error.message}`);
                return;
            }
        });

        child.on('close', (code) => {

            console.log(`JAR file process exited with code ${code}`);

            const originalSize = fs.statSync(inputFilePath).size;
            const compressedSize = fs.statSync(outputFilePath).size;
            console.log(`originalSize: ${originalSize}`);
            console.log(`compressedSize: ${compressedSize}`);
            const compressionRatio = (compressedSize / originalSize).toFixed(2);
            const endTime = Date.now();
            const compressionTime = ((endTime - startTime) / 1000).toFixed(2);
            updateFileList(parentNode, compressionRatio, compressedSize, compressionTime)


            setTimeout(function() {
                callback();
            }, 100);
        });
    }

    function updateFileList(parentNode, compressionRatio, compressedSize, compressionTime) {
        var spans = parentNode.getElementsByTagName('span');

        if (spans[3]) {
            spans[3].innerHTML = "";
            spans[3].textContent = compressionRatio;
        }

        if (spans[2]) {
            spans[2].innerHTML = "";
            spans[2].textContent = compressedSize + ' bytes';
        }

        if (spans[5]) {
            spans[5].innerHTML = "";
            spans[5].textContent = '已压缩';
        }


        if (spans[4]) {
            spans[4].innerHTML = "";
            spans[4].textContent = compressionTime + 's';
        }

    }

    function createProgressModal(totalFiles) {
        // TODO： ai写的
        var modal = document.createElement('div');
        modal.id = "progressModal";
        modal.classList.add("modal");

        var modalContent = document.createElement('div');
        modalContent.classList.add("modal-content");

        var closeButton = document.createElement('span');
        closeButton.classList.add("close");
        closeButton.textContent = "×";
        closeButton.onclick = function() {
            modal.style.display = "none";
        };

        var header = document.createElement('h2');
        header.textContent = "File Processing Progress";

        var progressInfo = document.createElement('div');
        progressInfo.id = "progressInfo";

        progressInfo.innerHTML = `Processed files: <span id="processedFiles">0</span>/<span id="totalFiles">${totalFiles}</span>`;

        modalContent.appendChild(closeButton);
        modalContent.appendChild(header);
        modalContent.appendChild(progressInfo);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);

        return modal;
    }

    function updateProgress(modal, processedFiles, totalFiles) {
        var processedFilesElement = modal.querySelector("#processedFiles");
        processedFilesElement.textContent = processedFiles;

        var totalFilesElement = modal.querySelector("#totalFiles");
        totalFilesElement.textContent = totalFiles;
    }

}