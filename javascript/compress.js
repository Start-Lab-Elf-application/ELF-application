const { exec} = require('child_process');
const fs= require('fs');
let amountOfCompressTask = 0;

window.onload = function() {

    var fileInput = document.getElementById("file-input");
    var label = document.querySelector("label[for='file-input']");

    var uploadButtonForCompression = document.getElementById("upload-button-compress");

    var selectDirectory = document.getElementById("select-directory-c");
    var openDirectory = document.getElementById("open-directory-c");
    var directoryPath = document.getElementById("directory-path-c");

    var storedFolderPath = localStorage.getItem('compressFolderPath');
    if (storedFolderPath) {
        directoryPath.value = storedFolderPath;
    }

    function preventDefaultAndStopPropagation(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    fileInput.addEventListener("change", function() {
        var fileName = fileInput.value.split("\\").pop();
        label.textContent = fileName;
        label.style.border = '2px dashed #447249';

    });

    label.addEventListener('dragover', function (e) {
        preventDefaultAndStopPropagation(e);
        this.style.border = '2px dashed #555A75';
    });

    label.addEventListener('dragleave', function (e) {
        preventDefaultAndStopPropagation(e);
        this.style.border = '2px dashed #ccc';
    });

    label.addEventListener('drop', function (e) {
        preventDefaultAndStopPropagation(e);
        if (e.dataTransfer.files.length) {
            this.style.border = '2px dashed #447249';
            fileInput.files = e.dataTransfer.files;
            var fileName = fileInput.value.split("\\").pop();
            label.textContent = fileName;

        } else {
            this.style.border = '1px solid #ccc';
        }
    });

    uploadButtonForCompression.addEventListener("click", function() {
        let inputPath = fileInput.files[0].path;
        let compressedFileNameT = inputPath.replace(/.*\\/,"");
        let compressedFileName = compressedFileNameT.replace(".csv",".elf");
        let outputPath;

        if(localStorage.getItem('compressFolderPath')){
            outputPath = `${localStorage.getItem('compressFolderPath')}\\${compressedFileName}`;
        }
        else{
            outputPath = inputPath.replace(".csv",".elf");
            localStorage.setItem('compressFolderPath',outputPath.replace(/\\[^\\]*$/, ""))
        }

        runJarFile(0,inputPath,outputPath);
    });

    selectDirectory.addEventListener("click", function() {

        var directoryInput = document.createElement("input");
        directoryInput.type = "file";
        directoryInput.webkitdirectory = true;
        directoryInput.click();

        directoryInput.addEventListener("change", function() {
            var absolutePath = directoryInput.files[0].path;
            var folderPath = absolutePath.replace(/\\[^\\]*$/, "");
            directoryPath.value = folderPath;

            localStorage.setItem('compressFolderPath',folderPath)
        });
    });


    openDirectory.addEventListener("click", function() {
        var folderPath = localStorage.getItem('compressFolderPath');
        if (folderPath) {
            exec(`start ${folderPath}`);
        } else {
            console.error('Folder path not found in local storage.');
        }
    });
};

function runJarFile(flag, inputFilePath, outputFilePath) {
    const javaExecutable = 'java';
    const jarPath = 'jar/start-compress.jar';
    const startTime = Date.now(); // 记录压缩开始时间

    const jarCommand = `${javaExecutable} -jar ${jarPath} ${flag} "${inputFilePath}" "${outputFilePath}"`;

    console.log(jarCommand);

    amountOfCompressTask += 1;
    updateTask(amountOfCompressTask);

    const child = exec(jarCommand, (error, stdout, stderr) => {

        if (error) {
            console.error(`Error running JAR file: ${error.message}`);
            amountOfCompressTask -= 1;
            updateTask(amountOfCompressTask);
            return;
        }
    });

    child.on('close', (code) => {
        amountOfCompressTask -= 1;
        updateTask(amountOfCompressTask);

        console.log(`JAR file process exited with code ${code}`);

        const originalSize = fs.statSync(inputFilePath).size;
        const compressedSize = fs.statSync(outputFilePath).size;
        const compressionRatio = (originalSize / compressedSize).toFixed(2);
        const endTime = Date.now();
        const compressionTime = ((endTime - startTime) / 1000).toFixed(2);


        alert(`压缩完成\n压缩时间: ${compressionTime}秒\n压缩比率: ${compressionRatio}`);
    });
}

function updateTask(amountOfCompressTask){
    document.getElementById("task-c").textContent = "Numbers of task: "+amountOfCompressTask;
}


