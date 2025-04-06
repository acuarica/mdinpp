import { expect, use } from 'chai';
import chaiExec from '@jsdevtools/chai-exec';

use(chaiExec);

chaiExec.defaults = {
    command: 'bin/mdinpp.js'
}

describe('::bin', () => {
    it('should exit with a non-zero exit code', () => {
        const cli = chaiExec('');

        expect(cli).stderr.to.be.not.empty;
        expect(cli).stdout.to.be.empty;
        expect(cli).to.exit.with.code(1);
    });

    it('should exit with a non-zero exit code with multiple args', () => {
        const cli = chaiExec('--arg1 --arg2 "some other arg"');

        expect(cli).stderr.to.be.not.empty;
        expect(cli).stdout.to.be.empty;
        expect(cli).to.exit.with.code(1);
    });
});
