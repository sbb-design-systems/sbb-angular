import { basename, fragment, Path, relative } from '@angular-devkit/core';
import {
  apply,
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
    context.logger.info('Start');
    const srcDir = tree.getDir('src');
    for (const projectDir of srcDir.subdirs
      .filter(d => !d.startsWith('showcase'))
      .map(d => srcDir.dir(d))) {
      for (const moduleDir of findNonFlatModules(projectDir)) {
        context.logger.info(moduleDir.path);
        await ngModule(moduleDir, context);
      }

      await ngPackage(projectDir, context);
    }
  };
}

function findNonFlatModules(dir: DirEntry): DirEntry[] {
  const directories = dir.subdirs.map(d => dir.dir(d));
  const modules = directories.filter(d => d.subfiles.includes(fragment('public-api.ts')));
  return directories
    .map(d => findNonFlatModules(d))
    .reduce((current, next) => current.concat(next), modules);
}

async function ngModule(dir: DirEntry, context: SchematicContext) {
  // tslint:disable-next-line: no-non-null-assertion
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
        dependencies,
        testDependencies,
        ...findStylesheets(dir)
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

function findStylesheets(dir: DirEntry) {
  const stylesheets: string[] = [];
  const sassBinaries: Array<{ name: string; path: string; dependencies: string[] }> = [];
  const sassLibraries: Array<{ name: string; path: string; dependencies: string[] }> = [];
  dir.visit((path, entry) => {
    if (!path.endsWith('.scss') || !entry) {
      return;
    } else if (basename(path).startsWith('_')) {
      stylesheets.push(relative(dir.path, path));
    } else {
      stylesheets.push(relative(dir.path, path));
    }
  });

  return { stylesheets, sassBinaries, sassLibraries };
}

async function ngPackage(dir: DirEntry, context: SchematicContext) {
  context.logger.info(`ng Package ${dir.path}`);
}
