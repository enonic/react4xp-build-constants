#React4XP build constants

`webpack.config.constants.json` has the method `getConstants(rootDir [, overrideParams])`, which returns shared constants for buildtime component libraries for Enonic React4XP and its multiple webpack build steps. This mainly defines the default expected source and build folder structure for React4xp, for the other librarified build steps to work.

`getConstants` needs a `rootDir` argument (string), which is the root directory of the webpack project running it. Supplying `__dirname` should do the trick.

It returns an object with these attributes and default values (slashes depend on file system, should work correctly out of the box). The second `overrideParameters` argument (object) can be supplied with any of the same attributes in order to override specific values in your setup:
 
  - `BUILD_ENV = "development"`: environment variable for production or development
  - `SRC_MAIN = "<rootDir>/src/main"`: _full path_ to the folder _below which_ both the main `react4xp` folder and Enonic XP's `resources` and `java` folders are found. 
  - `R4X_HOME = "react4xp"`: main react4xp source _subfolder_ - the name of the subfolder for the core (non-XP-specific) React4xp source code
  - `SRC_R4X = "<SRC_MAIN>/<R4X_HOME>"`: _full path_ to the main react4xp source folder - the source folder for the core  React4XP sourcecode 
  - `SITE = "site"`: the name of the _subfolder_ below `<SRC_MAIN>/resources/` where the XP site structure is found
  - `SRC_SITE = "<SRC_MAIN>/resources/<SITE>"`: _full path_ to the folder where the XP site structure is found
  - `R4X_ENTRY_SUBFOLDER = "_components"`: the name of the _subfolder_ inside the core react4xp folder where react4xp during buildtime will look for general (not bound to specific XP components) entry files (entries are non-shared, first-level components, runnable in both the client and in XP after transpilation)
  - `SRC_R4X_ENTRIES = "<SRC_R4X>/<R4X_ENTRY_SUBFOLDER>"`: _full path_ to the entries source folder
  - `BUILD_MAIN = "<rootDir>/build/resources/main"`: _full path_ to the main target buildtime folder (pre-JAR)
  - `R4X_TARGETSUBDIR = "react4xp"`: name of target react4xp _subfolder_ into which both the React4xp core code and all (both shared and entry) React components will be built. 
  - `BUILD_R4X = "<BUILD_MAIN>/<R4X_TARGETSUBDIR>"`: _full path_ to target folder into which both the React4xp core code and all (both shared and entry) React components will be built. 
  - `RELATIVE_BUILD_R4X = "build/resources/main/<R4X_TARGETSUBDIR>"`: _relative path_ below the project folder, to the target react4xp build folder
  - `LIBRARY_NAME = "React4xp"`: The name of the runnable library, used for runtime calls in both the client and during serverside rendering 
  - `EXTERNALS = { "react": "React", "react-dom": "ReactDOM", "react-dom/server": "ReactDOMServer" }`: externals (non-React4xp, non-vendors) libraries needed to be runtime-available to both client and react serverside-rendering. Defined in `webpack.config.constants.json`, in the EXTERNALS field.  

Includes `webpack.config.constants.json`, for constants that need to be used in more places (and programming languages), and therefore need to be available in a separate and generally-readable file. This file can be overridden so you can roll your own constants JSON file, by supplying the file name (full path) as `JSON_CONSTANTS_FILE` in `overrideParameters`. It's probably better to override this source file than to override only the `EXTERNALS` value above.
