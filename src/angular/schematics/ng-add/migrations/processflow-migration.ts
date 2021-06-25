import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry, nodeCheck } from '../../utils';

/**
 * Migration that updates sbb-processflow usages to the new implementation.
 */
export class ProcessflowMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _processflowElements = new MigrationRecorderRegistry(this);

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-processflow')) {
        this._processflowElements.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._processflowElements.empty) {
      this.logger.info('Migrating sbb-processflow');
      this._processflowElements.forEach((e) => this._handleProcessflow(e));
    }
  }

  private _handleProcessflow(element: MigrationElement) {
    const skippable = element.findProperty('skippable');
    if (skippable) {
      skippable.remove();
    } else {
      element.appendProperty('linear');
    }

    for (const property of element.properties()) {
      if (property.name.startsWith('#')) {
        const name = property.name.substr(1);
        const prevStepRegex = new RegExp(`${name}\\.prevStep()`, 'g');
        let match: RegExpMatchArray | null;
        while ((match = prevStepRegex.exec(element.resource.content))) {
          const index = element.resource.start + match.index! + name.length + 5;
          element.recorder.remove(index, 4);
          element.recorder.insertRight(index, 'ious');
        }
        const nextStepRegex = new RegExp(`${name}\\.nextStep()`, 'g');
        while ((match = nextStepRegex.exec(element.resource.content))) {
          const index = element.resource.start + match.index! + name.length + 5;
          element.recorder.remove(index, 4);
        }
      }
    }
  }
}
