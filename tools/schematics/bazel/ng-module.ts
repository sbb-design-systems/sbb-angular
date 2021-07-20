import { basename, fragment, Path, relative } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  DirEntry,
  forEach,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';

import { BazelModuleFileRegistry } from './bazel-module-file-registry';
import { BazelSchematicContext } from './bazel-schematic-context';
import { formatBazelFile } from './format-bazel-file';
import { SassBinary } from './sass-dependency-resolver';

export class NgModule {
  path: Path;
  name: string;
  moduleName: string;
  hasMarkdown: boolean;
  dependencies: string[];
  genFiles: string[];
  genRules: string[];
  hasTests: boolean;
  testDependencies: string[];
  hasSassLibrary: boolean;
  sassBinaries: SassBinary[];
  stylesheets: string[];
  hasHtml: boolean;
  hasCss: boolean;
  customTsConfig = '';

  protected readonly _fileRegistry = new BazelModuleFileRegistry();
  protected _templateUrl = './files/ngModule';
  private _modules: NgModule[] = [];

  constructor(
    private _dir: DirEntry,
    protected _tree: Tree,
    protected _context: BazelSchematicContext
  ) {
    this.path = this._dir.path;
    this._findFiles(this._dir);
    this.name = basename(this.path);
    const moduleName = relative(this._tree.getDir(this._context.srcRoot).path, this.path);
    this.moduleName = `${this._context.organization}/${moduleName}`;
    this.hasMarkdown = this._dir.subfiles.includes(fragment(`${basename(this.path)}.md`));
    const tsDependencies = this._context.typeScriptDependencyResolver.resolveDependencies(
      this._fileRegistry.tsFiles
    );
    this.dependencies = tsDependencies.dependencies;
    this.genFiles = tsDependencies.files;
    this.genRules = this._context.bazelGenruleResolver.resolveGenrule(this._dir);
    this.hasTests = !!this._fileRegistry.specFiles.length;
    const testDependencies = this._context.typeScriptDependencyResolver.resolveDependencies(
      this._fileRegistry.specFiles,
      ['@npm//@angular/core']
    );
    this.testDependencies = testDependencies.dependencies;
    this.hasSassLibrary = !!this._fileRegistry.scssLibaryFiles.length;
    this.sassBinaries = this._context.sassDependencyResolver.resolveDependencies(
      this._fileRegistry.scssFiles
    );
    this.stylesheets = this.sassBinaries.map((s) => s.path.replace('.scss', '.css'));
    this.hasHtml = !!this._fileRegistry.htmlFiles.length;
    this.hasCss = !!this._fileRegistry.cssFiles.length;
  }

  ngModules(): NgModule[] {
    return this._modules.reduce((current, next) => current.concat(next.ngModules()), [
      this,
    ] as NgModule[]);
  }

  render(): Rule[] {
    return this._modules.reduce(
      (current, next) => current.concat(next.render()),
      [
        mergeWith(
          apply(url(this._templateUrl), [
            applyTemplates(this._templateOptions()),
            move(this.path),
            forEach((fileEntry) => {
              const content = formatBazelFile(
                relative(this._tree.root.path, fileEntry.path),
                fileEntry.content.toString()
              );
              fileEntry = {
                path: fileEntry.path,
                content: Buffer.from(content),
              };
              if (!this._tree.exists(fileEntry.path)) {
                return fileEntry;
              } else if (
                this._tree.read(fileEntry.path)!.toString() !== fileEntry.content.toString()
              ) {
                this._tree.overwrite(fileEntry.path, fileEntry.content);
              }
              return null;
            }),
          ])
        ),
      ]
    );
  }

  protected _templateOptions() {
    return this;
  }

  protected _createSubModule(dir: DirEntry) {
    return new NgModule(dir, this._tree, this._context);
  }

  private _findFiles(dir: DirEntry, skipModuleCheck = true) {
    if (['schematics', 'styles'].some((d) => basename(dir.path) === d)) {
      return;
    } else if (!skipModuleCheck && this._context.moduleDetector.isModuleDirectory(dir)) {
      this._modules.push(this._createSubModule(dir));
      return;
    }

    for (const file of dir.subfiles) {
      this._fileRegistry.add(file, dir);
    }

    dir.subdirs.forEach((d) => this._findFiles(dir.dir(d), false));
  }
}
