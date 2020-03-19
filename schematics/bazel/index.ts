import {
  basename,
  dirname,
  fragment,
  join,
  Path,
  relative,
  split,
  strings
} from '@angular-devkit/core';
import {
  apply,
  chain,
  DirEntry,
  FileEntry,
  forEach,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import {
  createSourceFile,
  ExportDeclaration,
  ImportDeclaration,
  ScriptTarget,
  SyntaxKind
} from 'typescript';

export function bazel(): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const srcDir = tree.getDir('src');
    return chain(
      srcDir.subdirs
        .filter(d => !d.startsWith('showcase'))
        .map(d => srcDir.dir(d))
        .map(projectDir => {
          const ngModules = findNgModules(projectDir);
          return ngModules.map(m => ngModule(m)).concat(ngPackage(projectDir, ngModules));
        })
        .reduce((current, next) => current.concat(next), [] as Rule[])
    );

    function findNgModules(dir: DirEntry): DirEntry[] {
      const directories = dir.subdirs.map(d => dir.dir(d));
      const modules = directories.filter(d => d.subfiles.includes(fragment('public-api.ts')));
      return directories
        .map(d => findNgModules(d))
        .reduce((current, next) => current.concat(next), modules);
    }

    function ngModule(dir: DirEntry) {
      const packageName = split(dir.path)[2];
      const moduleName = relative(srcDir.dir(packageName).path, dir.path);
      const { dependencies, testDependencies, hasTests } = resolveModuleTsInfo(dir);
      if (dir.path.includes('src/maps')) {
        dependencies.push('@npm//@types/arcgis-js-api');
        dependencies.sort();
      } else if (dir.path.includes('captcha')) {
        dependencies.push('@npm//@types/grecaptcha');
        dependencies.sort();
      }
      return mergeWith(
        apply(url('./files/ngModule'), [
          template({
            name: basename(dir.path),
            moduleName: `@sbb-esta/angular-${packageName}/${moduleName}`,
            hasMarkdown: moduleHasMarkdown(dir),
            dependencies,
            testDependencies,
            hasTests,
            customTsConfig: '',
            ...findStylesheets(dir)
          }),
          move(dir.path),
          overwriteIfExists()
        ])
      );
    }

    function ngPackage(dir: DirEntry, ngModules: DirEntry[]) {
      const resolvePath = (m: DirEntry) => relative(dir.path, m.path);
      const hasSrcFiles = dir.subdirs.includes(fragment('src'));
      const { dependencies, testDependencies, hasTests } = hasSrcFiles
        ? resolveModuleTsInfo(dir.dir(fragment('src')))
        : { dependencies: [], testDependencies: [], hasTests: false };
      return mergeWith(
        apply(url('./files/ngPackage'), [
          template({
            ...strings,
            uc: (s: string) => s.toUpperCase(),
            name: basename(dir.path),
            entryPoints: ngModules.map(resolvePath),
            dependencies,
            testDependencies,
            hasTests,
            customTsConfig: '',
            hasReadme: dir.subfiles.includes(fragment('README.md')),
            hasSchematics: dir.subdirs.includes(fragment('schematics')),
            hasSrcFiles,
            hasStyles: dir.subfiles.includes(fragment('_styles.scss')),
            hasTypography: dir.subfiles.includes(fragment('typography.scss')),
            markdownFiles: dir.subfiles.filter(f => f.endsWith('.md')),
            markdownModules: ngModules.filter(m => moduleHasMarkdown(m)).map(resolvePath)
          }),
          move(dir.path),
          overwriteIfExists()
        ])
      );
    }

    function resolveModuleTsInfo(dir: DirEntry) {
      const dependencies = aggregateModuleImports(dir);
      const testDependencies = aggregateModuleImports(dir, false).filter(
        i => !dependencies.includes(i)
      );
      return {
        dependencies,
        testDependencies,
        hasTests: moduleHasTests(dir)
      };
    }

    function aggregateModuleImports(dir: DirEntry, excludeTests = true) {
      const imports: string[] = [];
      dir.visit((path, entry) => {
        if (
          path.endsWith('.ts') &&
          (!excludeTests || !path.endsWith('.spec.ts')) &&
          isInSameModule(dir, path) &&
          entry
        ) {
          for (const importPath of findImportsAndReexports(path, entry).map(convertToDependency)) {
            if (importPath && !imports.includes(importPath) && importPath !== `/${dir.path}`) {
              imports.push(importPath);
            }
          }
        }
      });
      return imports.sort();
    }

    function findImportsAndReexports(path: Path, entry: Readonly<FileEntry>) {
      const file = createSourceFile(
        basename(path),
        entry.content.toString(),
        ScriptTarget.ESNext,
        true
      );
      return findNodes(file, SyntaxKind.ImportDeclaration, undefined, true)
        .concat(findNodes(file, SyntaxKind.ExportDeclaration, undefined, true))
        .map(
          (n: ImportDeclaration | ExportDeclaration) =>
            n.moduleSpecifier?.getText().replace(/['"]/g, '') ?? ''
        );
    }

    function convertToDependency(importPath: string) {
      if (importPath.startsWith('@sbb-esta/')) {
        return importPath.replace('@sbb-esta/angular-', '//src/');
      } else if (importPath.startsWith('.')) {
        return '';
      } else {
        const index = importPath.startsWith('@') ? 2 : 1;
        return `@npm//${importPath.split('/', index).join('/')}`;
      }
    }

    function findStylesheets(dir: DirEntry) {
      const stylesheets: string[] = [];
      const sassBinaries: Array<{ name: string; path: string; dependencies: string[] }> = [];
      let hasSassLibrary = false;
      dir.visit((path, entry) => {
        if (!path.endsWith('.scss') || !entry) {
          return;
        } else if (basename(path).startsWith('_')) {
          hasSassLibrary = true;
        } else {
          const stylesheetPath = relative(dir.path, path);
          stylesheets.push(stylesheetPath.replace('.scss', '.css'));
          sassBinaries.push({
            name: stylesheetPath.replace(/[^a-z0-9]/g, '_'),
            path: stylesheetPath,
            dependencies: findStylesheetDependencies(dir, entry)
          });
        }
      });

      return { stylesheets, sassBinaries, hasSassLibrary };
    }

    function findStylesheetDependencies(dir: DirEntry, entry: Readonly<FileEntry>) {
      const matches = entry.content.toString().match(/@import '([^']+)';/g);
      if (!matches) {
        return [];
      }
      return matches
        .map(s => s.substring(9, s.length - 2))
        .map(i => {
          if (i.includes('/core/styles/common')) {
            return '//src/core/styles:common_scss_lib';
          } else if (isInModule(join(entry.path, i), dir.path)) {
            return `:${basename(dir.path)}_scss_lib`;
          } else {
            context.logger.warn(`${entry.path}: Could not resolve stylesheet import '${i}'`);
            return '';
          }
        })
        .filter(d => !!d);
    }

    function isInModule(path: Path, modulePath: Path): boolean {
      return !relative(modulePath, path).startsWith('..');
    }

    function moduleHasTests(dir: DirEntry) {
      let hasTests = false;
      dir.visit(path => {
        if (isInSameModule(dir, path) && path.endsWith('.spec.ts')) {
          hasTests = true;
        }
      });
      return hasTests;
    }

    function isInSameModule(dir: DirEntry, path: Path) {
      const directoryParts = split(dirname(relative(dir.path, path)));
      for (const part of directoryParts) {
        dir = dir.dir(part);
        if (dir.subfiles.includes(fragment('public-api.ts'))) {
          return false;
        }
      }

      return true;
    }

    function moduleHasMarkdown(dir: DirEntry) {
      return dir.subfiles.includes(fragment(`${basename(dir.path)}.md`));
    }

    function overwriteIfExists(): Rule {
      return forEach(fileEntry => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
          return null;
        }
        return fileEntry;
      });
    }
  };
}
