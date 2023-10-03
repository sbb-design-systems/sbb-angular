import { Migration, ResolvedResource, UpgradeData, WorkspacePath } from '@angular/cdk/schematics';
import * as ts from 'typescript';

/**
 * Migration that walks through every string literal and template and stylesheet in
 * order to migrate deprecated icon names and replace them with the new ones.
 */
export class IconMigration extends Migration<UpgradeData> {
  // Only enable the migration rule if there is upgrade data.
  enabled = true;

  // Regex to match deprecated icons.
  _deprecatedIconSelector = /(kom|fpl):([\d\w-]+)/g;

  // Regex to match old icon names that contained a 'product-' prefix.
  // E.g.: old = 'product-tgv', new = 'tgv'; old = 'product-re-80', new 're-80',
  _productRegex = /product-(\w{1,3}-?\d*)/g;

  // Mapping of old icon names to new icon names.
  _iconRenames: { [key: string]: string } = {
    'waves-ladder-sun-small': 'waves-ladder-small',
    'waves-ladder-sun-medium': 'waves-ladder-medium',
    'waves-ladder-sun-large': 'waves-ladder-large',
    'adouble-chevron-small-right-small': 'double-chevron-small-right-small',
    'adouble-chevron-small-right-medium': 'double-chevron-small-right-medium',
    'adouble-chevron-small-right-large': 'double-chevron-small-right-large',
    'lcar-power-plug-small': 'car-power-plug-small',
    'lcar-power-plug-medium': 'car-power-plug-medium',
    'lcar-power-plug-large': 'car-power-plug-large',
  };

  // List of all icon names from the SBB Icon CDN.
  _iconNames: string[] = [];

  override visitNode(node: ts.Node): void {
    const textContent = node.getText();
    if (!ts.isStringLiteralLike(node)) {
      return;
    }

    const filePath = this.fileSystem.resolve(node.getSourceFile().fileName);
    this._findAllSubstringIndices(textContent, this._deprecatedIconSelector).forEach((offset) => {
      const oldName = this._getDeprecatedIconName(textContent.slice(offset));
      const newName = oldName ? this._renameDeprecatedIcon(oldName) : null;

      if (oldName && newName && oldName !== newName) {
        this._replaceDeprecatedIconName(
          filePath,
          node.getStart() + offset,
          oldName.length,
          newName,
        );
      }
    });
  }

  override visitTemplate(template: ResolvedResource): void {
    this._findAllSubstringIndices(template.content, this._deprecatedIconSelector).forEach(
      (offset) => {
        const oldName = this._getDeprecatedIconName(template.content.slice(offset));
        const newName = oldName ? this._renameDeprecatedIcon(oldName) : null;

        if (oldName && newName && oldName !== newName) {
          this._replaceDeprecatedIconName(
            template.filePath,
            template.start + offset,
            oldName.length,
            this._renameDeprecatedIcon(oldName),
          );
        }
      },
    );
  }

  private _getDeprecatedIconName(content: string) {
    const match = this._deprecatedIconSelector.exec(content);
    return match ? match[0] : null;
  }

  private _renameDeprecatedIcon(name: string): string {
    this._iconNames = this._iconNames.length ? this._iconNames : require('./sbb-icon-names.json');
    let newName = name.replace(this._deprecatedIconSelector, '$2');
    if (newName.match(this._productRegex)) {
      newName = newName.replace(this._productRegex, '$1');
    }
    if (this._iconRenames[newName]) {
      newName = this._iconRenames[newName];
    }
    return this._iconNames.includes(newName) ? newName : name;
  }

  private _replaceDeprecatedIconName(
    filePath: WorkspacePath,
    start: number,
    length: number,
    newName: string,
  ) {
    this.fileSystem.edit(filePath).remove(start, length).insertRight(start, newName);
  }

  private _findAllSubstringIndices(input: string, search: RegExp): number[] {
    let match: RegExpMatchArray | null = null;
    const result: number[] = [];
    while ((match = search.exec(input)) !== null) {
      result.push(match!.index!);
    }
    return result;
  }
}
