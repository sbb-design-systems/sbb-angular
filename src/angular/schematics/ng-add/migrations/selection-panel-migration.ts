import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry, nodeCheck } from '../../utils';

/**
 * Migration that updates sbb-checkbox-panel and sbb-radio-button-panel usages to the new format.
 */
export class SelectionPanelMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _checkboxes = new MigrationRecorderRegistry(this);
  private _radioButtons = new MigrationRecorderRegistry(this);

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-checkbox-panel')) {
        this._checkboxes.add(template, node);
      } else if (nodeCheck(node).is('sbb-radio-button-panel')) {
        this._radioButtons.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._checkboxes.empty) {
      this.logger.info('Migrating sbb-checkbox-panel usages');
      this._checkboxes.forEach((e) => this._handlePanel(e, 'checkbox'));
    }
    if (!this._radioButtons.empty) {
      this.logger.info('Migrating sbb-radio-button-panel usages');
      this._radioButtons.forEach((e) => this._handlePanel(e, 'radio-button'));
    }
  }

  private _handlePanel(element: MigrationElement, type: string) {
    const label = element.findProperty('label')!;
    const subtitle = element.findProperty('subtitle');
    const i18nSubtitle = element.findProperty('i18n-subtitle');
    let content = label.toTextNode();
    label.remove();

    let i18nSubtitleTransformed = '';
    if (i18nSubtitle) {
      i18nSubtitleTransformed = ' i18n';
      if (i18nSubtitle.nativeValue?.length) {
        i18nSubtitleTransformed += `="${i18nSubtitle.nativeValue}"`;
      }
    }

    if (subtitle) {
      content += `<sbb-${type}-panel-subtitle${i18nSubtitleTransformed}>${subtitle.toTextNode()}</sbb-${type}-panel-subtitle>`;
      subtitle.remove();
      i18nSubtitle?.remove();
    }
    element.insertStart(content);

    const icon = element.findElements((n) => nodeCheck(n).hasAttribute('icon', 'sbbIcon'))[0];
    if (icon) {
      const iconAttribute = icon.findProperty('icon') || icon.findProperty('sbbIcon');
      iconAttribute?.remove();
      icon.prepend(`<sbb-${type}-panel-note>`);
      icon.append(`</sbb-${type}-panel-note>`);
    }
  }
}
