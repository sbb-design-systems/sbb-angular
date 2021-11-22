import { dirname } from '@angular-devkit/core';
import { findModule } from '@schematics/angular/utility/find-module';
import type { Element } from 'parse5';

import { addModuleImportToModule, MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-usermenu usages to the new format.
 */
export class UsermenuMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-usermenu usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-usermenu');
  }

  protected _migrate(element: MigrationElement) {
    this._replaceSbbSelectedWithSbbActiveClass(element);
    this._replaceUsermenuItems(element);
    this._extractUsermenuTag(element);

    element.rename('sbb-menu');
    element.removeStartTag();

    this._addSbbMenuModuleImport(element);
  }

  private _extractUsermenuTag(element: MigrationElement) {
    const iconDirectivesString = element
      .findElements((node) =>
        node.attrs?.some((value) => value.name.toUpperCase().includes('*sbbIcon'.toUpperCase()))
      )
      .map((value) => {
        value.remove();
        return value.outerHtml();
      })
      .reduce((previousValue, currentValue) => previousValue + currentValue, '');

    const usermenuHtml = element
      .outerHtml()
      .match(
        /<sbb-usermenu(?=\s)(?!(?:[^>"\']|"[^"]*"|\'[^\']*\')*?(?<=\s)(?:term|range)\s*=)(?!\s*\/?>)\s+(?:".*?"|\'.*?\'|[^>]*?)+>/g
      )![0];

    // Concatenate parts
    element.prepend(
      `${usermenuHtml.replace(
        `<sbb-usermenu`,
        `<sbb-usermenu [menu]="menu"`
      )}\n${iconDirectivesString}\n</sbb-usermenu>\n<sbb-menu #menu="sbbMenu">`
    );
  }

  private _replaceUsermenuItems(element: MigrationElement) {
    const sbbUsermenuItemSelector = 'sbb-usermenu-item';

    element
      .findElements(
        (node) =>
          (node.tagName === 'a' || node.tagName === 'button') &&
          node.attrs?.some((value) =>
            value.name.toUpperCase().includes(sbbUsermenuItemSelector.toUpperCase())
          )
      )
      .forEach((value) => value.findProperty(sbbUsermenuItemSelector)?.rename('sbb-menu-item'));
  }

  private _replaceSbbSelectedWithSbbActiveClass(element: MigrationElement) {
    element
      .findElements((node) =>
        node.attrs?.some((value) =>
          value.name.toUpperCase().includes('routerLinkActive'.toUpperCase())
        )
      )
      .map((value) => value.findPropertyByValue('sbb-selected'))
      .forEach((value) => value?.replaceValue('sbb-active'));
  }

  private _addSbbMenuModuleImport(element: MigrationElement) {
    try {
      const modulePath = findModule(
        this._migration.context.tree,
        dirname(element.resource.filePath)
      );
      const fileSystem = this._migration.fileSystem;
      const recorder = fileSystem.edit(fileSystem.resolve(modulePath));
      addModuleImportToModule(
        this._migration.context.tree,
        modulePath,
        'SbbMenuModule',
        '@sbb-esta/angular/menu',
        recorder
      );
    } catch {
      this._migration.logger.warn(
        'Could not find module where SbbUsermenu was imported. Please import SbbMenuModule into your corresponding NgModule (if not already imported).'
      );
    }
  }
}
