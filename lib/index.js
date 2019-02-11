'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var path = require('path');
var fs = require('fs');
var jsonConstants = require('./constants.json');

var getConstants = function getConstants(rootDir, overrideParameters) {
    overrideParameters = overrideParameters || {};

    var JSON_CONSTANTS = overrideParameters.JSON_CONSTANTS_FILE ? JSON.parse(fs.readFileSync(overrideParameters.JSON_CONSTANTS_FILE)) : jsonConstants;

    var BUILD_ENV = 'development';

    var SRC_MAIN = path.join(rootDir, 'src', 'main');

    var MAIN = path.join('build', 'resources', 'main');

    var SITE = 'site';

    var BUILD_MAIN = path.join(rootDir, MAIN);

    var R4X_ENTRY_SUBFOLDER = '_components';
    var R4X_HOME = 'react4xp';

    var R4X_TARGETSUBDIR = R4X_HOME;
    var SRC_R4X = path.join(SRC_MAIN, R4X_HOME);
    var BUILD_R4X = path.join(BUILD_MAIN, R4X_TARGETSUBDIR);
    var RELATIVE_BUILD_R4X = path.join(MAIN, R4X_TARGETSUBDIR);

    var SRC_SITE = path.join(SRC_MAIN, "resources", SITE);

    var SRC_R4X_ENTRIES = path.join(SRC_R4X, R4X_ENTRY_SUBFOLDER);

    var LIBRARY_NAME = 'React4xp';

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