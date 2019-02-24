const path = require('path');
const fs = require('fs');
const ensureTargetOutputPathExists = require('./ensureTargetOutputPathExists');

const ME = typeof __filename !== "undefined" ? ` (${__filename})` : '';  // eslint-disable-line no-undef


/** Builds and outputs a constants JSON file, for shared React4xp constants that are needed across 
 *  contexts, buildtime/runtime and languages. 
 *  @param rootDir The project root. 
 *  @param outputFile The path and name of the output constants JSON file.
 *  @param overrides An object where you can insert any of these values to control them in the output field:
 *      { 
 *          BUILD_ENV, LIBRARY_NAME, R4X_HOME, R4X_ENTRY_SUBFOLDER, SRC_MAIN, SITE_SUBFOLDER, SUBFOLDER_BUILD_MAIN, 
 *          EXTERNALS, BUILD_MAIN, R4X_TARGETSUBDIR, SRC_R4X, BUILD_R4X, RELATIVE_BUILD_R4X, SRC_SITE, SRC_R4X_ENTRIES 
 *      }
 *  Overrides can also have a "verbose" parameter, which will cause logging of the values if true.
 *  Overrides can also have a "overwriteConstantsFile" parameter. If this is true, and only then, 
 *  will an existing constants file on the target outputfile path be overwritten.
 *  Overrides can be an object, or a string that can be JSON parsed into an object.
 *  @returns Only the necessary fields are returned:
 *      { 
 *           BUILD_ENV, LIBRARY_NAME, 
 *           SITE_SUBFOLDER, SRC_SITE, 
 *           R4X_ENTRY_SUBFOLDER, SRC_R4X, SRC_R4X_ENTRIES, 
 *           RELATIVE_BUILD_R4X, BUILD_R4X, EXTERNALS
 *      }
 */
const buildConstants = (rootDir, outputFile, overrides) => {
    if (!fs.existsSync(rootDir)) {
        throw Error("rootDir (root directory) doesn't exist: " + JSON.stringify(rootDir));
    }
    
    if (!fs.lstatSync(rootDir).isDirectory()) {
        throw Error("rootDir (root directory) must be a directory. It doesn't seem to be: " + JSON.stringify(rootDir));
    }
    outputFile = ((outputFile || "") + "").trim(); 
    if (outputFile === '') {
        throw Error("outputFile name is empty/missing: " + JSON.stringify(outputFile));
    }

    overrides = overrides || {};
    if (typeof overrides === "string") {
        overrides = JSON.parse(overrides);
    }
    if (typeof overrides !== "object" || Array.isArray(overrides)) {
        throw Error("overrides must be an object (or a JSON string object): " + JSON.stringify(overrides));
    }

    const verboseLog = (overrides.verbose || overrides.VERBOSE) ?
        console.log :
        function () {};
    
    verboseLog("Generating React4XP build constants JSON file:");

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

    const defaultConstants = {
        BUILD_ENV: /*'production'; /*/ 'development',

        LIBRARY_NAME: 'React4xp',

        R4X_HOME: 'react4xp',
        R4X_TARGETSUBDIR: 'react4xp',

        // Special-case subdirectory under /react4xp/. All files under this will be their own chunk, for dynamic, on-demand
        // asset loading of top-level components, which in turn uses shared components chunked under all other subdirectories.
        R4X_ENTRY_SUBFOLDER: '_components',

        SRC_MAIN: path.join(rootDir, 'src', 'main'),        // <project>/src/main

        SITE_SUBFOLDER: 'site',
        SUBFOLDER_BUILD_MAIN: path.join('build', 'resources', 'main'),      // build/resources/main


        /*  If ever using anything else than output.libraryTarget: 'var' (corresponds to global variable, or "root"),
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
        EXTERNALS: {
            "react": "React",
            "react-dom": "ReactDOM",
            "react-dom/server": "ReactDOMServer",
        },
    };

    const constants = Object.assign(defaultConstants, overrides);

    // -------------------------- Derived values from the values above. 
    // Can be changed by overriding the values above that build them, or overridden directly.
    // Clarifying comments for un-overridden values:

    // <project>build/resources/main
    constants.BUILD_MAIN = constants.BUILD_MAIN || path.join(rootDir, constants.SUBFOLDER_BUILD_MAIN);  
    
    // <project>/src/main/react4xp
    constants.SRC_R4X = constants.SRC_R4X || path.join(constants.SRC_MAIN, constants.R4X_HOME);

    // <project>build/resources/main/react4xp
    constants.BUILD_R4X = constants.BUILD_R4X || path.join(constants.BUILD_MAIN, constants.R4X_TARGETSUBDIR);
    
    // build/resources/main/react4xp
    constants.RELATIVE_BUILD_R4X = constants.RELATIVE_BUILD_R4X || path.join(constants.SUBFOLDER_BUILD_MAIN, constants.R4X_TARGETSUBDIR);
    
    // <project>/src/main/resources/site
    constants.SRC_SITE = constants.SRC_SITE || path.join(constants.SRC_MAIN, "resources", constants.SITE_SUBFOLDER);
    
    // <project>/src/main/react4xp/_components
    constants.SRC_R4X_ENTRIES = constants.SRC_R4X_ENTRIES || path.join(constants.SRC_R4X, constants.R4X_ENTRY_SUBFOLDER);

    // Recommended defaults:
    const overrideDefaults = constants.recommended || {};
    const overrideBuildEntriesAndChunks = overrideDefaults.buildEntriesAndChunks || {};

    constants.recommended = constants.recommended || {
        buildEntriesAndChunks: overrideDefaults.buildEntriesAndChunks || {
            ENTRY_SETS: overrideBuildEntriesAndChunks.ENTRY_SETS ||  [
                {
                    sourcePath: constants.SRC_R4X_ENTRIES,
                    sourceExtensions: ['jsx', 'js', 'es6'],     // TODO: ts? tsx?
                },
                {
                    sourcePath: constants.SRC_SITE,
                    sourceExtensions: ['jsx'],                  // TODO: tsx?
                    targetSubDir: constants.SITE_SUBFOLDER,
                },
            ],
        },
    };


    //-------------------------------------- Output

    // Select fields for output
    const {
        BUILD_ENV, LIBRARY_NAME, 
        SITE_SUBFOLDER, SRC_SITE, 
        R4X_ENTRY_SUBFOLDER, SRC_R4X, SRC_R4X_ENTRIES, 
        RELATIVE_BUILD_R4X, BUILD_MAIN, BUILD_R4X, EXTERNALS,
        recommended,
    } = constants;
    const asJson = JSON.stringify({
        "__META__": "This file was generated by react4xp-buildconstants" + ME,
        BUILD_ENV, LIBRARY_NAME, 
        SITE_SUBFOLDER, SRC_SITE, 
        R4X_ENTRY_SUBFOLDER, SRC_R4X, SRC_R4X_ENTRIES, 
        RELATIVE_BUILD_R4X, BUILD_MAIN, BUILD_R4X, EXTERNALS,
        recommended,
    }, null, 2);

    verboseLog("\tproduced constants: " + asJson);
    
    ensureTargetOutputPathExists(outputFile, verboseLog);
    fs.writeFileSync(outputFile, asJson);

    verboseLog("\tOk, done.");
};

module.exports = buildConstants;
