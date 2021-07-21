import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-processflow usages to the new implementation.
 */
export class ProcessflowMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-processflow usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-processflow');
  }

  protected _migrate(element: MigrationElement) {
    const skippable = element.findProperty('skippable');
    if (skippable) {
      skippable.remove();
    } else {
      element.appendProperty('linear');
    }

    for (const property of element.properties()) {
      if (property.name.startsWith('#')) {
        const name = property.name.substr(1);
        const prevStepRegex = new RegExp(`${name}\\.prevStep()`, 'g');
        let match: RegExpMatchArray | null;
        while ((match = prevStepRegex.exec(element.resource.content))) {
          const index = element.resource.start + match.index! + name.length + 5;
          element.recorder.remove(index, 4);
          element.recorder.insertRight(index, 'ious');
        }
        const nextStepRegex = new RegExp(`${name}\\.nextStep()`, 'g');
        while ((match = nextStepRegex.exec(element.resource.content))) {
          const index = element.resource.start + match.index! + name.length + 5;
          element.recorder.remove(index, 4);
        }
      }
    }
  }
}
