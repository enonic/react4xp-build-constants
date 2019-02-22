const path = require('path');
const fs = require('fs');

const buildConstants = (rootDir, outputFileName, overrides) => {
    const baseConstants = {
        BUILD_ENV: /*'production'; /*/ 'development',

        LIBRARY_NAME: 'React4xp',

        R4X_HOME: 'react4xp',

        // Special-case subdirectory under /react4xp/. All files under this will be their own chunk, for dynamic, on-demand
        // asset loading of top-level components, which in turn uses shared components chunked under all other subdirectories.
        R4X_ENTRY_SUBFOLDER: '_components',

        SRC_MAIN: path.join(rootDir, 'src', 'main'),

        SITE: 'site',
        MAIN: path.join('build', 'resources', 'main'),


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
        EXTERNALS: {
            "react": "React",
            "react-dom": "ReactDOM",
            "react-dom/server": "ReactDOMServer",
        },
    };

    const constants = Object.assign(baseConstants, overrides || {});

    constants.BUILD_MAIN = constants.BUILD_MAIN || path.join(rootDir, constants.MAIN);
    constants.R4X_TARGETSUBDIR = constants.R4X_TARGETSUBDIR || constants.R4X_HOME;
    constants.SRC_R4X = constants.SRC_R4X || path.join(constants.SRC_MAIN, constants.R4X_HOME);
    constants.BUILD_R4X = constants.BUILD_R4X || path.join(constants.BUILD_MAIN, constants.R4X_TARGETSUBDIR);
    constants.RELATIVE_BUILD_R4X = constants.RELATIVE_BUILD_R4X || path.join(constants.MAIN, constants.R4X_TARGETSUBDIR);
    constants.SRC_SITE = constants.SRC_SITE || path.join(constants.SRC_MAIN, "resources", constants.SITE);
    constants.SRC_R4X_ENTRIES = constants.SRC_R4X_ENTRIES || path.join(constants.SRC_R4X, constants.R4X_ENTRY_SUBFOLDER);

    const {
        SITE, SRC_R4X, SRC_SITE, SRC_R4X_ENTRIES, R4X_ENTRY_SUBFOLDER, BUILD_R4X, RELATIVE_BUILD_R4X, BUILD_ENV, LIBRARY_NAME, EXTERNALS,
    } = constants;
    const selectedConstants = {
        SITE, SRC_R4X, SRC_SITE, SRC_R4X_ENTRIES, R4X_ENTRY_SUBFOLDER, BUILD_R4X, RELATIVE_BUILD_R4X, BUILD_ENV, LIBRARY_NAME, EXTERNALS,
    };

    if (overrides.verbose || overrides.VERBOSE) {
        console.log(JSON.stringify(selectedConstants, null, 2));
    }

    fs.writeFileSync(path.join(rootDir, outputFileName), JSON.stringify(selectedConstants, null, 2));


    // Shared constants that for different reasons must be available in a more general format than JS:
    //const JSON_CONSTANTS = JSON.parse(fs.readFileSync(overrideParameters.JSON_CONSTANTS_FILE || 'webpack.config.constants.json', 'utf8'));

};

module.exports = buildConstants;
