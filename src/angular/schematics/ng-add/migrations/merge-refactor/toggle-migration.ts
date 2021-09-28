import type { Element } from 'parse5';

import { MigrationElement, nodeCheck } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-toggle usages to the new format.
 */
export class ToggleMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-toggle usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-toggle-option');
  }

  protected _migrate(element: MigrationElement) {
    const iconElements = element.findElements((n) => nodeCheck(n).hasAttribute('*sbbIcon'));
    const icons: string[] = [];
    if (iconElements.length) {
      for (const iconElement of iconElements) {
        icons.push(iconElement.outerHtml());
        iconElement.remove();
      }
    }

    const hasDetails = !!icons
      .reduce((current, next) => current.replace(next, ''), element.innerHtml())
      .trim();

    let insertAtStart = '';
    let insertAtEnd = '';
    if (icons.length) {
      insertAtStart += `\n<sbb-toggle-icon>\n  ${icons
        .map((i) => i.replace(' *sbbIcon', ''))
        .join('\n  ')}\n</sbb-toggle-icon>`;
    }
    if (hasDetails) {
      insertAtStart += '\n<sbb-toggle-details>';
      insertAtEnd += '</sbb-toggle-details>';
    }

    if (insertAtStart) {
      element.insertStart(insertAtStart);
    }
    if (insertAtEnd) {
      element.insertBeforeEnd(insertAtEnd);
    }
  }
}
