'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var core = require('@angular-devkit/core');
var hljs = _interopDefault(require('highlight.js'));
var htmlMinifier = require('html-minifier');
var marked = _interopDefault(require('marked'));

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

/*
import { Dgeni } from 'dgeni';
import { ReadTypeScriptModules } from 'dgeni-packages/typescript/processors/readTypeScriptModules';
import { TsParser } from 'dgeni-packages/typescript/services/TsParser';
import { readdirSync } from 'fs';
import { join, relative, resolve } from 'path';

import { apiDocsPackage } from './dgeni';
*/
function documentation(_options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        for (const library of ['angular-public', 'angular-business']) {
            renderHtmlForMarkdownFilesForLibrary(tree, library);
            renderExampleFilesForLibrary(tree, library);
            // await buildApiDocumentationForLibrary(library);
        }
        renderHtmlForMarkdownFilesForLibrary(tree, 'angular-keycloak');
    });
}
function renderHtmlForMarkdownFilesForLibrary(tree, library) {
    const libraryDirectory = tree.getDir(`projects/sbb-esta/${library}`);
    const files = findMarkdownFiles(libraryDirectory);
    files.forEach((entry, path) => {
        const htmlPath = path.replace(/\.md$/, '.html');
        const targetFile = core.normalize(`projects/angular-showcase/src/assets/docs/${library}/${htmlPath}`);
        const htmlContent = markdownToHtml(entry.content.toString('utf8'));
        if (tree.exists(targetFile)) {
            tree.overwrite(targetFile, htmlContent);
        }
        else {
            tree.create(targetFile, htmlContent);
        }
    });
}
function findMarkdownFiles(root) {
    const map = new Map();
    root.visit((path, entry) => {
        if (core.extname(path) === '.md' && entry) {
            map.set(core.basename(path), entry);
        }
    });
    return map;
}
function markdownToHtml(content) {
    const html = marked(content, { highlight });
    return htmlMinifier.minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        caseSensitive: true,
        removeAttributeQuotes: false
    });
}
function renderExampleFilesForLibrary(tree, library) {
    const examplesDirectory = tree.getDir(`projects/angular-showcase/src/app/${library.split('-')[1]}/examples`);
    const files = findExampleFiles(examplesDirectory);
    files.forEach((entry, fragment) => {
        const targetFile = core.normalize(`projects/angular-showcase/src/assets/docs/${library}/examples/${fragment}.html`);
        const language = core.extname(fragment).substring(1);
        const htmlContent = highlight(entry.content.toString('utf8'), language);
        if (tree.exists(targetFile)) {
            tree.overwrite(targetFile, htmlContent);
        }
        else {
            tree.create(targetFile, htmlContent);
        }
    });
}
function findExampleFiles(root) {
    const map = new Map();
    const fileExtensions = ['.ts', '.scss', '.html'];
    root.visit((path, entry) => {
        if (fileExtensions.includes(core.extname(path)) && entry) {
            map.set(core.basename(path), entry);
        }
    });
    return map;
}
function highlight(code, language) {
    if (language) {
        // highlight.js expects "typescript" written out, while Github supports "ts".
        const lang = language.toLowerCase() === 'ts' ? 'typescript' : language;
        return hljs.highlight(lang, code).value;
    }
    return code;
}
/*
@TODO: Blocked by https://github.com/SchweizerischeBundesbahnen/sbb-angular/issues/147
async function buildApiDocumentationForLibrary(packageName: string) {
  const sourceDirectory = resolve(__dirname, `../../projects/sbb-esta/${packageName}/src/lib`);
  const entryPoints = readdirSync(sourceDirectory, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_') && d.name !== 'svg-icons')
    .map(d => d.name);

  const execRootPath = process.cwd();
  const packagePath = join(execRootPath, 'projects/sbb-esta');
  const outputDirPath = join(
    execRootPath,
    `projects/angular-showcase/src/assets/docs/${packageName}/api`
  );

  // Configure the Dgeni docs package to respect our passed options from the Bazel rule.
  apiDocsPackage.config(function(
    readTypeScriptModules: ReadTypeScriptModules,
    tsParser: TsParser,
    templateFinder: any,
    writeFilesProcessor: any,
    readFilesProcessor: any
  ) {
    // Set the base path for the "readFilesProcessor" to the execroot. This is necessary because
    // otherwise the "writeFilesProcessor" is not able to write to the specified output path.
    readFilesProcessor.basePath = execRootPath;

    // Set the base path for parsing the TypeScript source files to the directory that includes
    // all sources (also known as the path to the current Bazel target). This makes it easier for
    // custom processors (such as the `entry-point-grouper) to compute entry-point paths.
    readTypeScriptModules.basePath = packagePath;

    // Initialize the "tsParser" path mappings. These will be passed to the TypeScript program
    // and therefore use the same syntax as the "paths" option in a tsconfig.
    tsParser.options.paths = {};

    // Walk through each entry point of the current package and add it to the
    // "readTypeScriptModules" processor so that it will parse it. Additionally we want
    // to setup path mapping for that entry-point, so that we are able to merge
    // inherited class members across entry points or packages.
    entryPoints.forEach(entryPointName => {
      const entryPointPath = `${packageName}/${entryPointName}`;
      const entryPointIndexPath = `${packageName}/src/lib/${entryPointName}/${entryPointName}.ts`;

      // tslint:disable-next-line: no-non-null-assertion
      tsParser.options.paths![`@sbb-esta/${entryPointPath}`] = [entryPointIndexPath];
      readTypeScriptModules.sourceFiles.push(entryPointIndexPath);
    });

    // Base URL for the `tsParser`. The base URL refer to the directory that includes all
    // package sources that need to be processed by Dgeni.
    tsParser.options.baseUrl = packagePath;

    // This is ensures that the Dgeni TypeScript processor is able to parse node modules such
    // as the Angular packages which might be needed for doc items. e.g. if a class implements
    // the "AfterViewInit" interface from "@angular/core". This needs to be relative to the
    // "baseUrl" that has been specified for the "tsParser" compiler options.
    // tslint:disable-next-line: no-non-null-assertion
    tsParser.options.paths!['*'] = [relative(packagePath, 'external/npm/node_modules/*')];

    // Since our base directory is the Bazel execroot, we need to make sure that Dgeni can
    // find all templates needed to output the API docs.
    templateFinder.templateFolders = [join(execRootPath, 'tools/dgeni/templates/')];

    // The output path for files will be computed by joining the output folder with the base path
    // from the "readFilesProcessors". Since the base path is the execroot, we can just use
    // the output path passed from Bazel (e.g. $EXECROOT/bazel-out/bin/src/docs-content)
    writeFilesProcessor.outputFolder = outputDirPath;
  });

  const docs = new Dgeni([apiDocsPackage]);
  await docs.generate();
}
*/

exports.documentation = documentation;
