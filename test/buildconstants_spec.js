import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

import buildConstants from '../lib';
const ensureTargetOutputPathExists = require('../src/ensureTargetOutputPathExists');

const DIR_NAME = __dirname; // eslint-disable-line no-undef



describe("constants", ()=>{
    describe(".buildConstants", ()=> {

        const EXPECTED_DEFAULT_OUTPUT = deepFreeze({
            BUILD_ENV: "development",
            LIBRARY_NAME: "React4xp",
            SITE_SUBFOLDER: "site",
            SRC_SITE: path.join(DIR_NAME, 'src', 'main', 'resources', 'site'),
            R4X_ENTRY_SUBFOLDER: "_components",
            R4X_HOME: "react4xp",
            R4X_TARGETSUBDIR: "react4xp",
            SRC_R4X: path.join(DIR_NAME, 'src', 'main', 'react4xp'),
            SRC_R4X_ENTRIES: path.join(DIR_NAME, 'src', 'main', 'react4xp', '_components'),
            RELATIVE_BUILD_R4X: path.join('build', 'resources', 'main', 'react4xp'),
            BUILD_MAIN: path.join(DIR_NAME, 'build', 'resources', 'main'),
            BUILD_R4X: path.join(DIR_NAME, 'build', 'resources', 'main', 'react4xp'),
            EXTERNALS: {
                "react": "React",
                "react-dom": "ReactDOM",
                "react-dom/server": "ReactDOMServer",
            },

            recommended: {
                buildEntriesAndChunks: {
                    ENTRY_SETS: [
                        {
                            sourcePath: path.join(DIR_NAME, 'src', 'main', 'react4xp', '_components'),
                            sourceExtensions: ["jsx", "js", "es6"],
                        },
                        {
                            sourcePath: path.join(DIR_NAME, 'src', 'main', 'resources', 'site'),
                            sourceExtensions: ["jsx"],
                            targetSubDir: "site",
                        },
                    ],
                },
            },
        });

        const TEST_OUTPUT_ROOT = path.join(DIR_NAME, "output");





        before(()=>{
            rimraf.sync(TEST_OUTPUT_ROOT);
        });

        after(()=>{
            //rimraf.sync(TEST_OUTPUT_ROOT);
        });





        it("builds a constants file with the specified output name, if the output file or path doesn't exist", () => {
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "built_constants.json");
            
            buildConstants(
                DIR_NAME,
                outputFileName, 
                // {verbose: true}
            );
            
            const actualOutput = require(outputFileName);

            delete actualOutput['__meta__'];
            expect(actualOutput).to.deep.equal(EXPECTED_DEFAULT_OUTPUT);
        });


        it("leaves an existing output file intact instead of replacing it", () => {
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "existing_constants.json");
            
            ensureTargetOutputPathExists(outputFileName);
            fs.writeFileSync(outputFileName, '{"thisIsThe":"previousContent"}');
            
            buildConstants(
                DIR_NAME,
                outputFileName, 
                //{verbose: true}
            );
            
            const actualOutput = deepFreeze(require(outputFileName));

            const expectedOutput = deepFreeze(
                {thisIsThe:"previousContent"}
            );

            expect(actualOutput).to.deep.equal(expectedOutput);
        });


        it("overwrites any existing output file iff 'overwriteConstantsFile' in the overrides object is set to true", () => {
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "overwrite_constants.json");
            
            ensureTargetOutputPathExists(outputFileName);
            fs.writeFileSync(outputFileName, '{"thisIsThe":"previousContent"}');
            
            buildConstants(
                DIR_NAME,
                outputFileName, 
                {
                    //verbose: true,
                    overwriteConstantsFile: true,
                }
            );
            
            const actualOutput = require(outputFileName);

            delete actualOutput['__meta__'];
            expect(actualOutput).to.deep.equal(EXPECTED_DEFAULT_OUTPUT);
        });


        it("adds a .json extension to the output file name if there is none", () => {
            const outputFileNameRaw = path.join(TEST_OUTPUT_ROOT, "deep", "path", "addjson_constants");
            const outputFileNameJSON = outputFileNameRaw + ".json";

            buildConstants(
                DIR_NAME,
                outputFileNameRaw, 
                //{ verbose: true, }
            );

            const actualOutput = require(outputFileNameJSON);

            delete actualOutput['__meta__'];
            expect(actualOutput).to.deep.equal(EXPECTED_DEFAULT_OUTPUT);
        });


        it("puts the output file in the project path (rootDir) if outputFileName is only a filename, not a path", () => {
            const outputFileName = "purefilename_constants.json";

            buildConstants(

                // Changing the rootDir arg to avoid putting the output file right here.
                // That will affect the file content of course, different expectations below.
                TEST_OUTPUT_ROOT,

                outputFileName, 
                //{ verbose: true, }
            );

            const actualOutput = deepFreeze(require(path.join(TEST_OUTPUT_ROOT, outputFileName)));
            
            // Just sampling a few unchanged ones
            expect(actualOutput.LIBRARY_NAME).to.equal(EXPECTED_DEFAULT_OUTPUT.LIBRARY_NAME);
            expect(actualOutput.R4X_ENTRY_SUBFOLDER).to.equal(EXPECTED_DEFAULT_OUTPUT.R4X_ENTRY_SUBFOLDER);
            expect(actualOutput.EXTERNALS).to.deep.equal(EXPECTED_DEFAULT_OUTPUT.EXTERNALS);

            // Just sampling two changed ones
            expect(actualOutput.BUILD_R4X).to.equal(path.join(TEST_OUTPUT_ROOT, 'build', 'resources', 'main', 'react4xp'),);
            expect(actualOutput.SRC_R4X).to.equal(path.join(TEST_OUTPUT_ROOT, 'src', 'main', 'react4xp'));
        });




        it("allows direct override of selected values", () => {
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "override_direct_constants.json");
            
            buildConstants(
                DIR_NAME,
                outputFileName, 
                {
                    R4X_ENTRY_SUBFOLDER: "thisWasPreviously_components",
                    SITE_SUBFOLDER: "thisWasPreviouslySite",
                    //verbose: true,
                }
            );
            
            const actualOutput = deepFreeze(require(outputFileName));
            
            // Just sampling a few unchanged ones
            expect(actualOutput.LIBRARY_NAME).to.equal(EXPECTED_DEFAULT_OUTPUT.LIBRARY_NAME);
            expect(actualOutput.EXTERNALS).to.deep.equal(EXPECTED_DEFAULT_OUTPUT.EXTERNALS);

            // The two directly changed ones
            expect(actualOutput.R4X_ENTRY_SUBFOLDER).to.equal("thisWasPreviously_components");
            expect(actualOutput.SITE_SUBFOLDER).to.equal("thisWasPreviouslySite");
        });




        it("changes derived values from overriden ones", () => {
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "override_derived_constants.json");
            
            buildConstants(
                DIR_NAME,
                outputFileName, 
                {
                    R4X_HOME: "thisWasPreviouslyReact4xp",
                    SITE_SUBFOLDER: "thisWasPreviouslySite",
                    //verbose: true
                }
            );
            
            const actualOutput = deepFreeze(require(outputFileName));

            // Just sampling a few unchanged ones
            expect(actualOutput.LIBRARY_NAME).to.equal(EXPECTED_DEFAULT_OUTPUT.LIBRARY_NAME);
            expect(actualOutput.EXTERNALS).to.deep.equal(EXPECTED_DEFAULT_OUTPUT.EXTERNALS);
            expect(actualOutput.RELATIVE_BUILD_R4X).to.equal(EXPECTED_DEFAULT_OUTPUT.RELATIVE_BUILD_R4X);

            // All the derived changes:
            expect(actualOutput.SRC_R4X).to.equal(path.join(DIR_NAME, 'src', 'main', 'thisWasPreviouslyReact4xp'));
            expect(actualOutput.SRC_R4X_ENTRIES).to.equal(path.join(DIR_NAME, 'src', 'main', 'thisWasPreviouslyReact4xp', '_components'),);
            expect(actualOutput.SRC_SITE).to.equal(path.join(DIR_NAME, 'src', 'main', 'resources', 'thisWasPreviouslySite'));
        });




        it("can override specific derived values without changing the basic ones", () => {
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "override_specific_constants.json");
            
            buildConstants(
                DIR_NAME,
                outputFileName, 
                {
                    SRC_SITE: "thisShouldBeAnEntireOverwrittenSrcSitePath",
                    //verbose: true
                }
            );
            
            const actualOutput = deepFreeze(require(outputFileName));

            // Just sampling a few unchanged ones
            expect(actualOutput.LIBRARY_NAME).to.equal(EXPECTED_DEFAULT_OUTPUT.LIBRARY_NAME);
            expect(actualOutput.EXTERNALS).to.deep.equal(EXPECTED_DEFAULT_OUTPUT.EXTERNALS);
            expect(actualOutput.RELATIVE_BUILD_R4X).to.equal(EXPECTED_DEFAULT_OUTPUT.RELATIVE_BUILD_R4X);
            expect(actualOutput.SRC_R4X).to.equal(EXPECTED_DEFAULT_OUTPUT.SRC_R4X);
            expect(actualOutput.SRC_R4X_ENTRIES).to.equal(EXPECTED_DEFAULT_OUTPUT.SRC_R4X_ENTRIES);
            // ...and notably:
            expect(actualOutput.SITE_SUBFOLDER).to.equal(EXPECTED_DEFAULT_OUTPUT.SITE_SUBFOLDER);
            
            // All the derived changes:
            expect(actualOutput.SRC_SITE).to.equal("thisShouldBeAnEntireOverwrittenSrcSitePath"); 
        });




        it("can also accept the 'overrides' parameter as a JSON-parseable string", ()=>{
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "override_jsonstring_constants.json");

            const overrides = '{' +
                '"R4X_ENTRY_SUBFOLDER": "thisWasPreviously_components", ' +
                '"SITE_SUBFOLDER": "thisWasPreviouslySite", ' +
                '"EXTERNALS": {' +
                '"foo": "foofoo",' +
                '"bar": "barbar"' +
                '}' +
                // ', "verbose": true ' +
                '}';

            buildConstants(
                DIR_NAME,
                outputFileName,
                overrides,
            );

            const actualOutput = deepFreeze(require(outputFileName));

            // Just sampling a few unchanged ones
            expect(actualOutput.LIBRARY_NAME).to.equal(EXPECTED_DEFAULT_OUTPUT.LIBRARY_NAME);
            expect(actualOutput.BUILD_ENV).to.deep.equal(EXPECTED_DEFAULT_OUTPUT.BUILD_ENV);

            // The two directly changed ones
            expect(actualOutput.R4X_ENTRY_SUBFOLDER).to.equal("thisWasPreviously_components");
            expect(actualOutput.SITE_SUBFOLDER).to.equal("thisWasPreviouslySite");
            expect(actualOutput.EXTERNALS).to.deep.equal({
                foo: "foofoo",
                bar: "barbar",
            });
        });




        it("fails if overrides is an invalid JSON string", ()=>{
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "bad_jsonstring_constants.json");

            const overrides = '{' +
                '"R4X_ENTRY_SUBFOLDER": "thisWasPreviously_components", ' +
                '"SITE_SUBFOLDER: "thisWasPreviouslySite", ' +
                // ', "verbose": true ' +
                '}';

            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    outputFileName,
                    overrides,
                );
            }).to.throw(Error);


            expect(fs.existsSync(outputFileName)).to.equal(false);
        });


        it("fails if overrides (JSON string or object) is valid but not object format", ()=>{
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "bad_jsonstring_constants.json");

            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    outputFileName,
                    '[ "R4X_ENTRY_SUBFOLDER", "SITE_SUBFOLDER" ]',
                );
            }).to.throw(Error);

            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    outputFileName,
                    [ "R4X_ENTRY_SUBFOLDER", "SITE_SUBFOLDER" ],
                );
            }).to.throw(Error);

            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    outputFileName,
                    3,
                );
            }).to.throw(Error);

            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    outputFileName,
                    true,
                );
            }).to.throw(Error);

            expect(fs.existsSync(outputFileName)).to.equal(false);
        });


        it("fails if rootDir points to a path that doesn't exist", ()=>{
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "noexist_constants.json");

            const noExistPath = path.join(TEST_OUTPUT_ROOT, "noExist");
            rimraf.sync(noExistPath);

            expect(()=>{
                buildConstants(
                    noExistPath,
                    outputFileName,
                    //{verbose:true},
                );
            }).to.throw(Error);

            expect(fs.existsSync(outputFileName)).to.equal(false);

            expect(()=>{
                buildConstants(
                    undefined,
                    outputFileName,
                    //{verbose:true},
                );
            }).to.throw(Error);
        });


        it("fails if rootDir points to a file", ()=>{
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "deep", "path", "isfile_constants.json");

            const fileExistPath = path.join(TEST_OUTPUT_ROOT, "thisIsAFile");
            fs.writeFileSync(fileExistPath, "Yep, a file all right.");

            expect(()=>{
                buildConstants(
                    fileExistPath,
                    outputFileName,
                    //{verbose:true},
                );
            }).to.throw(Error);

            expect(fs.existsSync(outputFileName)).to.equal(false);
        });


        it("fails if outputFile name parameter is empty or missing", ()=>{
            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    "",
                    //{verbose:true},
                );
            }).to.throw(Error);

            expect(()=>{
                buildConstants(DIR_NAME);
            }).to.throw(Error);
        });




        it("fails if outputFile points to a directory", ()=>{
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "thisisDirectory_constants.json");

            ensureTargetOutputPathExists(path.join(outputFileName, "dummy"), function () {});
            expect(fs.lstatSync(outputFileName).isDirectory()).to.equal(true);

            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    outputFileName,
                    //{verbose:true},
                );
            }).to.throw(Error);

            expect(fs.lstatSync(outputFileName).isDirectory()).to.equal(true);
        });



        it("fails if outputFile has a parent path that's not directory", ()=>{
            const outputFileName = path.join(TEST_OUTPUT_ROOT, "thisIsAlsoAFile", "parentisfile_constants.json");

            const fileExistPath = path.join(TEST_OUTPUT_ROOT, "thisIsAlsoAFile");
            fs.writeFileSync(fileExistPath, "Indeed, 'tis a file.");

            expect(()=>{
                buildConstants(
                    DIR_NAME,
                    outputFileName,
                    //{verbose:true},  t
                );
            }).to.throw(Error);

            expect(fs.existsSync(outputFileName)).to.equal(false);
        });
    });
});
