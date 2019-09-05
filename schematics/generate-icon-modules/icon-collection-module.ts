import { fragment, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  DirEntry,
  mergeWith,
  move,
  Rule,
  template,
  url
} from '@angular-devkit/schematics';

import { IconModule } from './icon-module';

const ICON_ROOT = 'root';

export class IconCollectionModule {
  readonly icons: IconModule[] = [];
  readonly collections: IconCollectionModule[] = [];
  readonly filename: string;
  get iconsRecursive(): IconModule[] {
    return [
      ...this.icons,
      ...this.collections.reduce((current, next) => [...current, ...next.iconsRecursive], [])
    ];
  }

  constructor(readonly name: string = '') {
    this.filename = strings.dasherize(name || ICON_ROOT);
  }

  apply(root: DirEntry): Rule {
    const directory = this.name ? root.dir(fragment(this.filename)) : root;
    return chain([
      mergeWith(
        apply(url('./files/collection'), [
          template({
            ...strings,
            ...this
          }),
          move(directory.path)
        ])
      ),
      ...this.collections.map(c => c.apply(directory)),
      ...this.icons.map(i => i.apply(directory))
    ]);
  }
}
