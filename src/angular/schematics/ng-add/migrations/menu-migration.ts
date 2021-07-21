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
  private _breadcrumbs = new MigrationRecorderRegistry(this);
  private _dropdowns = new MigrationRecorderRegistry(this);
  private _referenceNamesPerTemplate = new Map<ResolvedResource, string[]>();

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    if (!this._referenceNamesPerTemplate.has(template)) {
      this._referenceNamesPerTemplate.set(template, []);
    }

    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-contextmenu')) {
        this._contextmenus.add(template, node);
      } else if (nodeCheck(node).is('sbb-breadcrumbs')) {
        this._breadcrumbs.add(template, node);
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
    if (!this._dropdowns.empty) {
      this.logger.info('Migrating sbb-dropdown usages');
      this._dropdowns.forEach((e) => this._handleDropdown(e));
    }

    if (!this._contextmenus.empty) {
      this.logger.info('Migrating sbb-contextmenu usages');
      this._contextmenus.forEach((e) => this._handleContextmenu(e));
    }

    if (!this._breadcrumbs.empty) {
      this.logger.info('Migrating sbb-breadcrumbs usages');
      this._breadcrumbs.forEach((e) => this._handleBreadcrumbs(e));
    }
  }

  private _handleContextmenu(contextmenu: MigrationElement) {
    this._addIconModuleImport(contextmenu);
    this._addContextmenuTrigger(contextmenu);
  }

  private _handleBreadcrumbs(breadcrumbs: MigrationElement) {
    let couldMigrateRoot = false;

    breadcrumbs
      .findElements((node) => nodeCheck(node).is('sbb-breadcrumb'))
      .forEach((breadcrumb) => {
        if (!couldMigrateRoot) {
          couldMigrateRoot = this._replaceBreadcrumbRoot(breadcrumb);
        }
        this._addBreadcrumbTriggerAndReplaceActiveClass(breadcrumb);
      });

    if (!couldMigrateRoot) {
      breadcrumbs.insertStart(
        `<!-- TODO: It seems that your sbb-breadcrumbs is missing the root element (home icon) or the automatic migration could not perform correctly. Please manually add your root element like this: <a routerLink="/" routerLinkActive="sbb-active" aria-label="Back to the homepage" sbb-breadcrumb-root></a> -->`
      );
    }
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
    const menuReferenceName = this._setReferenceOnDropdown(dropdown, contextmenu);

    contextmenu.removeStartTag();
    contextmenu.removeEndTag();
    contextmenu.prepend(
      `<button [sbbMenuTriggerFor]="${menuReferenceName.substring(
        1
      )}"><sbb-icon svgIcon="kom:context-menu-small"></sbb-icon></button>`
    );
  }

  private _addBreadcrumbTriggerAndReplaceActiveClass(breadcrumb: MigrationElement) {
    const dropdown = breadcrumb.findElements((node) => nodeCheck(node).is('sbb-dropdown'))[0];
    if (dropdown) {
      const menuReferenceName = this._nextMenuReferenceName(breadcrumb);
      this._referenceNamesPerTemplate.get(breadcrumb.resource)!.push(menuReferenceName);

      dropdown.remove();
      const migratedDropdown = dropdown
        .outerHtml()
        .replace('<sbb-dropdown', `<sbb-menu ${menuReferenceName}="sbbMenu"`)
        .replace('</sbb-dropdown', '</sbb-menu')
        .replace(/routerLinkActive=["']sbb-selected["']/g, 'routerLinkActive="sbb-active"')
        .replace(/sbbDropdownItem/g, 'sbb-menu-item');

      breadcrumb.insertStart(
        `\n<button [sbbMenuTriggerFor]="${menuReferenceName.substring(
          1
        )}"><ng-template sbbMenuDynamicTrigger>`
      );

      breadcrumb.insertBeforeEnd(`</ng-template></button>\n${migratedDropdown}\n`);
    } else {
      breadcrumb
        .findElements((node) => nodeCheck(node).hasAttribute('routerLinkActive'))
        .forEach((migrationElement) => {
          const routerLinkActiveProperty = migrationElement.findProperty('routerLinkActive');
          if (routerLinkActiveProperty?.nativeValue === 'sbb-selected') {
            routerLinkActiveProperty!.replaceValue('sbb-active');
          }
        });
    }
  }

  /**
   * If exactly one link with one sbb-icon with attribute svgIcon=kom:houses-small is inside
   * an sbb-breadcrumb, migrate to new sbb-breadcrumb-root directive.
   */
  private _replaceBreadcrumbRoot(breadcrumb: MigrationElement): boolean {
    const links = breadcrumb.findElements((node) => node.tagName === 'a');
    if (links.length !== 1) {
      return false;
    }
    const icons = links[0].findElements((node) => node.tagName === 'sbb-icon');
    if (icons.length !== 1) {
      return false;
    }
    const svgIconProperty = icons[0].findProperty('svgIcon');
    if (!svgIconProperty || svgIconProperty!.value !== 'kom:house-small') {
      return false;
    }
    breadcrumb.removeStartTag();
    breadcrumb.removeEndTag();

    const homeLink = links[0];
    homeLink.appendProperty('sbb-breadcrumb-root');
    homeLink.removeContent();

    return true;
  }

  private _setReferenceOnDropdown(dropdown: MigrationElement, migrationElement: MigrationElement) {
    const dropdownReference = dropdown.findPropertyByValue('sbbDropdown');
    let menuReferenceName = this._nextMenuReferenceName(migrationElement);

    if (dropdownReference) {
      dropdownReference.replaceValue('sbbMenu');
      menuReferenceName = dropdownReference.attribute.name;
    } else {
      dropdown.appendProperty(menuReferenceName, 'sbbMenu');
      this._referenceNamesPerTemplate.get(migrationElement.resource)!.push(menuReferenceName);
    }

    return menuReferenceName;
  }

  private _nextMenuReferenceName(migrationElement: MigrationElement): string {
    const existingNames = this._referenceNamesPerTemplate.get(migrationElement.resource);
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
