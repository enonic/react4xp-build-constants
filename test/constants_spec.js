import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import { getConstants } from '../lib';



describe("constants", ()=>{
    describe(".getConstants", ()=> {

        it("returns an object with constants", () => {
            
            const constants = getConstants(__dirname);
            console.log(JSON.stringify(constants, null, 2));

            /*
            expect( ()=>{
                new DuckFactory("this/is", {}, {
                    notUnique: (state, {ya}) => ({hey: ya}),
                }, true, true);

                new DuckFactory("this/is", {}, {
                    notUnique: (state, {ya}) => ({hey: ya}),
                }, true, true);

            }).to.throw(Error); */
        });
    });
});
