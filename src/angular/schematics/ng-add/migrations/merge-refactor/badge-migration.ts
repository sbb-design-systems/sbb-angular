import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that replaces <sbb-badge> instances with <span sbbBadge="">.
 */
export class BadgeMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-badge usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-badge');
  }

  protected _migrate(element: MigrationElement) {
    const ariaLabel = element.findProperty('aria-label');
    ariaLabel?.rename('sbbBadgeDescription');
    const active = element.findProperty('active');
    if (active) {
      active.replace(`[sbbBadgeDisabled]="!${active.nativeValue}"`);
    }

    const start = element.resource.start;
    const { startTag, endTag } = element.location;
    const content = element.innerHtml().trim();
    element.recorder.remove(start + endTag.startOffset + 2, 9);
    element.recorder.insertRight(start + endTag.startOffset + 2, 'span');
    element.recorder.remove(start + startTag.endOffset, endTag.startOffset - startTag.endOffset);
    const badge =
      content.startsWith('{{') && content.endsWith('}}')
        ? `[sbbBadge]="${content.substr(2, content.length - 4).trim()}"`
        : `sbbBadge="${content}"`;
    element.recorder.remove(start + startTag.startOffset + 1, 9);
    element.recorder.insertRight(start + startTag.startOffset + 1, `span ${badge}`);
  }
}
