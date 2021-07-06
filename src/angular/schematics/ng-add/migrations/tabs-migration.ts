import { dirname, normalize } from '@angular-devkit/core';
import {
  addModuleImportToModule,
  DevkitContext,
  Migration,
  ResolvedResource,
  TargetVersion,
} from '@angular/cdk/schematics';
import { findModule } from '@schematics/angular/utility/find-module';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry, nodeCheck } from '../../utils';

/**
 * Migration that migrates the tabs usages.
 */
export class TabsMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _tabs = new MigrationRecorderRegistry(this);

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-tab')) {
        this._tabs.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._tabs.empty) {
      this.logger.info('Migrating sbb-tab usages');
      this._tabs.forEach((e) => this._handleTab(e));
    }
  }

  private _handleTab(element: MigrationElement) {
    const labelId = element.findProperty('labelId');
    labelId?.remove();

    const badgePill = element.findProperty('badgePill');
    if (badgePill) {
      badgePill.remove();
      const label = element.findProperty('label')!;
      label.remove();

      const labelContent = label.isProperty ? `{{ ${label.nativeValue} }}` : label.nativeValue;
      element.insertStart(
        `<span *sbb-tab-label [sbbBadge]="${badgePill.nativeValue}">${labelContent}</span>`
      );

      this._addBadgeModule(element.resource);
    }
  }

  private _addBadgeModule(resource: ResolvedResource) {
    try {
      const modulePath = findModule(this.context.tree, dirname(resource.filePath));
      addModuleImportToModule(
        this.context.tree,
        modulePath,
        'SbbBadgeModule',
        '@sbb-esta/angular/badge'
      );
    } catch {
      this.logger.warn(
        `Unable to add SbbBadgeModule for usage in <sbb-tab> at ${resource.filePath}. Please add it manually.`
      );
    }
  }
}
