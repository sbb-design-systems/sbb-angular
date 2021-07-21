import type { Element } from 'parse5';

import { MigrationElement, nodeCheck } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-checkbox-panel usages to the new format.
 */
export class CheckboxPanelMigration extends RefactorMigration {
  protected _type = 'sbb-checkbox-panel';
  protected _migrateMessage: string = `Migrating ${this._type} usages`;

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, this._type);
  }

  protected _migrate(element: MigrationElement) {
    const label = element.findProperty('label')!;
    const subtitle = element.findProperty('subtitle');
    const i18nSubtitle = element.findProperty('i18n-subtitle');
    let content = label.toTextNode();
    label.remove();

    let i18nSubtitleTransformed = '';
    if (i18nSubtitle) {
      i18nSubtitleTransformed = ' i18n';
      if (i18nSubtitle.nativeValue?.length) {
        i18nSubtitleTransformed += `="${i18nSubtitle.nativeValue}"`;
      }
    }

    if (subtitle) {
      content += `<${this._type}-subtitle${i18nSubtitleTransformed}>${subtitle.toTextNode()}</${
        this._type
      }-subtitle>`;
      subtitle.remove();
      i18nSubtitle?.remove();
    }
    element.insertStart(content);

    const icon = element.findElements((n) => nodeCheck(n).hasAttribute('icon', 'sbbIcon'))[0];
    if (icon) {
      const iconAttribute = icon.findProperty('icon') || icon.findProperty('sbbIcon');
      iconAttribute?.remove();
      icon.prepend(`<${this._type}-note>`);
      icon.append(`</${this._type}-note>`);
    }
  }
}
