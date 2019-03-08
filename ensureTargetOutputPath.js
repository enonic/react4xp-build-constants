'use strict';

var path = require('path');
var fs = require('fs');

function ensureTargetOutputPath(outputFile, verboseLog) {
    verboseLog = verboseLog || function () {};

    if (outputFile.indexOf(path.sep) === -1) {
        throw Error("Not a valid <path>" + path.sep + "<filename>.json: " + outputFile);
    }

    var targetPathArr = outputFile.split(path.sep);
    if (targetPathArr.length < 2) {
        throw Error("Not a valid <path>" + path.sep + "<filename>.json: " + outputFile);
    }

    var targetPath = targetPathArr.slice(0, targetPathArr.length - 1).join(path.sep);

    if (!fs.existsSync(targetPath)) {

        var parentPath = targetPathArr.slice(0, targetPathArr.length - 2).join(path.sep);
        if (!fs.existsSync(parentPath)) {
            ensureTargetOutputPath(targetPath, verboseLog);
        }

        verboseLog("\tCreating output path:      " + targetPath);

        fs.mkdirSync(targetPath);
    }
}

module.exports = ensureTargetOutputPath;