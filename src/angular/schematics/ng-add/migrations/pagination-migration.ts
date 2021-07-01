import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';

import { iterateNodes, MigrationElement, MigrationRecorderRegistry, nodeCheck } from '../../utils';

/**
 * Migration that updates replaces <sbb-pagination> instances with <sbb-paginator>.
 */
export class PaginationMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _paginations = new MigrationRecorderRegistry(this);

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) => {
      if (nodeCheck(node).is('sbb-pagination')) {
        this._paginations.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._paginations.empty) {
      this.logger.info('Migrating sbb-pagination usages');
      this.logger.info(
        '  See documentation at https://angular.app.sbb.ch/angular/introduction/migration-guide on how to configure sbb-paginator'
      );
      this._paginations.forEach((e) => this._handlePagination(e));
    }
  }

  private _handlePagination(element: MigrationElement) {
    const pageChangeProperty = element.findProperty('pageChange');
    const length = element.findProperty('length');
    if (pageChangeProperty) {
      pageChangeProperty.rename('(page)');
    }
    if (length) {
      length.replaceValue(
        `TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10`
      );
    }
  }
}
