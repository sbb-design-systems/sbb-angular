import { basename, fragment, join, Path, relative, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  DirEntry,
  FileEntry,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { createSourceFile, ImportDeclaration, ScriptTarget, SyntaxKind } from 'typescript';

export function bazel(): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const srcDir = tree.getDir('src');
    return chain(
      srcDir.subdirs
        .filter(d => !d.startsWith('showcase'))
        .map(d => srcDir.dir(d))
        .map(projectDir => {
          const ngModules = findNgModules(projectDir);
          return ngModules
            .map(m => ngModule(m, context))
            .concat(ngPackage(projectDir, context, ngModules));
        })
        .reduce((current, next) => current.concat(next), [] as Rule[])
    );
  };
}

function findNgModules(dir: DirEntry): DirEntry[] {
  const directories = dir.subdirs.map(d => dir.dir(d));
  const modules = directories.filter(d => d.subfiles.includes(fragment('public-api.ts')));
  return directories
    .map(d => findNgModules(d))
    .reduce((current, next) => current.concat(next), modules);
}

function ngModule(dir: DirEntry, context: SchematicContext) {
  context.logger.info(`ng Module ${dir.path}`);
  const bazelifyDependency = (i: string) =>
    i.startsWith('@sbb-esta/') ? i.replace('@sbb-esta/angular-', '//src/') : `@npm//${i}`;
  const dependencies = aggregateModuleImports(dir)
    .map(bazelifyDependency)
    .sort();
  const testDependencies = aggregateModuleImports(dir, false)
    .map(bazelifyDependency)
    .sort();

  return mergeWith(
    apply(url('./files/ngModule'), [
      template({
        name: basename(dir.path),
        // tslint:disable-next-line: no-non-null-assertion
        packageName: basename(dir.parent!.path),
        hasMarkdown: dir.subfiles.includes(fragment(`${basename(dir.path)}.md`)),
        dependencies,
        testDependencies,
        ...findStylesheets(dir, context)
      }),
      move(dir.path)
    ])
  );
}

function aggregateModuleImports(dir: DirEntry, excludeTests = true) {
  const imports: string[] = [];
  dir.visit((path, entry) => {
    if (path.endsWith('.ts') && (!excludeTests || !path.endsWith('.spec.ts')) && entry) {
      imports.push(
        ...findImports(path, entry).filter(i => !i.startsWith('.') && !imports.includes(i))
      );
    }
  });
  return imports;
}

function findImports(path: Path, entry: Readonly<FileEntry>) {
  const file = createSourceFile(
    basename(path),
    entry.content.toString(),
    ScriptTarget.ESNext,
    true
  );
  return findNodes(
    file,
    SyntaxKind.ImportDeclaration,
    undefined,
    true
  ).map((n: ImportDeclaration) => n.moduleSpecifier.getText().replace(/['"]/g, ''));
}

function findStylesheets(dir: DirEntry, context: SchematicContext) {
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
        dependencies: findStylesheetDependencies(dir, entry, context)
      });
    }
  });

  return { stylesheets, sassBinaries, hasSassLibrary };
}

function findStylesheetDependencies(
  dir: DirEntry,
  entry: Readonly<FileEntry>,
  context: SchematicContext
) {
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
        return `//${dir.path}:${basename(dir.path)}_scss_lib`;
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

function ngPackage(dir: DirEntry, context: SchematicContext, ngModules: DirEntry[]) {
  context.logger.info(`ng Package ${dir.path}`);

  return mergeWith(
    apply(url('./files/ngPackage'), [
      template({
        ...strings,
        uc: (s: string) => s.toUpperCase(),
        name: basename(dir.path),
        entryPoints: ngModules.map(m => relative(dir.path, m.path)),
        hasTypography: dir.subfiles.includes(fragment('typography.scss')),
        hasStyles: dir.subfiles.includes(fragment('_styles.scss')),
        hasSchematics: dir.subdirs.includes(fragment('schematics'))
      }),
      move(dir.path)
    ])
  );
}
