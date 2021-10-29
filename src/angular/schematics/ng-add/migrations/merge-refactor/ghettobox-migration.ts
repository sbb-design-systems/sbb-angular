import type { Element } from 'parse5';

import { MigrationElement, nodeCheck } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-ghettobox usages to the new format.
 */
export class GhettoboxMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-ghettobox usages';
  private _ghettoboxMigrationFailedPartially = false;

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-ghettobox');
  }

  override applyMigration() {
    super.applyMigration();
    if (this._ghettoboxMigrationFailedPartially) {
      this._migration.logger.warn('  Automatic migration failed for some sbb-ghettobox instances.');
      this._migration.logger.warn('  Check generated TODO in templates.');
      this._migration.logger.warn(
        '  See https://angular.app.sbb.ch/angular/components/alert for reference.'
      );
      this._migration.logger.info('');
    }
  }

  protected _migrate(element: MigrationElement) {
    let indicatorIcon = '';
    const routerLink = element.findProperty('routerLink');

    const icon = element.findProperty('icon');
    if (icon) {
      icon.remove();
      this._ghettoboxMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from icon "${icon.attribute.value}". ` +
          'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/alert -->'
      );
    }
    const [iconElement, ...iconElements] = element.findElements((n) =>
      nodeCheck(n).hasAttribute('*sbbIcon')
    );
    if (iconElements.length) {
      this._ghettoboxMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon. ` +
          'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/alert -->'
      );
    } else if (iconElement?.is('sbb-icon')) {
      const svgIcon = iconElement.findProperty('svgIcon');
      if (!svgIcon) {
        this._ghettoboxMigrationFailedPartially = true;
        element.insertStart(
          `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
            'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/alert -->'
        );
      } else {
        const attribute = svgIcon.isProperty ? '[svgIcon]' : 'svgIcon';
        indicatorIcon = `${attribute}="${svgIcon.nativeValue}"`;
      }
      iconElement.remove();
    } else if (iconElement) {
      this._ghettoboxMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
          'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/alert -->'
      );
      iconElement.remove();
    }

    if (routerLink && indicatorIcon) {
      element.rename('a', `sbbAlert ${indicatorIcon}`);
    } else if (routerLink) {
      element.rename('a', 'sbbAlert');
    } else if (indicatorIcon) {
      element.rename('sbb-alert', indicatorIcon);
    } else {
      element.rename('sbb-alert');
    }
  }
}
