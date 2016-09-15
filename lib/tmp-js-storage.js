'use strict';
const fs = require('fs');
const path = require('path');
const promisify = require('promisify-node');
const mkdirp = require('mkdirp');
const rimraf = promisify(require('rimraf'));
const router = require('./router');
const clientWrapperPath = require.resolve('./client-wrapper');

class TmpJsStorage {
    constructor(options) {
        this._projectRoot = options.projectRoot;
        this._tmpDir = path.join(
            options.projectRoot,
            '.gemini-react-tmp'
        );
        this._jsModules = options.jsModules;
    }

    init() {
        // TODO: async execution
        mkdirp.sync(this._tmpDir);
    }

    buildFile(testPath) {
        const rootRelative = path.relative(this._projectRoot, testPath);
        const destPath = path.join(
            this._tmpDir,
            router.testPathToChunkName(rootRelative)
        );

        // TODO: async write
        fs.writeFileSync(
            destPath,
            this._getTargetFileContent(destPath, this._jsModules.concat(testPath)),
            'utf8'
        );
        return destPath;
    }

    cleanup() {
        return rimraf(this._tmpDir);
    }

    _getTargetFileContent(destPath, modulesList) {
        const relWrapper = importPath(destPath, clientWrapperPath);
        const requires = buildRequires(destPath, modulesList);
        return `
window.geminiReact = require('${relWrapper}')();
${requires}
        `;
    }
}

function buildRequires(destPath, fileList) {
    return fileList
        .map(filePath => importPath(destPath, filePath))
        .map(importPath => `require('${importPath}')`)
        .join('\n');
}

function importPath(fromPath, importPath) {
    const dir = path.dirname(fromPath);
    return path.relative(dir, importPath);
}
module.exports = TmpJsStorage;
