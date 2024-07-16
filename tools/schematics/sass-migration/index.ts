import { basename, dirname, join, Path } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';

export function sassMigration(): Rule {
  return (tree: Tree) => {
    const symbols: ((content: string) => string)[] = [];

    tree.getDir('src/angular/styles').visit((path) => {
      if (path.endsWith('.scss') && !path.includes('typography')) {
        symbols.push(...createSymbolsFor(path, 'sbb'));
      }
    });

    tree.getDir('src').visit((path, entry) => {
      if (
        path.endsWith('.scss') &&
        (!path.includes('src/angular/styles') || path.includes('_typography.scss')) &&
        entry
      ) {
        let content = entry.content.toString();
        const regex = /@import '(..\/)+(angular\/)?styles\/common';/;
        if (!regex.test(content)) {
          return;
        }

        content = content.replace(regex, `@use '@sbb-esta/angular' as sbb;`);
        const localSymbols = [...symbols];
        content = content.replace(/@import '([^']+)';/g, (...m: string[]) => {
          const importPath = join(
            dirname(path),
            `${m[1].replace(/[\w\-\_]+$/, (im) => `_${im}`)}.scss`,
          );
          localSymbols.push(...createSymbolsFor(importPath));
          return `@use '${m[1]}';`;
        });

        content = localSymbols.reduce((current, next) => next(current), content);
        if (entry.content.toString() !== content) {
          tree.overwrite(path, content);
        }
      }
    });

    function createSymbolsFor(
      file: Path,
      name: string = basename(file).replace(/(^_|.scss$)/g, ''),
    ) {
      const fileSymbols: ((content: string) => string)[] = [];
      const lines = tree.read(file)!.toString().split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (['*', '/*', '//'].some((p) => trimmedLine.startsWith(p))) {
          continue;
        }

        const [_match, _group, sassVariable, sassFunction, sassMixin] =
          trimmedLine.match(/((\$[\w\-\_]+):|@function ([\w\-\_]+)|@mixin ([\w\-\_]+))/) ?? [];
        if (sassVariable || sassFunction) {
          const escapedValue = (sassVariable ?? sassFunction).replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&',
          );
          fileSymbols.push((content) =>
            content.replace(
              new RegExp(`(\\W)(${escapedValue}\\W)`, 'g'),
              (...m) => `${m[1]}${name}.${m[2]}`,
            ),
          );
        } else if (sassMixin) {
          fileSymbols.push((content) =>
            content.replace(
              new RegExp(`include (${sassMixin}\\W)`, 'g'),
              (...m) => `include ${name}.${m[1]}`,
            ),
          );
        }
      }

      return fileSymbols;
    }
  };
}
