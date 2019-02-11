'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var path = require('path');
var fs = require('fs');
var jsonConstants = require('./constants.json');

// TODO: Document the overrideParameters here too! Preferrably, asciidoc.
var getConstants = function getConstants(rootDir, overrideParameters) {
    overrideParameters = overrideParameters || {};

    // Shared constants used in more places and languages, and therefore need to be available in a separate and generally-readable file:
    var JSON_CONSTANTS = overrideParameters.JSON_CONSTANTS_FILE ? JSON.parse(fs.readFileSync(overrideParameters.JSON_CONSTANTS_FILE)) : jsonConstants;

    var BUILD_ENV = /*'production'; /*/'development'; //*/

    var SRC_MAIN = path.join(rootDir, 'src', 'main');

    var MAIN = path.join('build', 'resources', 'main');

    var SITE = 'site';

    var BUILD_MAIN = path.join(rootDir, MAIN);

    // Special-case subdirectory under /react4xp/. All files under this will be their own chunk, for dynamic, on-demand
    // asset loading of top-level components, which in turn uses shared components chunked under all other subdirectories.
    var R4X_ENTRY_SUBFOLDER = '_components';
    var R4X_HOME = 'react4xp';

    var R4X_TARGETSUBDIR = R4X_HOME;
    var SRC_R4X = path.join(SRC_MAIN, R4X_HOME);
    var BUILD_R4X = path.join(BUILD_MAIN, R4X_TARGETSUBDIR);
    var RELATIVE_BUILD_R4X = path.join(MAIN, R4X_TARGETSUBDIR);

    var SRC_SITE = path.join(SRC_MAIN, "resources", SITE);

    var SRC_R4X_ENTRIES = path.join(SRC_R4X, R4X_ENTRY_SUBFOLDER);

    var LIBRARY_NAME = 'React4xp';

    // Shared constants that for different reasons must be available in a more general format than JS:
    //const JSON_CONSTANTS = JSON.parse(fs.readFileSync(overrideParameters.JSON_CONSTANTS_FILE || 'webpack.config.constants.json', 'utf8'));

    /*  Common externals from a file, since these values must match everywhere
        and is shared by a gradle step as well as all webpack steps.
        If ever using anything else than output.libraryTarget: 'var' (corresponds to global variable, or "root"),
        use this in the json file instead, etc:
        "react": {
           "root": "React",
           "commonjs2": "react",
           "commonjs": "react",
           "amd": "react"
       },
       "react-dom": {
           "root": "ReactDOM",
           "commonjs2": "react-dom",
           "commonjs": "react-dom",
           "amd": "react-dom"
       }
    */
    var EXTERNALS = JSON_CONSTANTS.EXTERNALS;

    return Object.assign({
        SITE: SITE,
        SRC_MAIN: SRC_MAIN, SRC_R4X: SRC_R4X, SRC_SITE: SRC_SITE, SRC_R4X_ENTRIES: SRC_R4X_ENTRIES,
        R4X_HOME: R4X_HOME, R4X_TARGETSUBDIR: R4X_TARGETSUBDIR, R4X_ENTRY_SUBFOLDER: R4X_ENTRY_SUBFOLDER,
        BUILD_MAIN: BUILD_MAIN, BUILD_R4X: BUILD_R4X, BUILD_ENV: BUILD_ENV, RELATIVE_BUILD_R4X: RELATIVE_BUILD_R4X,
        LIBRARY_NAME: LIBRARY_NAME,
        EXTERNALS: EXTERNALS
    }, overrideParameters || {});
};

exports.default = getConstants;