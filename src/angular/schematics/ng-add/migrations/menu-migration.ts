import { dirname } from '@angular-devkit/core';
import {
  addModuleImportToModule,
  DevkitContext,
  Migration,
  ResolvedResource,
  TargetVersion,
} from '@angular/cdk/schematics';
import { findModule } from '@schematics/angular/utility/find-module';

import {
  findReferenceAttribute,
  iterateNodes,
  MigrationElement,
  MigrationRecorderRegistry,
  nodeCheck,
} from '../../utils';

export class MenuMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _contextmenus = new MigrationRecorderRegistry(this);
  private _dropdowns = new MigrationRecorderRegistry(this);
  private _referenceNamesPerTemplate = new Map<ResolvedResource, string[]>();

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    if (!this._referenceNamesPerTemplate.has(template)) {
      this._referenceNamesPerTemplate.set(template, []);
    }

    iterateNodes(template.content, async (node) => {
      if (nodeCheck(node).is('sbb-contextmenu')) {
        this._contextmenus.add(template, node);
      } else if (nodeCheck(node).is('sbb-dropdown')) {
        this._dropdowns.add(template, node);
      }

      const referenceAttribute = findReferenceAttribute(node);
      if (referenceAttribute) {
        this._referenceNamesPerTemplate.get(template)!.push(referenceAttribute.name);
      }
    });
  }

  postAnalysis() {
    if (!this._contextmenus.empty) {
      this.logger.info('Migrating sbb-contextmenu usages');
      this._contextmenus.forEach((e) => this._handleContextmenu(e));
    }

    if (!this._dropdowns.empty) {
      this.logger.info('Migrating sbb-dropdown usages');
      this._dropdowns.forEach((e) => this._handleDropdown(e));
    }
  }

  private _handleContextmenu(contextmenu: MigrationElement) {
    this._addIconModuleImport(contextmenu);
    this._addContextmenuTrigger(contextmenu);
  }

  private _handleDropdown(dropdown: MigrationElement) {
    this._replaceDropdownItems(dropdown);
    this._removeDropdownProperties(dropdown);
  }

  private _addIconModuleImport(contextmenu: MigrationElement) {
    try {
      const modulePath = findModule(this.context.tree, dirname(contextmenu.resource.filePath));
      addModuleImportToModule(
        this.context.tree,
        modulePath,
        'SbbIconModule',
        '@sbb-esta/angular/icon'
      );
    } catch {
      this.logger.warn(
        'Could not find module where SbbContextmenu was imported. Please import SbbIconModule into your corresponding NgModule (if not already imported).'
      );
    }
  }

  private _addContextmenuTrigger(contextmenu: MigrationElement) {
    const dropdown = contextmenu.findElements((node) => nodeCheck(node).is('sbb-dropdown'))[0];
    if (!dropdown) {
      this.logger.warn(
        `No sbb-dropdown was found inside an sbb-contextmenu (${contextmenu.resource.filePath}). Could not perform migration.`
      );
      return;
    }
    const dropdownReference = dropdown.findPropertyByValue('sbbDropdown');
    let menuReferenceName = this._nextMenuReferenceName(contextmenu);

    if (dropdownReference) {
      dropdownReference.replaceValue('sbbMenu');
      menuReferenceName = dropdownReference.attribute.name;
    } else {
      dropdown.appendProperty(menuReferenceName, 'sbbMenu');
      this._referenceNamesPerTemplate.get(contextmenu.resource)!.push(menuReferenceName);
    }

    contextmenu.removeStartTag();
    contextmenu.removeEndTag();
    contextmenu.prepend(
      `<button [sbbMenuTriggerFor]="${menuReferenceName.substring(
        1
      )}"><sbb-icon svgIcon="kom:context-menu-small"></sbb-icon></button>`
    );
  }

  private _nextMenuReferenceName(contextmenu: MigrationElement): string {
    const existingNames = this._referenceNamesPerTemplate.get(contextmenu.resource);
    if (!existingNames?.includes('#menu')) {
      return '#menu';
    }

    let i = 1;
    while (existingNames?.includes(`#menu${i}`)) {
      i++;
    }
    return `#menu${i}`;
  }

  private _replaceDropdownItems(dropdown: MigrationElement) {
    const dropdownItems = dropdown.findElements((node) =>
      nodeCheck(node).hasAttribute('sbbDropdownItem')
    );
    dropdownItems.forEach((dropdownItem) =>
      dropdownItem.findProperty('sbbDropdownItem')?.replace('sbb-menu-item')
    );
  }

  private _removeDropdownProperties(dropdown: MigrationElement) {
    const propertiesToRemove = ['autoActiveFirstOption', 'opened', 'optionSelected', 'panelWidth']
      .map((propertyName) => dropdown.findProperty(propertyName))
      .filter((property) => !!property);

    if (propertiesToRemove.length === 0) {
      return;
    }

    propertiesToRemove.forEach((property) => {
      property!.remove();
    });

    dropdown.prepend(
      `<!-- TODO: Removed properties ${propertiesToRemove
        .map((property) => property!.attribute.name)
        .join(', ')} because they no longer exist. -->`
    );
  }
}
