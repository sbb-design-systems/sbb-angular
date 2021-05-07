import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry, nodeCheck } from '../../utils';

/**
 * Migration that updates sbb-search usages to the new format.
 */
export class SearchMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _searchElements = new MigrationRecorderRegistry(this);
  private _searchProperties = ['(search)', 'class'];

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-search')) {
        this._searchElements.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._searchElements.empty) {
      this.logger.info('Migrating sbb-search usages');
      this._searchElements.forEach((e) => this._handleSearch(e));
    }
  }

  private _handleSearch(element: MigrationElement) {
    const properties = element
      .properties()
      .filter((p) => !this._searchProperties.includes(p.attribute.name));
    properties.forEach((p) => p.remove());

    element.insertStart(`<input ${properties.map((p) => p.toString()).join(' ')} />`);
  }
}
