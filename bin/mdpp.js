#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { mdpp } from 'mdpp';

function main() {
    const args = process.argv.slice(2);

    if (args.length !== 1)
        throw new Error('Invalid number of arguments');

    const input = readFileSync(args[0], 'utf8');
    const output = mdpp(input);

    writeFileSync(args[0], output);
}

main();
