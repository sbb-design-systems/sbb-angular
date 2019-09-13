'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function exampleMigration(_options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        const examples = tree.getDir('projects/angular-showcase/src/app/public/examples');
        const targetDir = tree.getDir('projects/angular-showcase/src/app/public/public-examples');
        const moduleFile = targetDir.file(core.fragment('public-examples.module.ts'));
        // tslint:disable-next-line: no-non-null-assertion
        let moduleContent = moduleFile.content.toString('utf8');
        for (const dir of examples.subdirs) {
            const directory = examples.dir(dir);
            const renamed = `simple-${dir.replace('-showcase', '')}-example`;
            directory.visit((path, entry) => {
                if (entry) {
                    const rel = core.relative(directory.path, path).replace(dir, renamed);
                    const originalComponentName = componentName(dir);
                    const renamedComponentName = componentName(renamed);
                    const content = entry.content
                        .toString('utf8')
                        .replace(new RegExp(dir, 'g'), renamed)
                        .replace(originalComponentName, renamedComponentName);
                    const target = core.join(targetDir.path, renamed, rel);
                    if (tree.exists(target)) {
                        tree.overwrite(target, content);
                    }
                    else {
                        tree.create(target, content);
                        moduleContent = moduleContent
                            .replace(`${dir}/${dir}.component`, `${renamed}/${renamed}.component`)
                            .replace(new RegExp(originalComponentName, 'g'), renamedComponentName);
                    }
                }
            });
        }
        // tslint:disable-next-line: no-non-null-assertion
        tree.overwrite(moduleFile.path, moduleContent);
    });
}
function componentName(name) {
    const pascalCase = name.replace(/(^[a-z]|-[a-z])/g, m => m.replace('-', '').toUpperCase());
    return `${pascalCase}Component`;
}

exports.exampleMigration = exampleMigration;
