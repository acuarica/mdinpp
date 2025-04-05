#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { EventEmitter } from 'events';
import c from 'ansi-colors';

import { mdinpp } from 'mdinpp';

function main() {
    const args = process.argv.slice(2);

    if (args.length !== 1)
        throw new Error('Invalid number of arguments');

    const input = readFileSync(args[0], 'utf8');
    const output = mdinpp(input, {
        eventEmitter: /** @type {import('mdinpp').MdppEventEmitter} */ (new EventEmitter())
            .on('marker', (lineNum, file) => process.stdout.write(`${c.blue(`[Line ${lineNum}]`)} Opening marker ${c.magenta(file)} .. `))
            .on('exec', file => console.info('exec', c.cyan(file)))
            .on('verbatim', file => console.info('verbatim', c.cyan(file)))
    });

    writeFileSync(args[0], output);
}

main();
