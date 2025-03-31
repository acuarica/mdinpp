
/**
 * @type {{[file: string]: string}}
 */
export const readFiles = {
    'path/to/empty': '',
    'path/to/file1': 'single line',
}

export const testCases = [
    { name: 'empty', input: '', output: '\n' },
    { name: 'no new-line', input: 'first line', output: 'first line\n' },
    { name: 'empty line', input: '\n', output: '\n' },
    { name: 'single line', input: 'first line\n', output: 'first line\n' },
    { name: 'only whitespaces', input: '\n\n\n  ', output: '\n' },
    {
        name: 'empty file',
        input: `# Headline
\`\`\`js path/to/empty
\`\`\`
            `,
        output: `# Headline
\`\`\`js path/to/empty

\`\`\`
`,
    },
];
