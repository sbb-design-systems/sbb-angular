import type { Element } from 'parse5';

import { MigrationElement, nodeCheck } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-notification usages to the new format.
 */
export class NotificationMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-notification usages';
  private _notificationMigrationFailedPartially = false;

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-notification');
  }

  override applyMigration() {
    super.applyMigration();
    if (this._notificationMigrationFailedPartially) {
      this._migration.logger.warn(
        '  Automatic migration failed for some sbb-notification instances.'
      );
      this._migration.logger.warn('  Check generated TODO in templates.');
      this._migration.logger.warn(
        '  See https://angular.app.sbb.ch/angular/components/notification for reference.'
      );
      this._migration.logger.info('');
    }
  }

  protected _migrate(element: MigrationElement) {
    const message = element.findProperty('message');
    if (message) {
      const messageValue = message.isProperty
        ? `{{ ${message.nativeValue} }}`
        : message.nativeValue;
      element.insertStart(messageValue);
      message.remove();
    }

    const icon = element.findProperty('icon');
    if (icon) {
      icon.remove();
      this._notificationMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from icon "${icon.attribute.value}". ` +
          'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/notification -->'
      );
    }
    const [iconElement, ...iconElements] = element.findElements((n) =>
      nodeCheck(n).hasAttribute('*sbbIcon')
    );
    if (iconElements.length) {
      this._notificationMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon. ` +
          'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/notification -->'
      );
    } else if (iconElement?.is('sbb-icon')) {
      const svgIcon = iconElement.findProperty('svgIcon');
      if (!svgIcon) {
        this._notificationMigrationFailedPartially = true;
        element.insertStart(
          `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
            'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/notification -->'
        );
      } else {
        const attribute = svgIcon.isProperty ? '[svgIcon]' : 'svgIcon';
        element.appendProperty(attribute, svgIcon.nativeValue);
      }
      iconElement.remove();
    } else if (iconElement) {
      this._notificationMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
          'Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/notification -->'
      );
      iconElement.remove();
    }
  }
}
