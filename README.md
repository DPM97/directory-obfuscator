# directory-obfuscator
easier way to obfuscate and minify your entire javascript package

[![npm version](https://badge.fury.io/js/directory-obfuscator.svg)](https://badge.fury.io/js/directory-obfuscator)

## Implementation
```
const obfuscator = require('directory-obfuscator');

//example entryFile
let entryFile = 'index.js';

//example folders
let subFolders = [
"img",
"process1",
"process2",
"public"
]

//throw it in a await / promise if you need it to finish before moving on
obfuscator.obfuscate(entryFile, subFolders);
```


**********IN PACKAGE.JSON***********

Set main to the build folder
```
"main": "build/index.js",
```
Create a run script that performs 'sudo node buildFile.js' (sudo on mac only)


## Electron-Builder Implementation

```
  "build": {
    "asar": false,
    "productName": "Name",
    "appId": "com.name.name",
    "files": [
      "!**/*",
      "build",
      "node_modules"
    ],
    "mac": {
      "target": "zip",
      "icon": "icon.png"
    },
    "win": {
      "icon": "icon.png"
    },
    "nsis": {
      "createDesktopShortcut": "always"
    }
  }
  ```
  
  Create a run script that performs 'sudo node buildFile.js && electron-builder --mac' (or --win for the windows build) in package.json
  
