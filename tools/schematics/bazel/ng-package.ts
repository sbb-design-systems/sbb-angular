import { fragment, relative, strings } from '@angular-devkit/core';
import { DirEntry, Tree } from '@angular-devkit/schematics';

import { BazelSchematicContext } from './bazel-schematic-context';
import { NgModule } from './ng-module';

export class NgPackage extends NgModule {
  shortName: string;
  entryPoints: string[];
  hasReadme: boolean;
  hasSchematics: boolean;
  hasSrcFiles: boolean;
  hasTypography: boolean;
  hasFullFont: boolean;
  markdownModules: string[];

  protected _templateUrl = './files/ngPackage';

  constructor(dir: DirEntry, tree: Tree, context: BazelSchematicContext) {
    super(dir, tree, context);
    this.shortName = this.name.replace('angular-', '');
    const ngModules = this.ngModules().slice(1);
    this.entryPoints = ngModules.map((m) => this._resolvePath(m));
    this.hasReadme = dir.subfiles.includes(fragment('README.md'));
    this.hasSchematics = dir.subdirs.includes(fragment('schematics'));
    this.hasSrcFiles = dir.subdirs.includes(fragment('src'));
    this.hasTypography = dir.subfiles.includes(fragment('typography.scss'));
    if (this.hasTypography) {
      this.sassBinaries = this.sassBinaries.filter((s) => !s.path.includes('typography.scss'));
      this.stylesheets = this.stylesheets.filter((s) => !s.includes('typography.css'));
    }
    this.hasFullFont = dir.subfiles.includes(fragment('fullfont.scss'));
    if (this.hasFullFont) {
      this.sassBinaries = this.sassBinaries.filter((s) => !s.path.includes('fullfont.scss'));
      this.stylesheets = this.stylesheets.filter((s) => !s.includes('fullfont.css'));
    }
    this.markdownModules = ngModules.filter((m) => m.hasMarkdown).map((m) => this._resolvePath(m));
  }

  private _resolvePath(m: NgModule) {
    return relative(this.path, m.path);
  }

  protected _templateOptions() {
    return {
      ...strings,
      constant: (s: string) => s.replace(/-/g, '_').toUpperCase(),
      bazelName: (s: string) => s.replace(/-/g, '_'),
      ...this,
      dependencies: this.dependencies.filter((d) => !d.startsWith(`//src/${this.name}`)),
    };
  }
}
