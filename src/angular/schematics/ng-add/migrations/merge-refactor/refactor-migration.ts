import { Migration, ResolvedResource } from '@angular/cdk/schematics';
import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

export abstract class RefactorMigration {
  protected abstract _migrateMessage: string;
  private _elements = new Map<ResolvedResource, Element[]>();

  constructor(protected readonly _migration: Migration<any, any>) {}

  checkMigratable(resource: ResolvedResource, element: Element): void {
    if (this._shouldMigrate(element)) {
      if (!this._elements.has(resource)) {
        this._elements.set(resource, []);
      }

      this._elements.get(resource)!.push(element);
    }
  }

  protected abstract _shouldMigrate(element: Element): boolean;

  protected _isElement(element: Element, selector: string) {
    selector = selector.toLowerCase();
    return element.nodeName.toLowerCase() === selector;
  }

  protected _hasAttribute(element: Element, ...name: string[]) {
    name = name.map((n) => n.toLowerCase());
    return element.attrs && name.some((n) => element.attrs.some((a) => a.name.toLowerCase() === n));
  }

  applyMigration() {
    if (!this._elements.size) {
      return;
    }

    this._migration.logger.info(this._migrateMessage);
    this._elements.forEach((elements, resource) => {
      const recorder = this._migration.fileSystem.edit(resource.filePath);
      elements.forEach((e) => this._migrate(new MigrationElement(e, resource, recorder)));
    });
  }

  protected abstract _migrate(element: MigrationElement);
}
