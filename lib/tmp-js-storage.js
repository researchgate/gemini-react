'use strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const router = require('./router');
const clientWrapperPath = require.resolve('./client-wrapper');

class TmpJsStorage {
    constructor(options) {
        this._projectRoot = options.projectRoot;
        this._tmpDir = path.join(
            options.projectRoot,
            '.gemini-react-tmp'
        );
    }

    init() {
        mkdirp.sync(this._tmpDir);
    }

    buildFile(testPath) {
        const rootRelative = path.relative(this._projectRoot, testPath);
        const destPath = path.join(
            this._tmpDir,
            router.testPathToChunkName(rootRelative)
        );

        fs.writeFileSync(
            destPath,
            this._getTargetFileConents(destPath, testPath),
            'utf8'
        );
        return destPath;
    }

    cleanup() {
        rimraf.sync(this._tmpDir);
    }

    _getTargetFileConents(destPath, sourcePath) {
        const destDir = path.dirname(destPath);
        const relSource = path.relative(destDir, sourcePath);
        const relWrapper = path.relative(destDir, clientWrapperPath);
        return `
window.geminiReact = require('${relWrapper}');
require('${relSource}');
        `;
    }
}

module.exports = TmpJsStorage;
