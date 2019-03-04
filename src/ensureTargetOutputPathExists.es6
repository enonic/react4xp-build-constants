const path = require('path');
const fs = require('fs');

function ensureTargetOutputPathExists(outputFile, verboseLog) {
    verboseLog = verboseLog || function () {};
    
    if (outputFile.indexOf(path.sep) === -1) {
        throw Error("Not a valid <path>" + path.sep + "<filename>.json: " + outputFile);
    }

    const targetPathArr = outputFile.split(path.sep);
    if (targetPathArr.length < 2) {
        throw Error("Not a valid <path>" + path.sep + "<filename>.json: " + outputFile);
    }
    
    const targetPath = targetPathArr.slice(0, targetPathArr.length - 1).join(path.sep);
    
    if (!fs.existsSync(targetPath)) {
        //verboseLog("\tOutput path doesn't exist: " + targetPath);

        const parentPath = targetPathArr.slice(0, targetPathArr.length - 2).join(path.sep);
        if (!fs.existsSync(parentPath)) {
            ensureTargetOutputPathExists(targetPath, verboseLog);
        } 
        
        verboseLog("\tCreating output path:      " + targetPath);
        
        fs.mkdirSync(targetPath);
    }
}

module.exports = ensureTargetOutputPathExists;
