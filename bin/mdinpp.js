#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { EventEmitter } from 'events';
import c from 'ansi-colors';
import { Command } from 'commander';
import packageJson from '../package.json' with { type: 'json' }

import { mdinpp } from 'mdinpp';

function main() {
    const cmd = new Command()
        .version(packageJson.version)
        .description(packageJson.description)
        .argument('<file name>')
        .parse();

    const args = cmd.args;
    const input = readFileSync(args[0], 'utf8');
    const output = mdinpp(input, {
        eventEmitter: /** @type {import('mdinpp').MdinppEventEmitter} */ (new EventEmitter())
            .on('marker', (lineNum, file) => process.stdout.write(`${c.blue(`[Line ${lineNum}]`)} Opening marker ${c.magenta(file)} .. `))
            .on('exec', file => console.info('exec', c.cyan(file)))
            .on('verbatim', file => console.info('verbatim', c.cyan(file)))
    });

    writeFileSync(args[0], output);
}

main();
