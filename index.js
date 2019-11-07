const fs = require('fs');
const Path = require('path');
const FSP = require('fs').promises;
const { execSync } = require('child_process');
const JavaScriptObfuscator = require('javascript-obfuscator');
const glob = require('glob')
const minify = require('html-minifier').minify;

var finished = false;

function createBuildFolder(mainFile, subFolders) {
    return new Promise(async(resolve, reject) => {
        if (await fs.existsSync('./build')) {
            await execSync('rm -r ./build')
            await fs.mkdir('./build', async function (e) {
                console.log('\x1b[32m', 'created new build folder\n')
                await populateBuildFolder(mainFile, subFolders);
                resolve();
            });
        } else {
            await fs.mkdir('./build', async function (e) {
                console.log('\x1b[32m', 'created new build folder\n')
                await populateBuildFolder(mainFile, subFolders);
                resolve();
            });
        }
    });
}

async function populateBuildFolder(mainFile, subFolders) {
    return new Promise(async (resolve, reject) => {
        await fs.copyFile(`${mainFile}`, `./build/${mainFile}`, async (err) => {
            if (err) throw err;
            console.log('\x1b[32m', `${mainFile} was moved...\n`);
        });
        for (var i = 0; i < subFolders.length; i++) {
            var folder = subFolders[i];
            console.log('\x1b[35m', `copying folder: ${folder}`)
            console.log('\x1b[35m', `moving folder: ${folder}\n`)
            await copyDir(`./${folder}`, `./build/${folder}`)
        }
        await obfuscate();
        resolve();
    });
}

async function obfuscate() {
    return new Promise(async (resolve, reject) => {
        await glob("build/**/*.js", false, async function (er, files) {
            await files.map(async file => {
                console.log('\x1b[35m', `obfuscating ${file}...\n`)
                await fs.readFile(file, { encoding: 'utf-8' }, async function (err, data) {
                    if (!err) {
                        let dataset = await JavaScriptObfuscator.obfuscate(data, {
                            compact: true,
                            controlFlowFlattening: true,
                            controlFlowFlatteningThreshold: 1,
                            deadCodeInjection: true,
                            deadCodeInjectionThreshold: 1,
                            debugProtection: true,
                            debugProtectionInterval: true,
                            disableConsoleOutput: true,
                            identifierNamesGenerator: 'hexadecimal',
                            log: false,
                            renameGlobals: false,
                            rotateStringArray: true,
                            selfDefending: true,
                            stringArray: true,
                            stringArrayEncoding: 'rc4',
                            stringArrayThreshold: 1,
                            unicodeEscapeSequence: false
                        })

                        await fs.writeFileSync(file, dataset, (err) => {
                            if (err) console.log('\x1b[32m', err);
                        });
                        console.log('\x1b[36m', `obfuscated ${file}...\n`);
                    } else {
                        console.log('\x1b[32m', err);
                    }
                });
            });
            await minifyer();
            resolve();
        });
    });
}

async function minifyer() {
    return new Promise(async (resolve, reject) => {
        await glob("build/**/*.html", false, async function (er, files) {
            await files.map(async (file, i) => {
                console.log('\x1b[35m', `minifying ${file}...\n`)
                await fs.readFile(file, { encoding: 'utf-8' }, async function (err, data) {
                    if (!err) {
                        let dataset = minify(data, { collapseWhitespace: true, removeComments: true, removeOptionalTags: true, minifyJS: true, minifyCSS: true, minifyURLs: true });
                        await fs.writeFileSync(file, dataset, (err) => {
                            if (err) console.log('\x1b[32m', err);
                        });
                        console.log('\x1b[36m', `minfied ${file}...\n`);
                    } else {
                        console.log('\x1b[32m', err);
                    }
                    if (i == files.length - 1) {
                        finished = true;
                    }
                });
            });
        });
        resolve();
    });
}

async function copyDir(src, dest) {
    return new Promise(async (resolve, reject) => {
        const entries = await FSP.readdir(src, { withFileTypes: true });
        await FSP.mkdir(dest);
        for (let entry of entries) {
            const srcPath = Path.join(src, entry.name);
            const destPath = Path.join(dest, entry.name);
            if (entry.isDirectory()) {
                await copyDir(srcPath, destPath);
            } else {
                await FSP.copyFile(srcPath, destPath);
            }
        }
        resolve();
    })
}


exports.obfuscate = (mainFile, subFolders) => {
    console.log('\x1b[32m', `***THANKS FOR USING THE MODULE - DOLLON***\n`);

    createBuildFolder(mainFile, subFolders)
    return new Promise((resolve, reject) => {
        var int = setInterval(() => {
            if (finished) {
                console.log('\x1b[32m', `***COMPLETE - CHECK BUILD FOLDER FOR THE FILES***\n`);
                clearInterval(int);
                resolve();
            }
        }, 1000)
    });
};