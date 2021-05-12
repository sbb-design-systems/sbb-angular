import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';
import * as ts from 'typescript';

export class IconProviderMigration extends Migration<any, DevkitContext> {
  enabled: boolean = this.targetVersion === TargetVersion.V12;

  private readonly _identifier = 'SBB_ICON_REGISTRY_PROVIDER';
  private _nodes: ts.Identifier[] = [];

  /** Method can be used to perform global analysis of the program. */
  init(): void {}

  /**
   * Method that will be called for each node in a given source file. Unlike tslint, this
   * function will only retrieve TypeScript nodes that need to be casted manually. This
   * allows us to only walk the program source files once per program and not per
   * migration rule (significant performance boost).
   */
  visitNode(node: ts.Node): void {
    if (ts.isIdentifier(node) && node.getText() === this._identifier) {
      this._nodes.push(node);
    }
  }

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(_template: ResolvedResource): void {}

  /** Method that will be called for each stylesheet in the program. */
  visitStylesheet(_stylesheet: ResolvedResource): void {}

  /**
   * Method that will be called once all nodes, templates and stylesheets
   * have been visited.
   */
  postAnalysis(): void {
    if (!this._nodes.length) {
      return;
    }

    for (const node of this._nodes) {
      const fileName = this.fileSystem.resolve(node.getSourceFile().fileName);
      const recorder = this.fileSystem.edit(fileName);
      recorder.remove(node.getFullStart(), node.getFullWidth());
    }

    this.logger.info(`Removed obsolete occurences of ${this._identifier}`);
  }
}
