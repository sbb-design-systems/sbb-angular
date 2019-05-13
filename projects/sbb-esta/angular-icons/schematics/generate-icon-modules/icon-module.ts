import { strings } from '@angular-devkit/core';
import {
  apply,
  DirEntry,
  mergeWith,
  move,
  Rule,
  template,
  url
} from '@angular-devkit/schematics';

import { SvgFile } from './svg-file';

export class IconModule {
  readonly name: string;
  readonly modules: string[];
  get sizes() {
    return this._files
      .map(f => f.size)
      .filter(s => !!s)
      .sort();
  }
  get meta() {
    return this._files.map(f => f.filepath);
  }
  private _files: SvgFile[];

  constructor(files: SvgFile[]) {
    this._files = files.sort((a, b) => b.size.localeCompare(a.size));
    this.name = this._files[0].name;
    this.modules = this._files[0].modules.slice();
  }

  apply(directory: DirEntry): Rule {
    const iconBaseImport = () =>
      `${'../'.repeat(this.modules.length)}icon-base`;
    return mergeWith(
      apply(url('./files/icon'), [
        template({
          ...strings,
          iconBaseImport,
          ...this._files[0],
          ...(this._files.some(f =>
            ['large', 'medium', 'small'].includes(f.size)
          )
            ? { width: '24px', height: '24px', ratio: 1 }
            : undefined),
          ...(this._files.length > 1
            ? { template: this._mergeTemplates() }
            : undefined)
        }),
        move(directory.path)
      ])
    );
  }

  private _mergeTemplates() {
    return this._files
      .reduce(
        (current, next, i) =>
          `${current}      ${next.template.replace(
            '<svg ',
            i === 0
              ? '<svg *ngSwitchDefault '
              : `<svg *ngSwitchCase="size?.indexOf('${
                  next.size
                }') === 0 ? size : ''" `
          )}\n`,
        '\n    <ng-container [ngSwitch]="size">\n'
      )
      .replace(/$/, '    </ng-container>');
  }
}
