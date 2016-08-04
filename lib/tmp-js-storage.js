'use strict';
const temp = require('temp');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const clientWrapperPath = require.resolve('./client-wrapper');

class TmpJsStorage {
    constructor(options) {
        this._tmpDir = path.join(
            path.dirname(options.webpackConfig),
            '.gemini-react-tmp'
        );
    }

    init() {
        mkdirp.sync(this._tmpDir);
    }

    buildFile(suitePath) {
        const destPath = temp.path({
            dir: this._tmpDir,
            suffix: '.js'
        });

        fs.writeFileSync(
            destPath,
            this._getTargetFileConents(destPath, suitePath),
            'utf8'
        );
        return './' + destPath;
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
