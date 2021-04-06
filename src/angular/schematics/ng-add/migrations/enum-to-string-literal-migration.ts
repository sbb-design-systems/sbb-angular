import { DevkitContext, Migration, TargetVersion, VersionChanges } from '@angular/cdk/schematics';
import * as ts from 'typescript';

export interface EnumKeysToStringLiteralData {
  map: { [key: string]: string };
  limitedTo: { enum: string };
}

export const enumMaps: VersionChanges<EnumKeysToStringLiteralData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          map: {
            GENERIC_DOC: 'generic',
            DOC: 'doc',
            IMAGE: 'image',
            PDF: 'pdf',
            AUDIO: 'audio',
            VIDEO: 'video',
            ZIP: 'zip',
          },
          limitedTo: {
            enum: 'FileTypeCategory',
          },
        },
      ],
    },
  ],
};

/**
 * Migration that converts enum usages to string literal.
 */
export class EnumToStringLiteralMigration extends Migration<null, DevkitContext> {
  /** Change data that upgrades to the specified target version. */
  data: EnumKeysToStringLiteralData[] =
    enumMaps[this.targetVersion]?.reduce(
      (current, next) => current.concat(next.changes),
      [] as EnumKeysToStringLiteralData[]
    ) ?? [];

  // Only enable the migration rule if there is upgrade data.
  enabled = this.data.length !== 0;

  /**
   * Method that will be called for each node in a given source file. Unlike tslint, this
   * function will only retrieve TypeScript nodes that need to be casted manually. This
   * allows us to only walk the program source files once per program and not per
   * migration rule (significant performance boost).
   */
  visitNode(node: ts.Node): void {
    if (ts.isPropertyAccessExpression(node)) {
      this._visitPropertyAccessExpression(node);
    }
  }

  private _visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
    this.data.forEach((data) => {
      if (!(node.name.text in data.map)) {
        return;
      }

      if (!data.limitedTo || data.limitedTo.enum === node.expression.getText()) {
        this.fileSystem
          .edit(this.fileSystem.resolve(node.getSourceFile().fileName))
          .remove(node.getStart(), node.getWidth())
          .insertRight(node.getStart(), `'${data.map[node.name.text]}'`);
      }
    });
  }
}
