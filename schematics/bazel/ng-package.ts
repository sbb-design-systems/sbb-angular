import { basename, fragment, relative, strings } from '@angular-devkit/core';
import { DirEntry, SchematicContext, Tree } from '@angular-devkit/schematics';

import { NgModule } from './ng-module';

export class NgPackage extends NgModule {
  entryPoints: string[];
  hasReadme: boolean;
  hasSchematics: boolean;
  hasSrcFiles: boolean;
  hasStyles: boolean;
  hasTypography: boolean;
  markdownFiles: string[];
  markdownModules: string[];

  protected _templateUrl = './files/ngPackage';

  constructor(dir: DirEntry, tree: Tree, context: SchematicContext) {
    super(dir, tree, context);
    const ngModules = this._ngModules().slice(1);
    this.entryPoints = ngModules.map(m => this._resolvePath(m));
    this.hasReadme = dir.subfiles.includes(fragment('README.md'));
    this.hasSchematics = dir.subdirs.includes(fragment('schematics'));
    this.hasSrcFiles = dir.subdirs.includes(fragment('src'));
    this.hasStyles = dir.subfiles.includes(fragment('_styles.scss'));
    this.hasTypography = dir.subfiles.includes(fragment('typography.scss'));
    this.markdownFiles = this._markdownFiles.map(f => basename(f.path));
    this.markdownModules = ngModules.filter(m => m.hasMarkdown).map(m => this._resolvePath(m));
  }

  private _resolvePath(m: NgModule) {
    return relative(this.path, m.path);
  }

  protected _templateOptions() {
    return {
      ...strings,
      uc: (s: string) => s.toUpperCase(),
      ...this,
      dependencies: this.dependencies.filter(d => !d.startsWith(`//src/${this.name}`))
    };
  }
}
