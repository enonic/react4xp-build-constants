# react4xp-buildconstants

Generates constants and stores them in a standard JSON file. These constants define the source and target folder structure of a **Reaxt4XP** project, and shared build- and runtime constants needed across its libraries, languages and components.

**Jump to:**
  - [Install](#install)
  - [Usage](#usage)
    - [Parameters](#parameters)
  - [Output](#output)
  
## Install

NPM or Yarn as usual:
```bash
npm add --save-dev react4xp-buildconstants
```


## Usage

In Node context:
```EcmaScript6
const buildConstants = require('react4xp-buildconstants');
buildConstants(rootDir, outputFile [, overrides])
```

Standalone, from command-line with Node installed:
```bash
node_modules/react4xp-buildconstants/lib/cli.js "rootDir" "outputFile" ["overrides"]
```


### Parameters

`rootDir` (string): the root directory of the React4XP project. Must exist.

`outputFile` (string): the name of the JSON file where the constants are stored. If it doesn't end in `.json`, that extension will be added. It can / should be a full path-and-filename (in system-appropriate format). But if it's only a file name, the output file will be created in `rootDir`. Default behavior is to NOT overwrite the file if it already exists, but overwriting can be enabled (see `overwriteConstantsFile` below). Will try to create folder if path doesn't exist.

`overrides` (optional. Object or JSON-parsable string): Override the default value(s) of output attributes by adding the same key and a new value here. This can be done for each __output value__ specifically (see the [Output](#output) below), __and/or__ by setting the __base values__: some output values are derived from common base values. Although these base values will not be part of the output, you can override them here to control the several output values at once. Simpler, more consistent, and safer - override the base values if you can! 

The base values are, with the current values:

  - `R4X_HOME = "react4xp"`: Main source code folder, home of core (non-XP-specific) React4xp source code 
 
  - `SRC_MAIN = "<rootDir>/src/main"`: Absolute base source code folder, parent folder of not only `R4X_HOME` but also Enonic XP's `resources` and `java` folders.

  - `R4X_TARGETSUBDIR = "react4xp"`: The target runtime folder, into which React4xp components and runtime stuffs are transpiled                   
  
  - `SUBFOLDER_BUILD_MAIN = "build/resources/main"`: Base pre-JAR folder for building, relative to `rootDir`. Parent folder of `R4X_TARGETSUBDIR`

`overrides` can also contain these attributes, which won't change output but adjust behavior when running:

  - `verbose`: Some logging when true
  
  - `overwriteConstantsFile`: Will overwrite already existing output JSON file if true

Slashes depend on file system, should work correctly out of the box. Use your system's appropriate paths when overriding.


## Output

It builds a JSON file with these attributes. These default values can be controlled with the `overrides` parameter (but overriding base attributes instead of derived ones is probably simpler and safer):

  - `BUILD_ENV = "development"`: environment variable for production or development
  
  - `LIBRARY_NAME = "React4xp"`: name of the runtime JS library, used for calls in both the client and during serverside rendering 

  - `SITE_SUBFOLDER = "site"`: name of the _subfolder_ (below `<SRC_MAIN>/resources/`) where the Enonic XP site structure is found.

  - `SRC_SITE = "<rootDir>/src/main/resources/site"`: _full path_ to the folder where the XP site structure is found. Derived from `SRC_MAIN + "resources" + SITE_SUBFOLDER`.
  
  - `R4X_ENTRY_SUBFOLDER = "_components"`: name of the _subfolder_ inside the core react4xp folder where react4xp during buildtime will look for general (not bound to specific XP components) _entry files_ (entries are non-shared, first-level components, runnable in both the client and in XP after transpilation)
  
  - `SRC_R4X = "<rootDir>/src/main/react4xp"`: _full path_ to the main react4xp source folder, home of core (non-XP-specific) React4xp source code. Derived from `SRC_MAIN + R4X_HOME`.
  
  - `SRC_R4X_ENTRIES = "<rootDir>/src/main/react4xp/_components"`: _full path_ to the entries source folder. Derived from `SRC_R4X + R4X_ENTRY_SUBFOLDER`.
  
  - `RELATIVE_BUILD_R4X = "build/resources/main/react4xp"`: _relative path_ to the target react4xp build folder. Derived from `SUBFOLDER_BUILD_MAIN + R4X_TARGETSUBDIR`.
  
  - `BUILD_MAIN = "<rootDir>/build/resources/main"`: _full path_ to the main target buildtime folder (pre-JAR). Derived from `SUBFOLDER_BUILD_MAIN`. 

  - `BUILD_R4X = "<rootDir>/build/resources/main/react4xp"`: _full path_ to target folder into which both the React4xp core code and all (both shared and entry) React components will be built. Derived from `BUILD_MAIN + R4X_TARGETSUBDIR`
  
  - `EXTERNALS = { "react": "React", "react-dom": "ReactDOM", "react-dom/server": "ReactDOMServer" }`: externals (non-React4xp, non-vendors) libraries needed to be runtime-available by these names, to both client and react serverside-rendering.

  - `recommended`: Nice-to-have default settings (derived from the above) for other react4xp libraries: 
    - `buildEntriesAndChunks`: react4xp-build-entriesandchunks 
  
  - `__META__`: Describing the output file itself
