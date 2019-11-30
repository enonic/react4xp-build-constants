# react4xp-buildconstants

**React4xp helper: creates a JSON file with shared constants that define and setup a React4xp project.**

**Jump to:**
  - [Introduction](introduction)
  - [Install](#install)
  - [Usage](#usage)
    - [Parameters](#parameters)
  - [Output](#output)
  - [Skipping this helper](#skipping-this-helper)


## Introduction

React4xp has several steps that are necessary. You can use it out-of-the-box by stringing the helpers and libraries together as-is, or you can fork/modify/override/mess with each of the steps as you want - but the role each of the steps plays is mandatory and should at least not be skipped (with one exception: [building your own externals chunk](https://www.npmjs.com/package/react4xp-runtime-externals) is optional).

Binding these steps together is **a JSON file with a set of constants** that define the whole React4xp project, and sync together each step and what they're is doing. **This helper creates that file for you** (although you can [do it on your own](#skipping-this-helper) if you need to).

These constants define the source and target folder and file structure of a Reaxt4XP project, and shared build- and runtime constants needed across components, libraries, and different languages.
  
## Install

NPM or Yarn as usual:
```bash
npm add --save-dev react4xp-buildconstants
```


## Usage

In Node context:
```EcmaScript6
const buildConstants = require('react4xp-buildconstants');
buildConstants(rootDir [, overrides])
```

Standalone, from command-line with Node installed:
```bash
npx react4xp-buildconstants rootDir [overrides]
```


### Parameters

`rootDir` (string): the root directory of the React4XP project. Must exist.

`overrides` (optional. JSON object or JSON-parsable string): Override the default value(s) of output attributes by adding the same key and a new value here. This can be done for each __output value__ specifically, and/or by setting the __base values__ if the output value is derived from one or more common base values. Some but not all base values will be part of [the Output](#output). Overriding base values allow you to control the several output values at once, which can be simpler, more consistent, and safer - recommended. 

Override-able attributes (and their default values if they are not filled in) are:

  - `R4X_HOME = "react4xp"`: Main source code folder, home of core (non-XP-specific) React4xp source code
 
  - `SRC_MAIN = "<rootDir>/src/main/resources"`: Absolute base source code folder, the parent folder of `R4X_HOME` and `SITE_SUBFOLDER` (by default, but it's up to you).

  - `R4X_TARGETSUBDIR = "assets/react4xp"`: The target runtime folder, into which React4xp components and runtime stuffs are transpiled.                   
  
  - `SUBFOLDER_BUILD_MAIN = "build/resources/main"`: Base pre-JAR folder for building, relative to `rootDir`. Parent folder of `R4X_TARGETSUBDIR`

  - `BUILD_ENV = "development"`: environment variable for production or development
  
  - `LIBRARY_NAME = "React4xp"`: name of the runtime JS library, used for calls in both the client and during serverside rendering
  
  - `SITE_SUBFOLDER = "site"`: name of the _subfolder_ (below `<SRC_MAIN>/resources/`) where the Enonic XP site structure is found.

  - `SRC_SITE = "<rootDir>/src/main/resources/site"`: _full path_ to the folder where the XP site structure is found. Derived from `SRC_MAIN + "resources" + SITE_SUBFOLDER`.
  
  - `SRC_R4X = "<rootDir>/src/main/resources/react4xp"`: _full path_ to the main react4xp source folder, home of core (non-XP-specific) React4xp source code. Derived from `SRC_MAIN + R4X_HOME`.
  
  - `RELATIVE_BUILD_R4X = "build/resources/main/assets/react4xp"`: _relative path_ to the target react4xp build folder. Derived from `SUBFOLDER_BUILD_MAIN + R4X_TARGETSUBDIR`.
  
  - `BUILD_MAIN = "<rootDir>/build/resources/main"`: _full path_ to the main target buildtime folder (pre-JAR). Derived from `SUBFOLDER_BUILD_MAIN`. 

  - `BUILD_R4X = "<rootDir>/build/resources/main/assets/react4xp"`: _full path_ to target folder into which both the React4xp core code and all (both shared and entry) React components will be built. Derived from `BUILD_MAIN + R4X_TARGETSUBDIR`

  - `CHUNK_CONTENTHASH = 9`: Content hash length in the dependency chunk filenames, sets webpack's `output.chunkFilename`. Set to `0` (or falsy) to omit hashing entirely. Can also be an integer-parseable string such as `"9"`, or a full webpack's output.chunkFilename setting string (e.g, `"[name].[hash:8].js"`).
  
  - `EXTERNALS = { "react": "React", "react-dom": "ReactDOM", "react-dom/server": "ReactDOMServer" }`: externals (non-React4xp, non-vendors) libraries needed to be runtime-available by these names, to both client and react serverside-rendering.
  
...and names for some files. The first four are auto-built files that summarize the dynamic output from different React4xp built steps, allowing the runtime to handle dependencies with unpredictable names, as well as tracing chunk dependencies for specific components... 
  
  - `CLIENT_CHUNKS_FILENAME = "chunks.client.json"`,
  
  - `EXTERNALS_CHUNKS_FILENAME = "chunks.externals.json"`,
  
  - `ENTRIES_FILENAME = "entries.json"`,
  
  - `COMPONENT_STATS_FILENAME = "stats.components.json"`
  
The last file names are used to run code on the backend on app startup, to polyfill the *nashorn* engine so it can render Server-Side React (SSR is a native function of React that is made to run on *node*, not nashorn - therefore some polyfilling is needed):
  
  - `NASHORNPOLYFILLS_SOURCE`: No default value, since lib-react4xp comes with a basic nashorn polyfill by default and will run the most common scenarios without anything else. `NASHORNPOLYFILLS_SOURCE` is used to point to an uncompiled source file with _additional_ polyfill code. Full file name with extension, relative to the root project (`rootDir`).   
  
  - `NASHORNPOLYFILLS_FILENAME = "nashornPolyfills"`: name of compiled output file for the extra nashorn polyfilling. No path or file extension, only file name.
  
Three more parameters can be set in the `overrides` object - won't change output but adjust behavior when running:

  - `outputFileName = "react4xp_constants.json"`: Running _react4xp-buildconstants_ will build 2 identical versions of the constants file: the _base_ file used in buildtime, and and a _copy_ put into the predicted build folder where the react4xp XP runtime lib will be imported (lib-react4xp-runtime). Setting the `outputFileName` here lets you specify where the base file will be built. Path relative to the project folder, and filename.

  - `verbose`: Some logging when true
  
  - `overwriteConstantsFile`: Will overwrite already existing output JSON file if true

Slashes depend on file system, should work correctly out of the box. Use your system's appropriate paths when overriding.


## Output

It builds a JSON file with the following attributes, with default or override values. See [parameter overview](#parameters) for the meaning and default value of each of them, as well as rules for overriding. 

  - `BUILD_ENV`
  - `LIBRARY_NAME`
  - `ASSET_URL_ROOT`
  - `R4X_HOME`
  - `SITE_SUBFOLDER`
  - `SRC_SITE`
  - `R4X_TARGETSUBDIR`
  - `SRC_R4X`
  - `RELATIVE_BUILD_R4X`
  -	`BUILD_MAIN`
  - `BUILD_R4X`
  - `CLIENT_CHUNKS_FILENAME`
  - `EXTERNALS_CHUNKS_FILENAME`
  - `COMPONENT_CHUNKS_FILENAME`
  - `ENTRIES_FILENAME`
  - `CHUNK_CONTENTHASH`
  - `EXTERNALS`
  
...and maybe (see above):
  - `NASHORNPOLYFILLS_SOURCE`
  - `NASHORNPOLYFILLS_FILENAME`
 
In addition, one more attribute is added to the output file. It can't be overridden.
  - `__meta__`: Describing the output file itself
  
A copy of the output file is also put in the predicted build location of the [React4xp runtime lib](https://github.com/enonic/lib-react4xp): `<BUILD_MAIN>/lib/enonic/react4xp/react4xp_constants.json` 


-----------

## Skipping this helper

The important thing is the JSON file with the constants, so this helper is not strictly necessary - just much easier. 

If you want to roll your own file manually, **you must:** 
  1. stick to the format defined above, at least the upper-case attributes.
  2. refer to the file in the other steps as mentioned in their documentation, and 
  3. make a copy of it in the build location of the [React4xp runtime lib](https://github.com/enonic/lib-react4xp): `<BUILD_MAIN>/lib/enonic/react4xp/react4xp_constants.json`

