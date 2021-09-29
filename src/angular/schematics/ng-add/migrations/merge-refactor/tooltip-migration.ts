import type { Element } from 'parse5';

import { MigrationElement, nodeCheck } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-tooltip.
 */
export class TooltipMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-tooltip usages';
  private _tooltipMigrationFailedPartially = false;

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-tooltip');
  }

  override applyMigration() {
    super.applyMigration();
    if (this._tooltipMigrationFailedPartially) {
      this._migration.logger.warn('  Automatic migration failed for some sbb-tooltip instances.');
      this._migration.logger.warn('  Check generated TODO in templates.');
      this._migration.logger.warn(
        '  See https://angular.app.sbb.ch/angular/components/tooltip for reference.'
      );
      this._migration.logger.info('');
    }
  }

  protected _migrate(element: MigrationElement) {
    const icon = element.findProperty('icon');
    if (icon) {
      icon.remove();
      this._tooltipMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from icon "${icon.attribute.value}". ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/tooltip -->'
      );
    }
    const [iconElement, ...iconElements] = element.findElements((n) =>
      nodeCheck(n).hasAttribute('*sbbIcon')
    );
    if (iconElements.length) {
      this._tooltipMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon. ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/tooltip -->'
      );
    } else if (iconElement?.is('sbb-icon')) {
      const svgIcon = iconElement.findProperty('svgIcon');
      if (!svgIcon) {
        this._tooltipMigrationFailedPartially = true;
        element.insertStart(
          `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
            'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/tooltip -->'
        );
      } else {
        const attribute = svgIcon.isProperty ? '[indicatorIcon]' : 'indicatorIcon';
        element.appendProperty(attribute, svgIcon.nativeValue);
      }
      iconElement.remove();
    } else if (iconElement) {
      this._tooltipMigrationFailedPartially = true;
      element.insertStart(
        `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/tooltip -->'
      );
      iconElement.remove();
    }
  }
}
