import type { Element } from 'parse5';

import { MigrationElement, nodeCheck } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbbButton usages to the new format.
 */
export class ButtonMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbbButton usages';
  private readonly _modeSelectorMapping: { [mode: string]: string } = {
    primary: 'sbb-button',
    secondary: 'sbb-secondary-button',
    ghost: 'sbb-ghost-button',
    frameless: 'sbb-frameless-button',
    alternative: 'sbb-alt-button',
    icon: 'sbb-icon-button',
  };
  private _buttonMigrationFailedPartially = false;

  protected _shouldMigrate(element: Element): boolean {
    return this._hasAttribute(element, 'sbbButton');
  }

  override applyMigration() {
    super.applyMigration();
    if (this._buttonMigrationFailedPartially) {
      this._migration.logger.warn('  Automatic migration failed for some sbbButton instances.');
      this._migration.logger.warn('  Check generated TODO in templates.');
      this._migration.logger.warn(
        '  See https://angular.app.sbb.ch/angular/components/button for reference.'
      );
      this._migration.logger.info('');
    }
  }

  protected _migrate(element: MigrationElement) {
    const sbbButton = element.findProperty('sbbButton')!;
    const mode = element.findProperty('mode');
    const icon = element.findProperty('icon');
    if (mode) {
      mode.remove();
    }
    let selector = this._modeSelectorMapping[mode?.value || ''] || 'sbb-button';
    if (mode && !mode.value) {
      this._buttonMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine selector from mode "${mode.attribute.value}". ` +
          'Please manually select the appropriate selector: https://angular.app.sbb.ch/angular/components/button -->'
      );
    }
    if (icon) {
      icon.remove();
      this._buttonMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from icon "${icon.attribute.value}". ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->'
      );
    }
    const [iconElement, ...iconElements] = element.findElements((n) =>
      nodeCheck(n).hasAttribute('*sbbIcon')
    );
    if (mode?.value === 'icon' && iconElement) {
      const sbbIcon = iconElement.findProperty('*sbbIcon')!;
      sbbIcon.remove();
    } else if (iconElements.length) {
      this._buttonMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon. ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->'
      );
    } else if (iconElement?.is('sbb-icon')) {
      const svgIcon = iconElement.findProperty('svgIcon');
      if (!svgIcon) {
        this._buttonMigrationFailedPartially = true;
        element.insertStart(
          `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
            'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->'
        );
      } else {
        const attribute = svgIcon.isProperty ? '[indicatorIcon]' : 'indicatorIcon';
        selector += ` ${attribute}="${svgIcon.nativeValue}"`;
      }
      iconElement.remove();
    } else if (iconElement) {
      this._buttonMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->'
      );
      iconElement.remove();
    }
    sbbButton.replace(selector);
  }
}
