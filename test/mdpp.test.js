import { expect } from 'chai';
import { mdpp } from 'mdpp';
import { readFiles, testCases } from './.test-cases.js';

describe('::mdpp', function () {

    testCases.forEach(({ name, input, output }) => {
        it(`should preprocess \`${name}\``, function () {
            expect(mdpp(input, {
                exec: cmd => `cmd is ${cmd}`,
                readFile: path => readFiles[path],
            })).to.be.equal(output);
        });
    });

});
