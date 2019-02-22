import path from 'path';
import { expect } from 'chai';

import getConstants from '../lib';

const DIR_NAME = __dirname; // eslint-disable-line no-undef

describe("constants", ()=>{
    describe(".getConstants", ()=> {

        it("returns an object with constants", () => {
            const constants = getConstants(DIR_NAME);
            console.log("constants: " + JSON.stringify(constants, null, 2));

            // Sampling some values, not all
            expect(constants.SRC_R4X_ENTRIES).to.equal(path.join(DIR_NAME, "src", "main", "react4xp", "_components"));
            expect(constants.BUILD_R4X).to.equal(path.join(DIR_NAME, "build", "resources", "main", "react4xp"));
            expect(constants.LIBRARY_NAME).to.equal("React4xp");
            expect(constants.BUILD_ENV).to.equal("development");
            expect(constants.EXTERNALS["react-dom/server"]).to.equal("ReactDOMServer");
        });


        it("can override single values by supplying path to a JSON file with an object with same-name attributes", () => {
            const constants = getConstants(
                DIR_NAME,
                path.join(DIR_NAME, "override.json")
            );
            console.log("constants with override: " + JSON.stringify(constants, null, 2));

            expect(constants.BUILD_ENV).to.equal("production");
            expect(constants.EXTERNALS["react-dom/server"]).to.equal(undefined);
            expect(constants.EXTERNALS["foo"]).to.equal("foofoo");
            expect(constants.EXTERNALS["bar"]).to.equal("barbar");
        });


        it("can supply an overriding-constants-JSON-file path without affecting other constants", () => {
            const constants = getConstants(
                DIR_NAME,
                path.join(DIR_NAME, "override.json")
            );

            // Sampling some other values, that they're not changed
            expect(constants.SRC_R4X_ENTRIES).to.equal(path.join(DIR_NAME, "src", "main", "react4xp", "_components"));
            expect(constants.BUILD_R4X).to.equal(path.join(DIR_NAME, "build", "resources", "main", "react4xp"));
            expect(constants.LIBRARY_NAME).to.equal("React4xp");
        });
    });
});
