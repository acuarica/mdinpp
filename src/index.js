#!/usr/bin/env node

import { strict } from 'assert';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { EventEmitter } from 'events';

const MARKERS = /**@type{const}*/ ([
    { begin: /^```\w+ (.+)$/, end: '```' },
    { begin: /^<!-- (.+) -->$/, end: '<!-- -->' },
]);

/**
 * @typedef {EventEmitter<{marker: [number, string], exec: [string], verbatim: [string]}>} MdinppEventEmitter
 */

/**
 * @param {string} input 
 * @param {Object} opts
 * @param {(cmd: string) => string=} opts.exec
 * @param {(path: string) => string=} opts.readFile
 * @param {MdinppEventEmitter=} opts.eventEmitter
 * @returns {string}
 */
export function mdinpp(input, opts = {}) {
    const {
        exec = cmd => execSync(cmd, { encoding: 'utf8' }),
        readFile = path => readFileSync(path, 'utf8'),
        eventEmitter = new EventEmitter(),
    } = opts;

    /** @type {{line: string, file: string, end: typeof MARKERS[number]['end']} | null} */
    let marker = null;
    let output = '';
    const write = (/** @type string */ line) => (output += line + '\n');

    let lineNum = 0;
    for (const line of input.split('\n')) {
        lineNum++;
        const trimmedLine = line.trimEnd();
        const found = MARKERS.map(marker => ({
            ...marker,
            match: trimmedLine.match(marker.begin),
        })).find(({ match }) => match !== null);
        if (found !== undefined && marker === null) {
            strict(found.match !== null);
            marker = { line: trimmedLine, file: found.match[1], end: found.end };
            eventEmitter.emit('marker', lineNum, marker.file);
        } else if (marker !== null && trimmedLine === marker.end) {
            write(marker.line);
            let content;
            if (marker.file.startsWith('!')) {
                const parts = marker.file.substring(1).split(' ');
                const bin = parts[0].split('=');

                if (bin.length === 1) {
                    parts[0] = bin[0];
                } else if (marker.end === '```') {
                    parts[0] = bin[0];
                    write(`$ ${parts.join(' ')}`);
                    parts[0] = bin[1];
                }

                content = exec(parts.join(' '));
                eventEmitter.emit('exec', marker.file);
            } else {
                content = readFile(marker.file);
                content = content
                    .replace(/\/\* eslint-.+ \*\//g, '')
                    .replace(/^\s*\/\/\s*prettier-ignore$\n/gm, '')
                    .trim();

                eventEmitter.emit('verbatim', marker.file);
            }
            write(content);
            write(marker.end);

            marker = null;
        } else if (marker === null) {
            write(line);
        }
    }

    return output.trimEnd() + '\n';
}
