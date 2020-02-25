import { basename, extname, normalize, Path, PathFragment } from '@angular-devkit/core';
import { DirEntry, FileEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Dgeni } from 'dgeni';
import { ReadTypeScriptModules } from 'dgeni-packages/typescript/processors/readTypeScriptModules';
import { TsParser } from 'dgeni-packages/typescript/services/TsParser';
import { readdirSync } from 'fs';
import hljs from 'highlight.js';
import { minify } from 'html-minifier';
import marked from 'marked';
import { join, relative, resolve } from 'path';

import { apiDocsPackage } from './dgeni/docs-package';

export function documentation(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    for (const library of ['angular-core', 'angular-public', 'angular-business', 'angular-maps']) {
      renderHtmlForMarkdownFilesForLibrary(tree, library);
      renderExampleFilesForLibrary(tree, library);
    }

    for (const library of ['angular-keycloak', 'angular-icons']) {
      renderHtmlForMarkdownFilesForLibrary(tree, library);
    }

    await buildApiDocumentationForLibrary([
      'angular-core',
      'angular-public',
      'angular-business',
      'angular-maps'
    ]);
  };
}

function renderHtmlForMarkdownFilesForLibrary(tree: Tree, library: string) {
  const libraryDirectory = tree.getDir(`projects/sbb-esta/${library}`);
  const files = findMarkdownFiles(libraryDirectory);
  files.forEach((entry, path) => {
    const htmlPath = path.replace(/\.md$/, '.html');
    const targetFile = normalize(
      `projects/angular-showcase/src/assets/docs/${library}/${htmlPath}`
    );
    const htmlContent = markdownToHtml(entry.content.toString('utf8'));
    if (tree.exists(targetFile)) {
      tree.overwrite(targetFile, htmlContent);
    } else {
      tree.create(targetFile, htmlContent);
    }
  });
}

function findMarkdownFiles(root: DirEntry) {
  const map = new Map<Path, Readonly<FileEntry>>();
  root.visit((path, entry) => {
    if (extname(path) === '.md' && entry) {
      map.set(basename(path), entry);
    }
  });
  return map;
}

function markdownToHtml(content: string) {
  const html = marked(content, { highlight });
  return minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    caseSensitive: true,
    removeAttributeQuotes: false
  });
}

function renderExampleFilesForLibrary(tree: Tree, library: string) {
  const shortName = library.split('-')[1];
  const examplesDirectory = tree.getDir(
    `projects/angular-showcase/src/app/${shortName}/${shortName}-examples`
  );
  const files = findExampleFiles(examplesDirectory);
  files.forEach((entry, fragment) => {
    const targetFile = normalize(
      `projects/angular-showcase/src/assets/docs/${library}/examples/${fragment}.html`
    );
    const language = extname(fragment).substring(1);
    const htmlContent = highlight(entry.content.toString('utf8'), language);
    if (tree.exists(targetFile)) {
      tree.overwrite(targetFile, htmlContent);
    } else {
      tree.create(targetFile, htmlContent);
    }
  });
}

function findExampleFiles(root: DirEntry) {
  const map = new Map<PathFragment, Readonly<FileEntry>>();
  const fileExtensions = ['.ts', '.scss', '.html'];
  root.visit((path, entry) => {
    if (fileExtensions.includes(extname(path)) && entry) {
      map.set(basename(path), entry);
    }
  });
  return map;
}

function highlight(code: string, language: string): string {
  if (language) {
    // highlight.js expects "typescript" written out, while Github supports "ts".
    const lang = language.toLowerCase() === 'ts' ? 'typescript' : language;
    return hljs.highlight(lang, code).value;
  }

  return code;
}

async function buildApiDocumentationForLibrary(packageNames: string[]) {
  const execRootPath = process.cwd();
  const packagePath = join(execRootPath, 'projects/sbb-esta');
  const outputDirPath = join(execRootPath, `projects/angular-showcase/src/assets/docs/api`);

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

    // For each package we want to setup all entry points in Dgeni so that their API
    // will be generated. Packages and their associated entry points are passed in pairs.
    // The first argument will be always the package name, and the second argument will be a
    // joined string containing names of all entry points for that specific package.
    // e.g. "cdk" "platform,bidi,a11y"
    for (const packageName of packageNames) {
      const sourceDirectory = resolve(__dirname, `../../projects/sbb-esta/${packageName}`);
      const entryPoints = readdirSync(sourceDirectory, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name !== 'svg-icons' && d.name !== 'styles')
        .map(d => d.name);

      // Walk through each entry point of the current package and add it to the
      // "readTypeScriptModules" processor so that it will parse it. Additionally we want
      // to setup path mapping for that entry-point, so that we are able to merge
      // inherited class members across entry points or packages.
      entryPoints.forEach(entryPointName => {
        const entryPointPath = `${packageName}/${entryPointName}`;
        const entryPointIndexPath = `${entryPointPath}/index.ts`;

        // tslint:disable-next-line: no-non-null-assertion
        tsParser.options.paths![`@sbb-esta/${entryPointPath}`] = [entryPointIndexPath];
        readTypeScriptModules.sourceFiles.push(entryPointIndexPath);
      });
    }

    // Base URL for the `tsParser`. The base URL refer to the directory that includes all
    // package sources that need to be processed by Dgeni.
    tsParser.options.baseUrl = packagePath;

    // This is ensures that the Dgeni TypeScript processor is able to parse node modules such
    // as the Angular packages which might be needed for doc items. e.g. if a class implements
    // the "AfterViewInit" interface from "@angular/core". This needs to be relative to the
    // "baseUrl" that has been specified for the "tsParser" compiler options.
    // tslint:disable-next-line: no-non-null-assertion
    tsParser.options.paths!['*'] = [relative(packagePath, join(execRootPath, 'node_modules/*'))];

    // Since our base directory is the Bazel execroot, we need to make sure that Dgeni can
    // find all templates needed to output the API docs.
    templateFinder.templateFolders = [
      join(execRootPath, 'schematics/documentation/dgeni/templates/')
    ];

    // The output path for files will be computed by joining the output folder with the base path
    // from the "readFilesProcessors". Since the base path is the execroot, we can just use
    // the output path passed from Bazel (e.g. $EXECROOT/bazel-out/bin/src/docs-content)
    writeFilesProcessor.outputFolder = outputDirPath;
  });

  const docs = new Dgeni([apiDocsPackage]);
  await docs.generate().catch((e: any) => {
    console.error(e);
    process.exit(1);
  });
}
