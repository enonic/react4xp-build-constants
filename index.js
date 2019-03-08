'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var path = require('path');
var fs = require('fs');
var ensureTargetOutputPath = require('./ensureTargetOutputPath');

var ME = typeof __filename !== "undefined" ? ': ' + __filename : '';

var STANDARD_OUTPUT_FILENAME = "react4xp_constants.json";

var buildConstants = function buildConstants(rootDir, overrides) {
    if (!fs.existsSync(rootDir)) {
        throw Error("rootDir (root directory) doesn't exist: " + JSON.stringify(rootDir));
    }
    if (!fs.lstatSync(rootDir).isDirectory()) {
        throw Error("rootDir (root directory) must be a directory. It doesn't seem to be: " + JSON.stringify(rootDir));
    }

    overrides = overrides || {};
    if (typeof overrides === "string") {
        overrides = JSON.parse(overrides);
    }
    if ((typeof overrides === 'undefined' ? 'undefined' : _typeof(overrides)) !== "object" || Array.isArray(overrides)) {
        throw Error("overrides must be an object (or a JSON string object): " + JSON.stringify(overrides));
    }

    var verboseLog = overrides.verbose || overrides.VERBOSE ? console.log : function () {};

    verboseLog("Generating React4XP build constants JSON file:");
    var outputFile = overrides.outputFileName || STANDARD_OUTPUT_FILENAME;
    outputFile = (outputFile + "").trim();
    if (outputFile === '') {
        throw Error("overrides.outputFileName name is empty/missing: " + JSON.stringify(outputFile));
    }
    if (!outputFile.toLowerCase().endsWith(".json")) {
        outputFile += ".json";
    }
    if (outputFile.indexOf(path.sep) === -1) {
        outputFile = path.join(rootDir, outputFile);
    }
    verboseLog("\t" + outputFile);

    if (overrides && Object.keys(overrides).length > 0) {
        verboseLog("\tOverrides: " + JSON.stringify(overrides, null, 2));
    }

    if (fs.existsSync(outputFile)) {
        if (fs.lstatSync(outputFile).isDirectory()) {
            throw Error("outputFile name seems to point to a directory: " + JSON.stringify(outputFile));
        }
        if (!(overrides.overwriteConstantsFile || overrides.OVERWRITE_CONSTANTS_FILE)) {
            verboseLog("\tFile exists. Overwrite not enabled - exiting.");
            return;
        } else {
            verboseLog("\t\tFile exists - but overwriteConstantsFile is enabled!");
        }
    }

    var defaultConstants = {
        BUILD_ENV: 'development',

        LIBRARY_NAME: 'React4xp',

        R4X_HOME: 'react4xp',
        R4X_TARGETSUBDIR: 'react4xp',

        R4X_ENTRY_SUBFOLDER: '_components',

        SRC_MAIN: path.join(rootDir, 'src', 'main'),

        SITE_SUBFOLDER: 'site',
        SUBFOLDER_BUILD_MAIN: path.join('build', 'resources', 'main'),
        NASHORNPOLYFILLS_FILENAME: "nashornPolyfills.js",
        CLIENT_CHUNKS_FILENAME: "chunks.client.json",
        EXTERNALS_CHUNKS_FILENAME: "chunks.externals.json",
        COMPONENT_CHUNKS_FILENAME: "chunks.json",
        ENTRIES_FILENAME: "entries.json",

        ASSET_URL_ROOT: "/_/service/${app.name}/react4xp/",

        CHUNK_CONTENTHASH: 9,

        EXTERNALS: {
            "react": "React",
            "react-dom": "ReactDOM",
            "react-dom/server": "ReactDOMServer"
        }
    };

    var constants = Object.assign(defaultConstants, overrides);

    constants.BUILD_MAIN = constants.BUILD_MAIN || path.join(rootDir, constants.SUBFOLDER_BUILD_MAIN);

    constants.SRC_R4X = constants.SRC_R4X || path.join(constants.SRC_MAIN, constants.R4X_HOME);

    constants.BUILD_R4X = constants.BUILD_R4X || path.join(constants.BUILD_MAIN, constants.R4X_TARGETSUBDIR);

    constants.RELATIVE_BUILD_R4X = constants.RELATIVE_BUILD_R4X || path.join(constants.SUBFOLDER_BUILD_MAIN, constants.R4X_TARGETSUBDIR);

    constants.SRC_SITE = constants.SRC_SITE || path.join(constants.SRC_MAIN, "resources", constants.SITE_SUBFOLDER);

    constants.SRC_R4X_ENTRIES = constants.SRC_R4X_ENTRIES || path.join(constants.SRC_R4X, constants.R4X_ENTRY_SUBFOLDER);

    constants.recommended = {
        buildEntriesAndChunks: {
            ENTRY_SETS: [{
                sourcePath: constants.SRC_R4X_ENTRIES,
                sourceExtensions: ['jsx', 'js', 'es6'] }, {
                sourcePath: constants.SRC_SITE,
                sourceExtensions: ['jsx'],
                targetSubDir: constants.SITE_SUBFOLDER
            }]
        }
    };

    var BUILD_ENV = constants.BUILD_ENV,
        LIBRARY_NAME = constants.LIBRARY_NAME,
        ASSET_URL_ROOT = constants.ASSET_URL_ROOT,
        R4X_HOME = constants.R4X_HOME,
        SITE_SUBFOLDER = constants.SITE_SUBFOLDER,
        SRC_SITE = constants.SRC_SITE,
        R4X_TARGETSUBDIR = constants.R4X_TARGETSUBDIR,
        R4X_ENTRY_SUBFOLDER = constants.R4X_ENTRY_SUBFOLDER,
        SRC_R4X = constants.SRC_R4X,
        SRC_R4X_ENTRIES = constants.SRC_R4X_ENTRIES,
        RELATIVE_BUILD_R4X = constants.RELATIVE_BUILD_R4X,
        BUILD_MAIN = constants.BUILD_MAIN,
        BUILD_R4X = constants.BUILD_R4X,
        CHUNK_CONTENTHASH = constants.CHUNK_CONTENTHASH,
        NASHORNPOLYFILLS_FILENAME = constants.NASHORNPOLYFILLS_FILENAME,
        CLIENT_CHUNKS_FILENAME = constants.CLIENT_CHUNKS_FILENAME,
        EXTERNALS_CHUNKS_FILENAME = constants.EXTERNALS_CHUNKS_FILENAME,
        COMPONENT_CHUNKS_FILENAME = constants.COMPONENT_CHUNKS_FILENAME,
        ENTRIES_FILENAME = constants.ENTRIES_FILENAME,
        EXTERNALS = constants.EXTERNALS,
        recommended = constants.recommended;

    var asJson = JSON.stringify({
        "__meta__": "This file was generated by react4xp-build-constants" + ME,
        BUILD_ENV: BUILD_ENV,
        LIBRARY_NAME: LIBRARY_NAME, ASSET_URL_ROOT: ASSET_URL_ROOT,
        R4X_HOME: R4X_HOME, SITE_SUBFOLDER: SITE_SUBFOLDER, SRC_SITE: SRC_SITE,
        R4X_TARGETSUBDIR: R4X_TARGETSUBDIR, R4X_ENTRY_SUBFOLDER: R4X_ENTRY_SUBFOLDER, SRC_R4X: SRC_R4X, SRC_R4X_ENTRIES: SRC_R4X_ENTRIES,
        RELATIVE_BUILD_R4X: RELATIVE_BUILD_R4X, BUILD_MAIN: BUILD_MAIN, BUILD_R4X: BUILD_R4X,
        CHUNK_CONTENTHASH: CHUNK_CONTENTHASH,
        NASHORNPOLYFILLS_FILENAME: NASHORNPOLYFILLS_FILENAME, CLIENT_CHUNKS_FILENAME: CLIENT_CHUNKS_FILENAME, EXTERNALS_CHUNKS_FILENAME: EXTERNALS_CHUNKS_FILENAME, COMPONENT_CHUNKS_FILENAME: COMPONENT_CHUNKS_FILENAME, ENTRIES_FILENAME: ENTRIES_FILENAME,
        EXTERNALS: EXTERNALS,
        recommended: recommended
    }, null, 2);

    verboseLog("\tProduced constants: " + asJson);

    ensureTargetOutputPath(outputFile, verboseLog);
    fs.writeFileSync(outputFile, asJson);
    if (fs.existsSync(outputFile)) {
        verboseLog("\t--> " + outputFile);
    } else {
        throw Error("My efforts to create react4xp config file were fruitless: no " + outputFile);
    }

    var fullCopyName = path.join(rootDir, "build", "resources", "main", "lib", "enonic", "react4xp", STANDARD_OUTPUT_FILENAME);
    ensureTargetOutputPath(fullCopyName, verboseLog);
    fs.writeFileSync(fullCopyName, asJson);
    if (fs.existsSync(fullCopyName)) {
        verboseLog("\t--> " + fullCopyName);
    } else {
        throw Error("My efforts to copy the react4xp config file were fruitless: no " + fullCopyName);
    }

    verboseLog("\tOk, done.");
};

module.exports = buildConstants;