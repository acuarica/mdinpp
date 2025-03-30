import { expect } from 'chai';
import { mdpp } from 'mdpp';

const opts = {
    /**
     * @param {string} cmd 
     * @returns {string}
     */
    exec: cmd => `cmd is ${cmd}`,

    /**
     * @param {string} path 
     * @returns {string}
     */
    readFile: path => `1234 ${path}`,
};

describe('asdf', function () {

    [
        { title: 'empty', input: '', output: '\n' },
        { title: 'sdi', input: '\n', output: '\n' },
        { title: 'sdi', input: '\n\n\n  ', output: '\n' },
        {
            title: 'sdi', input: `
\`\`\`js path/to/file
\`\`\`
            `, output: '\n'
        },
    ].forEach(({ title, input, output }) => {
        it(title, function () {
            expect(mdpp(input, opts)).to.be.equal(output);
        });
    })
});
