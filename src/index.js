#!/usr/bin/env node

import { strict } from 'assert';
import { readFileSync } from 'fs';
import c from 'ansi-colors';
import { execSync } from 'child_process';

const MARKERS = /**@type{const}*/ ([
    { begin: /^```\w+ (.+)$/, end: '```' },
    { begin: /^<!-- (.+) -->$/, end: '<!-- -->' },
]);

/**
 * @param {string} input 
 * @param {{exec?: (cmd: string) => string, readFile?: (path: string) => string }} opts
 * @returns {string}
 */
export function mdpp(input, opts = {}) {
    const {
        exec = cmd => execSync(cmd, { encoding: 'utf8' }),
        readFile = path => readFileSync(path, 'utf8'),
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
            process.stdout.write(
                `${c.blue(`[Line ${lineNum}]`)} Opening marker ${c.magenta(marker.file)} .. `
            );
        } else if (marker !== null && trimmedLine === marker.end) {
            write(marker.line);
            let content;
            if (marker.file.startsWith('!')) {
                const parts = marker.file.substring(1).split(' ');
                const bin = parts[0].split('=');
                const [, cmd] = bin.length === 1 ? [bin[0], bin[0]] : [bin[0], bin[1]];

                parts[0] = cmd;
                content = exec(parts.join(' '));
                console.info('exec', c.cyan(marker.file));
            } else {
                content = readFile(marker.file);
                content = content
                    .replace(/\/\* eslint-.+ \*\//g, '')
                    .replace(/^\s*\/\/\s*prettier-ignore$\n/gm, '')
                    .trim();

                console.info('verbatim', c.cyan(marker.file));
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
