import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';
import * as ts from 'typescript';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry } from '../../utils';

/**
 * Migration that updates sbbButton and sbbLink usages to the new format.
 */
export class ButtonMigration extends Migration<null, DevkitContext> {
  printer = ts.createPrinter();

  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private readonly _modeSelectorMapping: { [mode: string]: string } = {
    primary: 'sbb-button',
    secondary: 'sbb-secondary-button',
    ghost: 'sbb-ghost-button',
    frameless: 'sbb-frameless-button',
    alternative: 'sbb-alt-button',
    icon: 'sbb-icon-button',
  };
  private _buttons = new MigrationRecorderRegistry(this);
  private _links = new MigrationRecorderRegistry(this);
  private _buttonMigrationFailedPartially = false;
  private _linkModeUsed = false;

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (node.attrs?.some((a) => a.name.toLowerCase() === 'sbbbutton')) {
        this._buttons.add(template, node);
      } else if (node.attrs?.some((a) => a.name.toLowerCase() === 'sbblink')) {
        this._links.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._buttons.empty) {
      this.logger.info('Migrating sbbButton usages');
      this._buttons.forEach((e) => this._handleButton(e));
      if (this._buttonMigrationFailedPartially) {
        this.logger.warn('  Automatic migration failed for some sbbButton instances.');
        this.logger.warn('  Check generated TODO in templates.');
        this.logger.warn(
          '  See https://angular.app.sbb.ch/angular/components/button for reference.'
        );
        this.logger.info('');
      }
    }
    if (!this._links.empty) {
      this.logger.info('Migrating sbbLink usages');
      this._links.forEach((e) => this._handleLink(e));
      if (this._linkModeUsed) {
        this.logger.warn('  sbbLink[mode] is no longer available.');
        this.logger.warn('  Maybe you want to use a link group?');
        this.logger.warn(
          '  See https://angular.app.sbb.ch/angular/components/button on how to use.'
        );
        this.logger.info('');
      }
    }
  }

  private _handleButton(element: MigrationElement) {
    const sbbButton = element.findProperty('sbbButton')!;
    const mode = element.findProperty('mode');
    const icon = element.findProperty('icon');
    if (mode) {
      mode.remove();
    }
    let selector = this._modeSelectorMapping[mode?.value || ''] || 'sbb-button';
    if (mode && !mode.value) {
      this._buttonMigrationFailedPartially = true;
      element.append(
        `<!-- TODO: Unable to determine selector from mode "${mode.attribute.value}". ` +
          'Please manually select the appropriate selector: https://angular.app.sbb.ch/angular/components/button -->'
      );
    }
    if (icon) {
      icon.remove();
      this._buttonMigrationFailedPartially = true;
      element.append(
        `<!-- TODO: Unable to determine custom icon from icon "${icon.attribute.value}". ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->'
      );
    }
    const [iconElement, ...iconElements] = element.findElements((n) =>
      n.attrs?.some((a) => a.name.toLowerCase() === '*sbbicon')
    );
    if (mode?.value === 'icon' && iconElement) {
      const sbbIcon = iconElement.findProperty('*sbbIcon')!;
      sbbIcon.remove();
    } else if (iconElements.length) {
      this._buttonMigrationFailedPartially = true;
      element.append(
        `<!-- TODO: Unable to determine custom icon. ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->'
      );
    } else if (iconElement?.is('sbb-icon')) {
      const svgIcon = iconElement.findProperty('svgIcon');
      if (!svgIcon) {
        this._buttonMigrationFailedPartially = true;
        element.append(
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
      element.append(
        `<!-- TODO: Unable to determine custom icon from "${iconElement.toString()}". ` +
          'Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->'
      );
      iconElement.remove();
    }
    sbbButton.replace(selector);
  }

  private _handleLink(element: MigrationElement) {
    const sbbLink = element.findProperty('sbbLink')!;
    const mode = element.findProperty('mode');
    const icon = element.findProperty('icon');
    if (mode) {
      this._linkModeUsed = true;
      mode.remove();
    }
    sbbLink.replace('sbb-link');
    if (!icon) {
      // Do nothing, if no icon specified
    } else if (icon.value === 'download') {
      icon.replace('indicatorIcon="kom:download-small"');
    } else {
      icon.remove();
    }
  }
}
