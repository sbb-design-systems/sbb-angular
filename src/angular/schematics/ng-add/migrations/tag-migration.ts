import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry, nodeCheck } from '../../utils';

export class TagMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _tags = new MigrationRecorderRegistry(this);

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-tag')) {
        this._tags.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._tags.empty) {
      this.logger.info('Migrating sbb-tag usages');
      this._tags.forEach((e) => this._handleTag(e));
    }
  }

  private _handleTag(element: MigrationElement) {
    const label = element.findProperty('label')!;
    label.remove();
    element.insertStart(label.toTextNode());
  }
}
