const { exec, dialog } = require('child_process');

window.onload = function() {

    var fileInput = document.getElementById("file-input");
    var label = document.querySelector("label[for='file-input']");

    var uploadButtonForCompression = document.getElementById("upload-button-compress");

    var selectDirectory = document.getElementById("select-directory");
    var openDirectory = document.getElementById("open-directory");
    var directoryPath = document.getElementById("directory-path");

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

    uploadButtonForCompression.addEventListener("click", function() {
        let inputPath = fileInput.files[0].path;
        let compressedFileNameT = inputPath.replace(/.*\\/,"");
        let compressedFileName = compressedFileNameT.replace(".csv",".elf");

        if(localStorage.getItem('compressFolderPath')){
            let outputPath = `${localStorage.getItem('compressFolderPath')}\\${compressedFileName}`;
        }
        else{
            let outputPath = inputpath.replace(".csv",".elf");
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

    /*
    selectDirectory.addEventListener("click", function() {

        dialog.showOpenDialog({
            properties: ['openDirectory'],
        }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
                var folderPath = result.filePaths[0];
                directoryPath.value = folderPath;

                localStorage.setItem('compressFolderPath', folderPath);
            }
        }).catch(err => {
            console.error(err);
        });
    });
    到底也没搞清楚为什么报错，好像是electron版本太高了，但是选择文件夹的版本会选择所有文件，文件夹很大的话会直接卡死
    -_-

    TODO：How to use Dialog ?
    TODO: gys's electron -v: 28.1.0
    */
    openDirectory.addEventListener("click", function() {
        var folderPath = localStorage.getItem('compressFolderPath');
        if (folderPath) {
            exec(`start ${folderPath}`);
        } else {
            console.error('Folder path not found in local storage.');
        }
    });
};

function runJarFile(flag,inputFilePath, outputFilePath) {
    const javaExecutable = 'java';
    const jarPath = 'jar/start-compress.jar';

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
    });
}




