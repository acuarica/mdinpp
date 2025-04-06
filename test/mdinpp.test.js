import { expect } from 'chai';
import { mdinpp } from 'mdinpp';
import { EventEmitter } from 'events';

describe('::mdinpp', function () {

    /** @type {{[file: string]: string}} */
    const readFiles = {
        'path/to/empty': '',
        'path/to/file1': 'single line',
    };

    [
        { name: 'empty', input: '', output: '\n', expectedEvents: [] },
        { name: 'no new-line', input: 'first line', output: 'first line\n', expectedEvents: [] },
        { name: 'empty line', input: '\n', output: '\n', expectedEvents: [] },
        { name: 'single line', input: 'first line\n', output: 'first line\n', expectedEvents: [] },
        { name: 'only whitespaces', input: '\n\n\n  ', output: '\n', expectedEvents: [] },
        {
            name: 'empty file',
            input: `# Headline
\`\`\`js path/to/empty
\`\`\`
            `,
            output: `# Headline
\`\`\`js path/to/empty

\`\`\`
`, expectedEvents: [
                'path/to/empty',
                'path/to/empty',
            ]
        },
    ].forEach(({ name, input, output, expectedEvents }) => {
        it(`should preprocess \`${name}\``, function () {
            /** @type{string[]} */
            const events = [];

            expect(mdinpp(input, {
                exec: cmd => `cmd is ${cmd}`,
                readFile: path => readFiles[path],
                eventEmitter: /** @type {import('mdinpp').MdinppEventEmitter} */ (new EventEmitter())
                    .on('marker', (_lineNum, file) => events.push(file))
                    .on('exec', file => events.push(file))
                    .on('verbatim', file => events.push(file))
            })).to.be.equal(output);

            expect(events).to.be.deep.equal(expectedEvents);
        });
    });

});
